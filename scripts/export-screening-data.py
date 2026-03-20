#!/usr/bin/env python3
"""
Export listing_raw records from screener.db to screening-data.json format.
Reads 2511 records, calculates scores/finance, outputs ranked JSON.
"""
from __future__ import annotations

import json
import math
import re
import sqlite3
from datetime import datetime, timezone

DB_PATH = "/Users/otsukatakao/projects/becominglab/real-estate-screener/prisma/data/screener.db"
OUTPUT_PATH = "/Users/otsukatakao/projects/becominglab/public/s/inv-a8f3e1d9/screening-data.json"

CURRENT_YEAR = 2026

# Durability by structure type (years)
DURABILITY = {"SRC": 47, "RC": 47, "S": 34, "LS": 27, "W": 22}

# Structure name mapping (Japanese -> code)
STRUCTURE_MAP = {
    "鉄骨鉄筋コンクリート造": "SRC",
    "SRC造": "SRC",
    "SRC": "SRC",
    "鉄筋コンクリート造": "RC",
    "RC造": "RC",
    "RC": "RC",
    "鉄骨造": "S",
    "S造": "S",
    "S": "S",
    "軽量鉄骨造": "LS",
    "LS造": "LS",
    "LS": "LS",
    "木造": "W",
    "W造": "W",
    "W": "W",
}

# Finance constants
LOAN_INTEREST_PCT = 1.5
LOAN_YEARS = 30
ROAD_VALUE_JPY_PER_SQM = 500000
SELF_FUNDING_RATIO = 0.10
EXPENSE_RATIO = 0.16


def parse_price(s: str) -> int | None:
    """Parse Japanese price string to integer yen."""
    if not s:
        return None
    s = s.strip().replace(",", "").replace("¥", "")
    # Handle 億 + 万円 pattern: "1億2000万円"
    m = re.match(r"(\d+)億(\d+)万円?", s)
    if m:
        return int(m.group(1)) * 100_000_000 + int(m.group(2)) * 10_000
    # Handle 億円 only: "1億円"
    m = re.match(r"(\d+)億円?", s)
    if m:
        return int(m.group(1)) * 100_000_000
    # Handle 万円 only: "6800万円"
    m = re.match(r"(\d+)万円?", s)
    if m:
        return int(m.group(1)) * 10_000
    # Try plain number
    m = re.match(r"(\d+)", s)
    if m:
        return int(m.group(1))
    return None


def parse_yield(s: str) -> float | None:
    """Parse yield string like '9.5%' to float 9.5."""
    if not s:
        return None
    m = re.search(r"([\d.]+)\s*%", s)
    if m:
        try:
            return float(m.group(1))
        except ValueError:
            return None
    return None


def parse_area(s: str) -> float | None:
    """Parse area string like '180㎡' or '180.5m2' to float."""
    if not s:
        return None
    m = re.search(r"([\d.]+)\s*[㎡m]", s)
    if m:
        try:
            return float(m.group(1))
        except ValueError:
            return None
    return None


def parse_compound_area(s: str):
    """Parse combined area string like '建物151.04㎡ / 土地 141.57㎡' -> (building, land)."""
    if not s:
        return None, None
    building = None
    land = None
    # Try "建物XXX㎡"
    m = re.search(r"建物\s*([\d.]+)\s*[㎡m]", s)
    if m:
        building = float(m.group(1))
    # Try "土地\s*XXX㎡"
    m = re.search(r"土地\s*([\d.]+)\s*[㎡m]", s)
    if m:
        land = float(m.group(1))
    # Try "専有 XXX㎡" (for condos, use as building area)
    if building is None:
        m = re.search(r"専有\s*([\d.]+)\s*[㎡m]", s)
        if m:
            building = float(m.group(1))
    return building, land


def parse_built_date(s: str):
    """Parse built date like '2005年3月' or '1987年03月（築40年）' -> (year, month)."""
    if not s:
        return None, None
    m = re.search(r"(\d{4})年(\d{1,2})月", s)
    if m:
        return int(m.group(1)), int(m.group(2))
    m = re.search(r"(\d{4})年", s)
    if m:
        return int(m.group(1)), 1
    return None, None


def parse_total_units(s: str) -> int | None:
    """Parse total units like '9戸' -> 9."""
    if not s:
        return None
    m = re.search(r"(\d+)\s*戸", str(s))
    if m:
        return int(m.group(1))
    # Try plain number
    if isinstance(s, (int, float)):
        return int(s)
    m = re.match(r"(\d+)", str(s))
    if m:
        return int(m.group(1))
    return None


def normalize_structure(s: str) -> str | None:
    """Normalize structure type to code."""
    if not s:
        return None
    s = s.strip()
    if s in STRUCTURE_MAP:
        return STRUCTURE_MAP[s]
    # Try partial matching
    for key, val in STRUCTURE_MAP.items():
        if key in s:
            return val
    return None


def parse_transport(s: str):
    """Parse transport string -> (line, station_name, walk_min)."""
    if not s:
        return None, None, None
    # Pattern: "JR中央線 中野駅 徒歩6分"
    m = re.match(r"(.+?)\s+(.+?)駅\s+徒歩(\d+)分", s)
    if m:
        return m.group(1).strip(), m.group(2).strip(), int(m.group(3))
    # Try without space before station
    m = re.search(r"(.+?)\s+(.+?)駅.*?徒歩(\d+)分", s)
    if m:
        return m.group(1).strip(), m.group(2).strip(), int(m.group(3))
    return None, None, None


def extract_ward(address: str) -> str | None:
    """Extract ward (区) or city from address."""
    if not address:
        return None
    # Try 区
    m = re.search(r"([^\s都道府県]+区)", address)
    if m:
        return m.group(1)
    # Try 市
    m = re.search(r"([^\s都道府県]+市)", address)
    if m:
        return m.group(1)
    return None


def pmt(rate_annual: float, years: int, principal: int) -> float:
    """Calculate monthly payment (元利均等) PMT."""
    r = rate_annual / 100 / 12
    n = years * 12
    if r == 0:
        return principal / n
    return principal * r * (1 + r) ** n / ((1 + r) ** n - 1)


def calc_scores(walk_min, gross_yield, repayment_ratio, age_years, durable_years, valuation_ratio, monthly_cf):
    """Calculate simplified scores."""
    # location (max 15)
    if walk_min is not None:
        if walk_min <= 5:
            location = 15
        elif walk_min <= 10:
            location = 12
        elif walk_min <= 15:
            location = 9
        else:
            location = 6
    else:
        location = 6

    # profitability (max 15)
    if gross_yield is not None:
        if gross_yield >= 15:
            profitability = 15
        elif gross_yield >= 10:
            profitability = 12
        elif gross_yield >= 8:
            profitability = 10
        elif gross_yield >= 6:
            profitability = 8
        else:
            profitability = 5
    else:
        profitability = 5

    # financing (max 15) - based on loan repayment ratio (lower is better)
    if repayment_ratio is not None:
        if repayment_ratio <= 30:
            financing = 15
        elif repayment_ratio <= 40:
            financing = 12
        elif repayment_ratio <= 50:
            financing = 10
        elif repayment_ratio <= 60:
            financing = 8
        else:
            financing = 5
    else:
        financing = 5

    # risk (max 15) - based on remaining useful life
    remaining = max(0, (durable_years or 0) - (age_years or 0))
    if remaining >= 20:
        risk = 15
    elif remaining >= 10:
        risk = 12
    elif remaining >= 5:
        risk = 9
    elif remaining > 0:
        risk = 7
    else:
        risk = 4

    # valuation (max 15)
    if valuation_ratio is not None:
        if valuation_ratio >= 120:
            valuation = 15
        elif valuation_ratio >= 100:
            valuation = 12
        elif valuation_ratio >= 80:
            valuation = 10
        elif valuation_ratio >= 60:
            valuation = 8
        else:
            valuation = 5
    else:
        valuation = 5

    # cashflow (max 15)
    if monthly_cf is not None:
        if monthly_cf >= 200000:
            cashflow = 15
        elif monthly_cf >= 100000:
            cashflow = 12
        elif monthly_cf >= 50000:
            cashflow = 10
        elif monthly_cf > 0:
            cashflow = 8
        else:
            cashflow = 3
    else:
        cashflow = 5

    # marketTrend: fixed 8
    market_trend = 8

    total = location + profitability + financing + risk + valuation + cashflow + market_trend

    return {
        "location": location,
        "profitability": profitability,
        "financing": financing,
        "risk": risk,
        "valuation": valuation,
        "cashflow": cashflow,
        "marketTrend": market_trend,
    }, total


def buy_judgment(score_total: float) -> str:
    if score_total >= 75:
        return "buy"
    elif score_total >= 60:
        return "watch"
    elif score_total >= 45:
        return "hold"
    else:
        return "skip"


def process_record(row):
    """Process a single DB row into a screening item. Returns None if invalid."""
    source_site = row["source_site"]
    source_url = row["source_url"]
    listing_id = row["listing_id"]

    try:
        raw = json.loads(row["raw_json"])
    except (json.JSONDecodeError, TypeError):
        return None

    # Parse price and yield (required)
    price = parse_price(raw.get("price", ""))
    gross_yield = parse_yield(raw.get("yield", ""))
    if price is None or gross_yield is None or price <= 0 or gross_yield <= 0:
        return None

    # Address / ward
    address = raw.get("address", "")
    ward = extract_ward(address)

    # Structure
    structure = normalize_structure(raw.get("structure", ""))

    # Built date
    built_year, built_month = parse_built_date(raw.get("builtDate", ""))

    # Total units
    total_units = parse_total_units(raw.get("totalUnits", ""))

    # Areas - try direct fields first, then compound 'area' field
    building_area = parse_area(raw.get("buildingArea", ""))
    land_area = parse_area(raw.get("landArea", ""))
    if building_area is None or land_area is None:
        b, l = parse_compound_area(raw.get("area", ""))
        if building_area is None:
            building_area = b
        if land_area is None:
            land_area = l

    # Transport
    line, station_name, walk_min = parse_transport(raw.get("transport", ""))

    # Source URL: prefer detailUrl from raw_json, fallback to DB source_url
    detail_url = raw.get("detailUrl", "") or source_url

    # --- Finance calculations ---
    annual_rent = price * gross_yield / 100
    annual_expense = annual_rent * EXPENSE_RATIO
    borrow_amount = int(price * (1 - SELF_FUNDING_RATIO))
    self_funding = price - borrow_amount
    monthly_loan = pmt(LOAN_INTEREST_PCT, LOAN_YEARS, borrow_amount)
    annual_loan = monthly_loan * 12
    annual_cf = annual_rent - annual_expense - annual_loan
    monthly_cf = annual_cf / 12
    full_cf_pct = (annual_cf / annual_rent * 100) if annual_rent > 0 else 0
    ccr_pct = (annual_cf / self_funding * 100) if self_funding > 0 else 0
    repayment_ratio = (annual_loan / annual_rent * 100) if annual_rent > 0 else 100

    # --- Valuation ---
    land_valuation = (ROAD_VALUE_JPY_PER_SQM * land_area) if land_area else 0
    building_valuation = 0
    total_valuation = land_valuation + building_valuation
    valuation_ratio = (total_valuation / price * 100) if price > 0 else 0

    durable_years = DURABILITY.get(structure, 22)  # default W
    age_years = (CURRENT_YEAR - built_year) if built_year else None
    remaining_years = max(0, durable_years - (age_years or 0))

    # --- Safety ---
    # Safety calculation: assume 80% occupancy
    safe_monthly_rent = annual_rent / 12 * 0.8
    safe_monthly_expense = annual_expense / 12
    # Safety loan: 2% interest, 25 years
    safe_monthly_loan = pmt(2.0, 25, borrow_amount)
    safe_monthly_cf = safe_monthly_rent - safe_monthly_expense - safe_monthly_loan

    # --- Scores ---
    scores, score_total = calc_scores(
        walk_min, gross_yield, repayment_ratio,
        age_years, durable_years, valuation_ratio, monthly_cf
    )

    # Build property name
    ward_str = ward or ""
    units_str = f"{total_units}戸" if total_units else ""
    year_str = f"築{built_year}年" if built_year else ""
    station_str = f"{station_name}駅" if station_name else ""
    property_name = " ".join(filter(None, [ward_str, units_str, year_str, station_str]))
    if not property_name:
        property_name = raw.get("title", "") or address or f"物件-{listing_id}"

    # Canonical ID
    canonical_id = f"{source_site}-{listing_id}"

    station1 = None
    if line or station_name or walk_min is not None:
        station1 = {
            "line": line,
            "name": station_name,
            "walkMin": walk_min,
        }

    return {
        "rank": 0,  # will be set later
        "canonicalId": canonical_id,
        "propertyName": property_name,
        "ward": ward,
        "scoreTotal": score_total,
        "buyJudgment": buy_judgment(score_total),
        "isNewEntry": True,
        "rankChange": None,
        "priceChange": None,
        "property": {
            "address": address,
            "structureType": structure,
            "builtYear": built_year,
            "builtMonth": built_month,
            "landAreaSqm": land_area,
            "buildingAreaSqm": building_area,
            "totalFloors": None,
            "totalUnits": total_units,
            "imageUrl": None,
            "sourceSite": source_site,
            "sourceUrl": detail_url,
            "price": price,
            "annualFullRentJpy": round(annual_rent, 2),
            "loanInterestPct": LOAN_INTEREST_PCT,
            "loanYears": LOAN_YEARS,
            "roadValueJpyPerSqm": ROAD_VALUE_JPY_PER_SQM,
            "station1": station1,
        },
        "finance": {
            "grossYieldPct": gross_yield,
            "currentYieldPct": None,
            "annualExpenseJpy": round(annual_expense, 2),
            "annualLoanPaymentJpy": round(annual_loan, 2),
            "monthlyLoanPaymentJpy": round(monthly_loan, 2),
            "annualFullCfJpy": round(annual_cf, 2),
            "annualCurrentCfJpy": None,
            "monthlyFullCfJpy": round(monthly_cf, 2),
            "monthlyCurrentCfJpy": None,
            "fullCfPct": round(full_cf_pct, 2),
            "currentCfPct": None,
            "ccrPct": round(ccr_pct, 2),
            "loanRepaymentRatioPct": round(repayment_ratio, 2),
            "borrowAmount": borrow_amount,
        },
        "valuation": {
            "landValuationJpy": round(land_valuation, 2),
            "buildingValuationJpy": 0,
            "totalValuationJpy": round(total_valuation, 2),
            "valuationRatioPct": round(valuation_ratio, 2),
            "durableYears": durable_years,
            "ageYears": age_years,
            "remainingYears": remaining_years,
        },
        "safety": {
            "safeMonthlyRentJpy": round(safe_monthly_rent, 2),
            "safeMonthlyExpenseJpy": round(safe_monthly_expense, 2),
            "safeMonthlyLoanJpy": round(safe_monthly_loan, 2),
            "safeMonthlyCfJpy": round(safe_monthly_cf, 2),
            "isSafe": safe_monthly_cf > 0,
        },
        "scores": scores,
    }


def main():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("SELECT source_site, source_url, listing_id, raw_json FROM listing_raw")
    rows = cur.fetchall()
    conn.close()

    print(f"Total records in DB: {len(rows)}")

    results = []
    skipped = 0
    for row in rows:
        item = process_record(row)
        if item is not None:
            results.append(item)
        else:
            skipped += 1

    # Sort by scoreTotal descending
    results.sort(key=lambda x: x["scoreTotal"], reverse=True)

    # Assign ranks
    for i, item in enumerate(results, 1):
        item["rank"] = i

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    output = {
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "generatedAt": now,
        "count": len(results),
        "rankings": results,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Exported: {len(results)} properties")
    print(f"Skipped: {skipped} (no valid price/yield)")
    print(f"Output: {OUTPUT_PATH}")

    # Show judgment distribution
    from collections import Counter
    judgments = Counter(item["buyJudgment"] for item in results)
    print(f"Judgments: {dict(judgments)}")

    # Show top 3
    for item in results[:3]:
        print(f"  #{item['rank']} {item['propertyName']} score={item['scoreTotal']} → {item['buyJudgment']}")


if __name__ == "__main__":
    main()

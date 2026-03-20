"use client";

import { useState, useMemo } from "react";

type HousingType = "mansion" | "detached" | null;
type RoomSize = "6" | "8" | "10" | "12" | "15" | "20" | null;
type ColorTone = "white" | "beige" | "gray" | "brown" | "black" | "green" | null;
type Style = "natural" | "modern" | "nordic" | "industrial" | "japandi" | "coastal" | null;

type Product = {
  name: string;
  category: string;
  price: string;
  url: string;
  matchStyles: Style[];
  matchColors: ColorTone[];
  description: string;
};

const PRODUCTS: Product[] = [
  {
    name: "SIEVE merge sofa",
    category: "ソファ",
    price: "¥198,000〜",
    url: "https://www.livinghouse-store.jp/c/sofa",
    matchStyles: ["natural", "nordic"],
    matchColors: ["beige", "gray", "white"],
    description: "やわらかなフォルムと木脚が調和するソファ",
  },
  {
    name: "SIEVE rect unit sofa",
    category: "ソファ",
    price: "¥165,000〜",
    url: "https://www.livinghouse-store.jp/c/sofa",
    matchStyles: ["modern", "japandi"],
    matchColors: ["gray", "black", "brown"],
    description: "直線的なデザインで空間を引き締めるユニットソファ",
  },
  {
    name: "SIEVE half sofa",
    category: "ソファ",
    price: "¥132,000〜",
    url: "https://www.livinghouse-store.jp/c/sofa",
    matchStyles: ["natural", "coastal"],
    matchColors: ["beige", "white", "green"],
    description: "コンパクトながら座り心地にこだわったソファ",
  },
  {
    name: "SVE-DC004 merge dining chair",
    category: "ダイニングチェア",
    price: "¥33,000〜",
    url: "https://www.livinghouse-store.jp/c/chair",
    matchStyles: ["natural", "nordic"],
    matchColors: ["beige", "white", "brown"],
    description: "無垢材の温もりを感じるダイニングチェア",
  },
  {
    name: "SVE-DC003 board dining chair",
    category: "ダイニングチェア",
    price: "¥27,500〜",
    url: "https://www.livinghouse-store.jp/c/chair",
    matchStyles: ["modern", "industrial"],
    matchColors: ["black", "gray", "brown"],
    description: "スチールと木のコンビネーションチェア",
  },
  {
    name: "SIEVE merge dining table",
    category: "ダイニングテーブル",
    price: "¥110,000〜",
    url: "https://www.livinghouse-store.jp/c/table",
    matchStyles: ["natural", "nordic", "japandi"],
    matchColors: ["beige", "brown", "white"],
    description: "天然木の表情を活かしたダイニングテーブル",
  },
  {
    name: "SIEVE rect dining table",
    category: "ダイニングテーブル",
    price: "¥88,000〜",
    url: "https://www.livinghouse-store.jp/c/table",
    matchStyles: ["modern", "industrial"],
    matchColors: ["black", "gray", "brown"],
    description: "スタイリッシュな鉄脚ダイニングテーブル",
  },
  {
    name: "SVE-SF007 float shelf",
    category: "シェルフ",
    price: "¥55,000〜",
    url: "https://www.livinghouse-store.jp/c/shelf",
    matchStyles: ["natural", "nordic", "coastal"],
    matchColors: ["white", "beige"],
    description: "壁面を活かすフローティングシェルフ",
  },
  {
    name: "SVE-SF008 part shelf",
    category: "シェルフ",
    price: "¥66,000〜",
    url: "https://www.livinghouse-store.jp/c/shelf",
    matchStyles: ["modern", "industrial", "japandi"],
    matchColors: ["black", "gray", "brown"],
    description: "オープン構造で抜け感のあるシェルフ",
  },
  {
    name: "SIEVE center table",
    category: "リビングテーブル",
    price: "¥44,000〜",
    url: "https://www.livinghouse-store.jp/c/table",
    matchStyles: ["natural", "nordic"],
    matchColors: ["beige", "brown", "white"],
    description: "丸みのあるフォルムのセンターテーブル",
  },
  {
    name: "SVE-LT001 iron center table",
    category: "リビングテーブル",
    price: "¥38,500〜",
    url: "https://www.livinghouse-store.jp/c/table",
    matchStyles: ["modern", "industrial"],
    matchColors: ["black", "gray"],
    description: "アイアン脚のモダンセンターテーブル",
  },
  {
    name: "SIEVE pendant light",
    category: "照明",
    price: "¥22,000〜",
    url: "https://www.livinghouse-store.jp/c/light",
    matchStyles: ["natural", "nordic", "coastal"],
    matchColors: ["white", "beige", "green"],
    description: "やさしい光を灯すペンダントライト",
  },
  {
    name: "SVE-LI002 brass pendant",
    category: "照明",
    price: "¥33,000〜",
    url: "https://www.livinghouse-store.jp/c/light",
    matchStyles: ["modern", "japandi", "industrial"],
    matchColors: ["black", "gray", "brown"],
    description: "真鍮の質感が空間を引き立てるペンダント",
  },
  {
    name: "SIEVE TV board",
    category: "TVボード",
    price: "¥77,000〜",
    url: "https://www.livinghouse-store.jp/c/tvboard",
    matchStyles: ["natural", "nordic"],
    matchColors: ["beige", "brown", "white"],
    description: "収納力と佇まいを両立したTVボード",
  },
  {
    name: "SVE-TB002 low TV board",
    category: "TVボード",
    price: "¥66,000〜",
    url: "https://www.livinghouse-store.jp/c/tvboard",
    matchStyles: ["modern", "japandi", "industrial"],
    matchColors: ["black", "gray", "brown"],
    description: "ロースタイルのTVボード",
  },
  {
    name: "ACME Furniture rug",
    category: "ラグ",
    price: "¥33,000〜",
    url: "https://www.livinghouse-store.jp/c/rug",
    matchStyles: ["industrial", "coastal"],
    matchColors: ["beige", "gray", "blue" as ColorTone],
    description: "ヴィンテージ感のあるラグ",
  },
];

const HOUSING_OPTIONS: { value: HousingType; label: string; icon: string }[] = [
  { value: "mansion", label: "マンション", icon: "🏢" },
  { value: "detached", label: "戸建て", icon: "🏠" },
];

const SIZE_OPTIONS: { value: RoomSize; label: string }[] = [
  { value: "6", label: "〜6畳" },
  { value: "8", label: "8畳" },
  { value: "10", label: "10畳" },
  { value: "12", label: "12畳" },
  { value: "15", label: "15畳" },
  { value: "20", label: "20畳〜" },
];

const COLOR_OPTIONS: { value: ColorTone; label: string; hex: string }[] = [
  { value: "white", label: "ホワイト", hex: "#f5f5f0" },
  { value: "beige", label: "ベージュ", hex: "#d4c5a9" },
  { value: "gray", label: "グレー", hex: "#9ca3af" },
  { value: "brown", label: "ブラウン", hex: "#8b6f47" },
  { value: "black", label: "ブラック", hex: "#374151" },
  { value: "green", label: "グリーン", hex: "#6b8f71" },
];

const STYLE_OPTIONS: { value: Style; label: string; sub: string }[] = [
  { value: "natural", label: "ナチュラル", sub: "木の温もり" },
  { value: "modern", label: "モダン", sub: "洗練・シンプル" },
  { value: "nordic", label: "北欧", sub: "やさしい色彩" },
  { value: "industrial", label: "インダストリアル", sub: "無骨な素材感" },
  { value: "japandi", label: "ジャパンディ", sub: "和×北欧" },
  { value: "coastal", label: "コースタル", sub: "海・リゾート" },
];

const STYLE_CONCEPTS: Record<string, { name: string; subtitle: string; desc: string; palette: string[]; features: string[] }> = {
  natural: {
    name: "森の呼吸",
    subtitle: "Forest Breath",
    desc: "無垢材の温もりとグリーンが調和する、自然と共に暮らす空間。光と風を取り込み、素材そのものの美しさを活かしたリビングです。",
    palette: ["#e8dcc8", "#b8a88a", "#6b8f71", "#f5f0e8"],
    features: ["無垢材フローリング", "観葉植物コーナー", "リネンカーテン", "自然光を活かす窓配置"],
  },
  modern: {
    name: "静寂のライン",
    subtitle: "Silent Lines",
    desc: "直線的なフォルムとモノトーンのコントラスト。余計な装飾を排し、素材と光だけで構成される洗練された空間です。",
    palette: ["#1a1a1a", "#4a4a4a", "#f5f5f5", "#c4c4c4"],
    features: ["フラットパネル仕上げ", "間接照明", "ミニマル収納", "マットブラック金物"],
  },
  nordic: {
    name: "ヒュッゲの灯",
    subtitle: "Hygge Light",
    desc: "やさしい色彩と丸みのあるフォルムが心を和ませる、デンマーク流の居心地よい空間。家族が自然と集まるリビングです。",
    palette: ["#f0ebe3", "#b8ccd8", "#e8c8a0", "#d4e0d0"],
    features: ["ペンダントライト", "ラウンドフォルム家具", "ブランケット&クッション", "キャンドルスペース"],
  },
  industrial: {
    name: "鉄と木の対話",
    subtitle: "Iron & Wood",
    desc: "スチール、コンクリート、古材。異素材が対話する無骨で温かい空間。時間と共に味わいが増す本物の素材感です。",
    palette: ["#3d3d3d", "#8b7355", "#a0a0a0", "#c4b89c"],
    features: ["露出配管デザイン", "アイアン棚", "古材アクセントウォール", "エジソンバルブ照明"],
  },
  japandi: {
    name: "間の美学",
    subtitle: "Ma Aesthetics",
    desc: "日本の「間」と北欧の「ヒュッゲ」が融合。余白を大切にしながら、木と和紙の温もりで包み込む静謐な空間です。",
    palette: ["#e8e0d4", "#c4b89c", "#2d2d2d", "#a8b8a0"],
    features: ["障子風パーティション", "ローテーブル", "畳コーナー", "土壁テクスチャー"],
  },
  coastal: {
    name: "潮風のリビング",
    subtitle: "Ocean Breeze",
    desc: "白と青のグラデーション、ラタン素材、流木のアクセント。海辺のリゾートのような開放感あふれるリビングです。",
    palette: ["#f5f5f0", "#87a8c4", "#d4c5a0", "#e8f0f0"],
    features: ["ラタン&ウィッカー家具", "シーブルーアクセント", "天然素材ラグ", "大開口窓"],
  },
};

export default function QuickConceptTab() {
  const [housing, setHousing] = useState<HousingType>(null);
  const [roomSize, setRoomSize] = useState<RoomSize>(null);
  const [colorTone, setColorTone] = useState<ColorTone>(null);
  const [style, setStyle] = useState<Style>(null);
  const [showResult, setShowResult] = useState(false);
  const [floorplanUrl, setFloorplanUrl] = useState<string | null>(null);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);
  const [isGeneratingFloorplan, setIsGeneratingFloorplan] = useState(false);
  const [isGeneratingRender, setIsGeneratingRender] = useState(false);

  const step = housing === null ? 1 : roomSize === null ? 2 : colorTone === null ? 3 : style === null ? 4 : 5;
  const isComplete = housing && roomSize && colorTone && style;

  const concept = style ? STYLE_CONCEPTS[style] : null;

  const generateFloorplanSvg = (): string => {
    const w = 900;
    const h = 900;
    const isMansion = housing === "mansion";
    const sqm = Number(roomSize) * 1.65;
    const roomW = Math.round(sqm / Math.sqrt(sqm / 4 * 3) * 1000);
    const roomH = Math.round(Math.sqrt(sqm / 4 * 3) * 1000);
    const wLabel = (roomW / 1000).toFixed(1);
    const hLabel = (roomH / 1000).toFixed(1);
    const isSmall = Number(roomSize) <= 8;
    const wallT = 12; // wall thickness in SVG units

    // Drawing area
    const ox = 100; // origin x
    const oy = 100; // origin y
    const scale = Math.min(600 / roomW, 600 / roomH) * 1000;
    const rw = Math.round(roomW * scale / 1000);
    const rh = Math.round(roomH * scale / 1000);

    // Furniture sizes (scaled)
    const sofaW = isSmall ? Math.round(rw * 0.32) : Math.round(rw * 0.28);
    const sofaD = Math.round(sofaW * 0.38);
    const ctW = Math.round(sofaW * 0.55);
    const ctD = Math.round(ctW * 0.5);
    const tvW = Math.round(rw * 0.25);
    const dtW = isSmall ? Math.round(rw * 0.18) : Math.round(rw * 0.2);
    const dtD = Math.round(dtW * 0.6);
    const chairW = Math.round(dtW * 0.2);
    const chairD = Math.round(chairW * 0.9);

    // Kitchen counter
    const kcW = Math.round(rw * 0.38);
    const kcD = Math.round(rw * 0.08);
    const kcX = ox + rw - kcW - Math.round(rw * 0.05);
    const kcY = oy + wallT + Math.round(rh * 0.02);

    // Living area center
    const lvCx = ox + Math.round(rw * 0.45);
    const lvCy = oy + Math.round(rh * 0.68);

    // Dining area center
    const dnCx = ox + Math.round(rw * 0.72);
    const dnCy = oy + Math.round(rh * 0.2);

    // Window positions
    const mainWinX = ox + Math.round(rw * 0.15);
    const mainWinW = Math.round(rw * 0.45);
    const sideWinY = oy + Math.round(rh * 0.2);
    const sideWinH = Math.round(rh * 0.35);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8e4de" stroke-width="0.5"/>
        </pattern>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#ccc" stroke-width="0.5"/>
        </pattern>
      </defs>
      <!-- Background with grid -->
      <rect width="${w}" height="${h}" fill="#FFFFFF"/>
      <rect x="${ox-20}" y="${oy-20}" width="${rw+40}" height="${rh+40}" fill="url(#grid)"/>

      <!-- Title block -->
      <text x="${w/2}" y="35" fill="#333" font-size="16" text-anchor="middle" font-family="'Helvetica Neue', sans-serif" font-weight="600">${isMansion ? "マンション" : "戸建て"} LDK ${roomSize}畳 — ${styleLabel}スタイル</text>
      <text x="${w/2}" y="55" fill="#999" font-size="11" text-anchor="middle" font-family="'Helvetica Neue', sans-serif">S = 1:50 ｜ ${sqm.toFixed(1)}m² ｜ 参考レイアウト</text>

      <!-- North arrow -->
      <g transform="translate(${w-60}, 50)">
        <polygon points="0,-20 5,-5 -5,-5" fill="#333"/>
        <line x1="0" y1="-5" x2="0" y2="15" stroke="#333" stroke-width="1.5"/>
        <text x="0" y="-24" fill="#333" font-size="10" text-anchor="middle" font-family="sans-serif" font-weight="700">N</text>
      </g>

      <!-- Outer walls (thick) -->
      <rect x="${ox}" y="${oy}" width="${rw}" height="${rh}" fill="#FAFAF8" stroke="#1a1a1a" stroke-width="${wallT}"/>
      <!-- Inner fill (room floor) -->
      <rect x="${ox+wallT/2}" y="${oy+wallT/2}" width="${rw-wallT}" height="${rh-wallT}" fill="#FAFAF8" stroke="none"/>

      <!-- Flooring pattern - wood grain lines -->
      ${Array.from({length: Math.floor(rw/18)}, (_, i) => `<line x1="${ox+wallT+i*18}" y1="${oy+wallT}" x2="${ox+wallT+i*18}" y2="${oy+rh-wallT}" stroke="#eee" stroke-width="0.3"/>`).join('')}

      <!-- Kitchen partition wall -->
      <rect x="${ox+Math.round(rw*0.55)}" y="${oy}" width="${wallT*0.6}" height="${Math.round(rh*0.4)}" fill="#1a1a1a"/>
      <text x="${ox+Math.round(rw*0.55)+wallT}" y="${oy+Math.round(rh*0.2)}" fill="#888" font-size="9" font-family="sans-serif" transform="rotate(90,${ox+Math.round(rw*0.55)+wallT},${oy+Math.round(rh*0.2)})">仕切壁</text>

      <!-- Kitchen counter (I-type or L-type) -->
      <rect x="${kcX}" y="${kcY}" width="${kcW}" height="${kcD}" fill="url(#hatch)" stroke="#555" stroke-width="1.5"/>
      <rect x="${kcX}" y="${kcY}" width="${kcW}" height="${kcD}" fill="none" stroke="#333" stroke-width="1"/>
      <!-- Sink circle -->
      <circle cx="${kcX+Math.round(kcW*0.35)}" cy="${kcY+Math.round(kcD*0.5)}" r="${Math.round(kcD*0.25)}" fill="none" stroke="#777" stroke-width="1"/>
      <!-- Stove -->
      <circle cx="${kcX+Math.round(kcW*0.7)}" cy="${kcY+Math.round(kcD*0.35)}" r="${Math.round(kcD*0.15)}" fill="none" stroke="#777" stroke-width="0.8"/>
      <circle cx="${kcX+Math.round(kcW*0.8)}" cy="${kcY+Math.round(kcD*0.65)}" r="${Math.round(kcD*0.15)}" fill="none" stroke="#777" stroke-width="0.8"/>
      <!-- Fridge -->
      <rect x="${kcX+kcW+8}" y="${kcY}" width="${Math.round(kcD*0.8)}" height="${Math.round(kcD*1.2)}" fill="#eee" stroke="#777" stroke-width="1"/>
      <text x="${kcX+kcW+8+Math.round(kcD*0.4)}" y="${kcY+Math.round(kcD*0.65)}" fill="#999" font-size="8" text-anchor="middle" font-family="sans-serif">冷蔵庫</text>
      <text x="${kcX+Math.round(kcW*0.5)}" y="${kcY+kcD+14}" fill="#888" font-size="9" text-anchor="middle" font-family="sans-serif">キッチン</text>

      <!-- Room labels -->
      <text x="${ox+Math.round(rw*0.35)}" y="${oy+Math.round(rh*0.42)}" fill="#666" font-size="13" text-anchor="middle" font-family="sans-serif" font-weight="600" letter-spacing="0.15em">リビング</text>
      <text x="${dnCx}" y="${oy+Math.round(rh*0.42)}" fill="#666" font-size="13" text-anchor="middle" font-family="sans-serif" font-weight="600" letter-spacing="0.15em">ダイニング</text>

      <!-- Main window (south - balcony side) -->
      <rect x="${mainWinX}" y="${oy+rh-wallT/2-2}" width="${mainWinW}" height="${wallT+4}" fill="white" stroke="none"/>
      <line x1="${mainWinX}" y1="${oy+rh-2}" x2="${mainWinX+mainWinW}" y2="${oy+rh-2}" stroke="#333" stroke-width="2"/>
      <line x1="${mainWinX}" y1="${oy+rh+2}" x2="${mainWinX+mainWinW}" y2="${oy+rh+2}" stroke="#333" stroke-width="2"/>
      <line x1="${mainWinX}" y1="${oy+rh}" x2="${mainWinX+mainWinW}" y2="${oy+rh}" stroke="#333" stroke-width="0.5"/>
      <!-- Window mullions -->
      <line x1="${mainWinX+Math.round(mainWinW*0.33)}" y1="${oy+rh-3}" x2="${mainWinX+Math.round(mainWinW*0.33)}" y2="${oy+rh+3}" stroke="#333" stroke-width="1"/>
      <line x1="${mainWinX+Math.round(mainWinW*0.67)}" y1="${oy+rh-3}" x2="${mainWinX+Math.round(mainWinW*0.67)}" y2="${oy+rh+3}" stroke="#333" stroke-width="1"/>
      <!-- Balcony -->
      <rect x="${mainWinX-10}" y="${oy+rh+wallT/2}" width="${mainWinW+20}" height="30" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="${mainWinX+Math.round(mainWinW*0.5)}" y="${oy+rh+wallT/2+18}" fill="#aaa" font-size="9" text-anchor="middle" font-family="sans-serif">バルコニー</text>

      ${isMansion ? '' : `<!-- Side window (east - detached house) -->
      <rect x="${ox+rw-wallT/2-2}" y="${sideWinY}" width="${wallT+4}" height="${sideWinH}" fill="white" stroke="none"/>
      <line x1="${ox+rw-2}" y1="${sideWinY}" x2="${ox+rw-2}" y2="${sideWinY+sideWinH}" stroke="#333" stroke-width="2"/>
      <line x1="${ox+rw+2}" y1="${sideWinY}" x2="${ox+rw+2}" y2="${sideWinY+sideWinH}" stroke="#333" stroke-width="2"/>
      <line x1="${ox+rw}" y1="${sideWinY}" x2="${ox+rw}" y2="${sideWinY+sideWinH}" stroke="#333" stroke-width="0.5"/>`}

      <!-- Entry door with arc -->
      <rect x="${ox-1}" y="${oy+Math.round(rh*0.08)}" width="${wallT+2}" height="${Math.round(rh*0.1)}" fill="white" stroke="none"/>
      <line x1="${ox+wallT}" y1="${oy+Math.round(rh*0.08)}" x2="${ox+wallT}" y2="${oy+Math.round(rh*0.08)+Math.round(rh*0.1)}" stroke="#333" stroke-width="2"/>
      <path d="M ${ox+wallT} ${oy+Math.round(rh*0.08)} A ${Math.round(rh*0.1)} ${Math.round(rh*0.1)} 0 0 1 ${ox+wallT+Math.round(rh*0.1)} ${oy+Math.round(rh*0.08)+Math.round(rh*0.1)}" fill="none" stroke="#333" stroke-width="1" stroke-dasharray="3,3"/>

      <!-- Sofa (detailed top view) -->
      <g transform="translate(${lvCx-sofaW/2},${lvCy})">
        <!-- Back rest -->
        <rect x="0" y="0" width="${sofaW}" height="${Math.round(sofaD*0.25)}" rx="3" fill="#ddd" stroke="#888" stroke-width="1"/>
        <!-- Seat cushions -->
        <rect x="2" y="${Math.round(sofaD*0.25)}" width="${Math.round(sofaW*0.48)}" height="${Math.round(sofaD*0.7)}" rx="4" fill="#e8e3db" stroke="#999" stroke-width="0.8"/>
        <rect x="${Math.round(sofaW*0.52)}" y="${Math.round(sofaD*0.25)}" width="${Math.round(sofaW*0.46)}" height="${Math.round(sofaD*0.7)}" rx="4" fill="#e8e3db" stroke="#999" stroke-width="0.8"/>
        <!-- Armrests -->
        <rect x="-${Math.round(sofaD*0.12)}" y="0" width="${Math.round(sofaD*0.12)}" height="${sofaD}" rx="2" fill="#d5d0c8" stroke="#888" stroke-width="0.8"/>
        <rect x="${sofaW}" y="0" width="${Math.round(sofaD*0.12)}" height="${sofaD}" rx="2" fill="#d5d0c8" stroke="#888" stroke-width="0.8"/>
        <text x="${sofaW/2}" y="${sofaD/2+3}" fill="#888" font-size="9" text-anchor="middle" font-family="sans-serif">ソファ</text>
      </g>

      <!-- Coffee table (detailed) -->
      <g transform="translate(${lvCx-ctW/2},${lvCy+sofaD+Math.round(sofaD*0.4)})">
        <rect x="0" y="0" width="${ctW}" height="${ctD}" rx="3" fill="#f0ebe3" stroke="#999" stroke-width="1"/>
        <!-- Table top edge -->
        <rect x="2" y="2" width="${ctW-4}" height="${ctD-4}" rx="2" fill="none" stroke="#ccc" stroke-width="0.5"/>
        <text x="${ctW/2}" y="${ctD/2+3}" fill="#999" font-size="8" text-anchor="middle" font-family="sans-serif">テーブル</text>
      </g>

      <!-- TV board (against wall) -->
      <g transform="translate(${lvCx-tvW/2},${oy+wallT+4})">
        <rect x="0" y="0" width="${tvW}" height="${Math.round(tvW*0.15)}" rx="2" fill="#e5e0d8" stroke="#888" stroke-width="1"/>
        <text x="${tvW/2}" y="${Math.round(tvW*0.1)+2}" fill="#888" font-size="8" text-anchor="middle" font-family="sans-serif">TVボード</text>
        <!-- TV (thin rectangle on board) -->
        <rect x="${Math.round(tvW*0.1)}" y="${-Math.round(tvW*0.02)}" width="${Math.round(tvW*0.8)}" height="${Math.round(tvW*0.02)}" fill="#555" rx="1"/>
      </g>

      <!-- Dining table -->
      <g transform="translate(${dnCx-dtW/2},${dnCy-dtD/2})">
        <rect x="0" y="0" width="${dtW}" height="${dtD}" rx="3" fill="#f0ebe3" stroke="#888" stroke-width="1"/>
        <text x="${dtW/2}" y="${dtD/2+3}" fill="#888" font-size="8" text-anchor="middle" font-family="sans-serif">DT</text>
        <!-- Chairs (4 chairs) -->
        <rect x="${Math.round(dtW*0.15)}" y="${-chairD-4}" width="${chairW}" height="${chairD}" rx="2" fill="#e8e3db" stroke="#999" stroke-width="0.8"/>
        <rect x="${dtW-Math.round(dtW*0.15)-chairW}" y="${-chairD-4}" width="${chairW}" height="${chairD}" rx="2" fill="#e8e3db" stroke="#999" stroke-width="0.8"/>
        <rect x="${Math.round(dtW*0.15)}" y="${dtD+4}" width="${chairW}" height="${chairD}" rx="2" fill="#e8e3db" stroke="#999" stroke-width="0.8"/>
        <rect x="${dtW-Math.round(dtW*0.15)-chairW}" y="${dtD+4}" width="${chairW}" height="${chairD}" rx="2" fill="#e8e3db" stroke="#999" stroke-width="0.8"/>
      </g>

      <!-- Rug (dashed rectangle under sofa area) -->
      <rect x="${lvCx-Math.round(sofaW*0.8)}" y="${lvCy-Math.round(sofaD*0.2)}" width="${Math.round(sofaW*1.6)}" height="${sofaD+ctD+Math.round(sofaD*0.9)}" rx="4" fill="none" stroke="#bbb" stroke-width="0.8" stroke-dasharray="6,3"/>
      <text x="${lvCx+Math.round(sofaW*0.7)}" y="${lvCy+sofaD+ctD+Math.round(sofaD*0.5)}" fill="#bbb" font-size="8" text-anchor="middle" font-family="sans-serif">ラグ</text>

      <!-- Shelf / side board -->
      <rect x="${ox+rw-wallT-Math.round(rw*0.06)}" y="${oy+Math.round(rh*0.55)}" width="${Math.round(rw*0.05)}" height="${Math.round(rh*0.12)}" rx="1" fill="#eee" stroke="#999" stroke-width="0.8"/>

      <!-- Pendant light (circle with cross) -->
      <circle cx="${lvCx}" cy="${lvCy+sofaD+Math.round(sofaD*0.6)}" r="6" fill="none" stroke="#bbb" stroke-width="0.8"/>
      <line x1="${lvCx-4}" y1="${lvCy+sofaD+Math.round(sofaD*0.6)}" x2="${lvCx+4}" y2="${lvCy+sofaD+Math.round(sofaD*0.6)}" stroke="#bbb" stroke-width="0.5"/>
      <line x1="${lvCx}" y1="${lvCy+sofaD+Math.round(sofaD*0.6)-4}" x2="${lvCx}" y2="${lvCy+sofaD+Math.round(sofaD*0.6)+4}" stroke="#bbb" stroke-width="0.5"/>

      <!-- Dining pendant -->
      <circle cx="${dnCx}" cy="${dnCy}" r="5" fill="none" stroke="#bbb" stroke-width="0.8"/>
      <line x1="${dnCx-3}" y1="${dnCy}" x2="${dnCx+3}" y2="${dnCy}" stroke="#bbb" stroke-width="0.5"/>
      <line x1="${dnCx}" y1="${dnCy-3}" x2="${dnCx}" y2="${dnCy+3}" stroke="#bbb" stroke-width="0.5"/>

      <!-- Plant symbol -->
      <circle cx="${ox+rw-wallT-Math.round(rw*0.05)}" cy="${oy+rh-wallT-Math.round(rh*0.06)}" r="${Math.round(rw*0.025)}" fill="none" stroke="#2E9E6E" stroke-width="0.8"/>
      <line x1="${ox+rw-wallT-Math.round(rw*0.05)}" y1="${oy+rh-wallT-Math.round(rh*0.06)-Math.round(rw*0.025)}" x2="${ox+rw-wallT-Math.round(rw*0.05)}" y2="${oy+rh-wallT-Math.round(rh*0.06)+Math.round(rw*0.025)}" stroke="#2E9E6E" stroke-width="0.6"/>
      <line x1="${ox+rw-wallT-Math.round(rw*0.05)-Math.round(rw*0.025)}" y1="${oy+rh-wallT-Math.round(rh*0.06)}" x2="${ox+rw-wallT-Math.round(rw*0.05)+Math.round(rw*0.025)}" y2="${oy+rh-wallT-Math.round(rh*0.06)}" stroke="#2E9E6E" stroke-width="0.6"/>

      <!-- Dimension lines -->
      <!-- Horizontal (bottom) -->
      <line x1="${ox}" y1="${oy+rh+45}" x2="${ox+rw}" y2="${oy+rh+45}" stroke="#333" stroke-width="0.8"/>
      <line x1="${ox}" y1="${oy+rh+38}" x2="${ox}" y2="${oy+rh+52}" stroke="#333" stroke-width="0.8"/>
      <line x1="${ox+rw}" y1="${oy+rh+38}" x2="${ox+rw}" y2="${oy+rh+52}" stroke="#333" stroke-width="0.8"/>
      <!-- Arrowheads -->
      <polygon points="${ox},${oy+rh+45} ${ox+6},${oy+rh+42} ${ox+6},${oy+rh+48}" fill="#333"/>
      <polygon points="${ox+rw},${oy+rh+45} ${ox+rw-6},${oy+rh+42} ${ox+rw-6},${oy+rh+48}" fill="#333"/>
      <text x="${ox+rw/2}" y="${oy+rh+62}" fill="#333" font-size="12" text-anchor="middle" font-family="'Helvetica Neue', sans-serif" font-weight="500">${wLabel}m (${roomW}mm)</text>

      <!-- Vertical (right) -->
      <line x1="${ox+rw+45}" y1="${oy}" x2="${ox+rw+45}" y2="${oy+rh}" stroke="#333" stroke-width="0.8"/>
      <line x1="${ox+rw+38}" y1="${oy}" x2="${ox+rw+52}" y2="${oy}" stroke="#333" stroke-width="0.8"/>
      <line x1="${ox+rw+38}" y1="${oy+rh}" x2="${ox+rw+52}" y2="${oy+rh}" stroke="#333" stroke-width="0.8"/>
      <polygon points="${ox+rw+45},${oy} ${ox+rw+42},${oy+6} ${ox+rw+48},${oy+6}" fill="#333"/>
      <polygon points="${ox+rw+45},${oy+rh} ${ox+rw+42},${oy+rh-6} ${ox+rw+48},${oy+rh-6}" fill="#333"/>
      <text x="${ox+rw+62}" y="${oy+rh/2}" fill="#333" font-size="12" text-anchor="middle" font-family="'Helvetica Neue', sans-serif" font-weight="500" transform="rotate(90,${ox+rw+62},${oy+rh/2})">${hLabel}m (${roomH}mm)</text>

      <!-- Scale bar -->
      <g transform="translate(${ox}, ${h-35})">
        <rect x="0" y="0" width="40" height="6" fill="#333"/>
        <rect x="40" y="0" width="40" height="6" fill="none" stroke="#333" stroke-width="1"/>
        <text x="0" y="18" fill="#666" font-size="9" font-family="sans-serif">0</text>
        <text x="40" y="18" fill="#666" font-size="9" text-anchor="middle" font-family="sans-serif">1m</text>
        <text x="80" y="18" fill="#666" font-size="9" text-anchor="middle" font-family="sans-serif">2m</text>
        <text x="0" y="-4" fill="#999" font-size="8" font-family="sans-serif">SCALE 1:50</text>
      </g>

      <!-- Legend -->
      <g transform="translate(${w-180}, ${h-60})">
        <text x="0" y="0" fill="#888" font-size="9" font-family="sans-serif" font-weight="600">凡例</text>
        <line x1="0" y1="12" x2="20" y2="12" stroke="#333" stroke-width="2"/>
        <line x1="0" y1="12" x2="20" y2="12" stroke="#333" stroke-width="0.5"/>
        <text x="24" y="15" fill="#888" font-size="8" font-family="sans-serif">窓</text>
        <path d="M 60 8 A 10 10 0 0 1 70 18" fill="none" stroke="#333" stroke-width="1" stroke-dasharray="3,2"/>
        <text x="74" y="15" fill="#888" font-size="8" font-family="sans-serif">ドア</text>
        <circle cx="110" cy="12" r="4" fill="none" stroke="#bbb" stroke-width="0.8"/>
        <text x="118" y="15" fill="#888" font-size="8" font-family="sans-serif">照明</text>
      </g>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const generate3dSvg = (): string => {
    const w = 900;
    const h = 680;
    const c = concept?.palette || ["#e0d5c0", "#c4b8a0", "#a09080", "#f0ebe3"];
    const isMansion = housing === "mansion";

    // Style-specific floor and wall colors
    const floorColor = style === "modern" ? "#d0ccc6" : style === "industrial" ? "#b8b0a4" : style === "japandi" ? "#ddd5c8" : "#d4c8b4";
    const wallColor = style === "modern" ? "#f0efed" : style === "industrial" ? "#e0dbd4" : "#f5f2ed";
    const accentWall = style === "industrial" ? "#c4b8a4" : style === "modern" ? "#e8e6e2" : wallColor;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#a8cce0"/>
          <stop offset="40%" stop-color="#c8dce8"/>
          <stop offset="100%" stop-color="#e8f0f4"/>
        </linearGradient>
        <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${floorColor}" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="${floorColor}" stop-opacity="0.9"/>
        </linearGradient>
        <linearGradient id="wl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${wallColor}"/>
          <stop offset="100%" stop-color="${wallColor}" stop-opacity="0.95"/>
        </linearGradient>
        <linearGradient id="ceil" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#f5f3f0"/>
          <stop offset="100%" stop-color="#faf9f7"/>
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#b8d4e4" stop-opacity="0.5"/>
          <stop offset="60%" stop-color="#c8dce8" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#e0ecf2" stop-opacity="0.3"/>
        </linearGradient>
        <linearGradient id="sofa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${c[0]}"/>
          <stop offset="100%" stop-color="${c[1]}"/>
        </linearGradient>
        <linearGradient id="shadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#000" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </linearGradient>
        <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
        <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>

      <!-- Background -->
      <rect width="${w}" height="${h}" fill="#f5f2ed"/>

      <!-- === ROOM STRUCTURE === -->
      <!-- Ceiling -->
      <polygon points="0,0 ${w},0 680,70 110,70" fill="url(#ceil)"/>
      <!-- Back wall -->
      <polygon points="110,70 680,70 680,390 110,390" fill="url(#wl)"/>
      ${style === "industrial" ? `<!-- Brick texture on left side -->
      ${Array.from({length: 16}, (_, row) => Array.from({length: 4}, (_, col) => {
        const bx = 110 + col * 40 + (row % 2) * 20;
        const by = 70 + row * 20;
        return bx < 260 ? `<rect x="${bx}" y="${by}" width="38" height="18" fill="none" stroke="${accentWall}" stroke-width="0.5" stroke-opacity="0.4"/>` : '';
      }).join('')).join('')}` : ''}
      <!-- Left wall -->
      <polygon points="0,0 110,70 110,390 0,${h}" fill="${accentWall}" fill-opacity="0.7"/>
      <!-- Right wall -->
      <polygon points="${w},0 680,70 680,390 ${w},${h}" fill="${wallColor}" fill-opacity="0.5"/>
      <!-- Floor -->
      <polygon points="0,${h} ${w},${h} 680,390 110,390" fill="url(#fl)"/>
      <!-- Floor wood grain lines -->
      ${Array.from({length: 12}, (_, i) => {
        const y = 390 + (h - 390) * (i / 12);
        const lx = 110 - (110 * (y - 390) / (h - 390));
        const rx = 680 + (w - 680) * (y - 390) / (h - 390);
        return `<line x1="${lx}" y1="${y}" x2="${rx}" y2="${y}" stroke="#c4b8a4" stroke-width="0.4" stroke-opacity="0.3"/>`;
      }).join('')}
      <!-- Floor-wall line -->
      <line x1="110" y1="390" x2="680" y2="390" stroke="#d0c8bc" stroke-width="1.5"/>

      <!-- === WINDOWS === -->
      <!-- Large window on back wall -->
      <rect x="180" y="95" width="420" height="220" fill="url(#glass)" rx="1"/>
      <!-- Window frame -->
      <rect x="180" y="95" width="420" height="220" fill="none" stroke="#c0b8b0" stroke-width="4"/>
      <rect x="182" y="97" width="416" height="216" fill="none" stroke="#d8d0c8" stroke-width="1"/>
      <!-- Mullions -->
      <line x1="320" y1="95" x2="320" y2="315" stroke="#c0b8b0" stroke-width="3"/>
      <line x1="460" y1="95" x2="460" y2="315" stroke="#c0b8b0" stroke-width="3"/>
      <line x1="180" y1="205" x2="600" y2="205" stroke="#c0b8b0" stroke-width="3"/>
      <!-- Sky/view through window -->
      <rect x="184" y="99" width="134" height="104" fill="url(#sky)" rx="0"/>
      <rect x="322" y="99" width="136" height="104" fill="url(#sky)" rx="0"/>
      <rect x="462" y="99" width="134" height="104" fill="url(#sky)" rx="0"/>
      ${isMansion ? `<!-- City view -->
      <rect x="220" y="170" width="8" height="34" fill="#bcc4cc" fill-opacity="0.5"/>
      <rect x="250" y="155" width="12" height="49" fill="#b8c0c8" fill-opacity="0.4"/>
      <rect x="350" y="160" width="10" height="44" fill="#c0c8d0" fill-opacity="0.45"/>
      <rect x="380" y="150" width="15" height="54" fill="#b4bcc4" fill-opacity="0.4"/>
      <rect x="500" y="165" width="8" height="39" fill="#c4ccd4" fill-opacity="0.4"/>
      <rect x="520" y="148" width="14" height="56" fill="#b8c0cc" fill-opacity="0.35"/>` : `<!-- Trees outside -->
      <ellipse cx="240" cy="175" rx="30" ry="25" fill="#8aad7c" fill-opacity="0.4"/>
      <ellipse cx="260" cy="180" rx="25" ry="22" fill="#7ca06e" fill-opacity="0.35"/>
      <rect x="248" y="180" width="4" height="24" fill="#9a8a6a" fill-opacity="0.3"/>
      <ellipse cx="420" cy="170" rx="35" ry="28" fill="#88aa78" fill-opacity="0.35"/>
      <ellipse cx="440" cy="178" rx="20" ry="18" fill="#7aa06c" fill-opacity="0.3"/>
      <ellipse cx="540" cy="178" rx="22" ry="20" fill="#8aad7c" fill-opacity="0.3"/>`}
      <!-- Light rays from window -->
      <polygon points="300,315 180,390 350,390" fill="#fff" fill-opacity="0.04" filter="url(#blur4)"/>
      <polygon points="450,315 380,390 550,390" fill="#fff" fill-opacity="0.03" filter="url(#blur4)"/>

      <!-- === TV AREA === -->
      <!-- TV board -->
      <rect x="300" y="326" width="180" height="64" rx="3" fill="${c[2]}" fill-opacity="0.35" stroke="${c[1]}" stroke-width="1"/>
      <!-- TV board legs -->
      <line x1="310" y1="390" x2="310" y2="395" stroke="${c[2]}" stroke-width="2" stroke-opacity="0.5"/>
      <line x1="470" y1="390" x2="470" y2="395" stroke="${c[2]}" stroke-width="2" stroke-opacity="0.5"/>
      <!-- TV screen (wall-mounted feel) -->
      <rect x="320" y="160" width="140" height="80" rx="2" fill="#2a2a2a" fill-opacity="0.7"/>
      <rect x="322" y="162" width="136" height="76" rx="1" fill="#3a3a3a" fill-opacity="0.5"/>
      <!-- TV reflection -->
      <rect x="325" y="165" width="60" height="30" rx="1" fill="#fff" fill-opacity="0.03"/>

      <!-- === SOFA (detailed 3-point perspective) === -->
      <!-- Shadow under sofa -->
      <ellipse cx="260" cy="520" rx="140" ry="12" fill="#000" fill-opacity="0.06" filter="url(#blur4)"/>
      <!-- Sofa back -->
      <polygon points="110,415 400,415 410,425 100,425" fill="${c[1]}" fill-opacity="0.7"/>
      <!-- Sofa seat -->
      <polygon points="100,425 410,425 430,510 70,510" fill="url(#sofa)" fill-opacity="0.65" stroke="${c[1]}" stroke-width="1" stroke-opacity="0.3"/>
      <!-- Seat cushion divisions -->
      <line x1="200" y1="428" x2="190" y2="508" stroke="${c[1]}" stroke-width="0.8" stroke-opacity="0.25"/>
      <line x1="310" y1="428" x2="320" y2="508" stroke="${c[1]}" stroke-width="0.8" stroke-opacity="0.25"/>
      <!-- Left armrest -->
      <polygon points="100,415 70,510 55,500 85,410" fill="${c[1]}" fill-opacity="0.5"/>
      <!-- Right armrest -->
      <polygon points="400,415 430,510 445,500 415,410" fill="${c[1]}" fill-opacity="0.4"/>
      <!-- Sofa top surface highlight -->
      <polygon points="110,415 400,415 395,418 115,418" fill="#fff" fill-opacity="0.15"/>
      <!-- Cushions -->
      <ellipse cx="155" cy="458" rx="42" ry="26" fill="${c[2]}" fill-opacity="0.25"/>
      <ellipse cx="260" cy="458" rx="42" ry="26" fill="${c[0]}" fill-opacity="0.25"/>
      <ellipse cx="360" cy="458" rx="38" ry="24" fill="${c[2]}" fill-opacity="0.2"/>
      <!-- Throw pillow on sofa -->
      <ellipse cx="135" cy="450" rx="22" ry="16" fill="${c[3]}" fill-opacity="0.4" transform="rotate(-15,135,450)"/>

      <!-- === COFFEE TABLE === -->
      <!-- Shadow -->
      <ellipse cx="320" cy="545" rx="85" ry="8" fill="#000" fill-opacity="0.04" filter="url(#blur2)"/>
      <!-- Table top -->
      <polygon points="220,505 420,505 430,535 210,535" rx="3" fill="${style === "modern" ? "#555" : style === "industrial" ? "#7a6a55" : "#c4b8a0"}" fill-opacity="0.45" stroke="${c[2]}" stroke-width="1" stroke-opacity="0.3"/>
      <!-- Table legs -->
      <line x1="235" y1="535" x2="228" y2="555" stroke="${style === "modern" || style === "industrial" ? "#555" : c[2]}" stroke-width="2.5" stroke-opacity="0.5"/>
      <line x1="415" y1="535" x2="422" y2="555" stroke="${style === "modern" || style === "industrial" ? "#555" : c[2]}" stroke-width="2.5" stroke-opacity="0.5"/>
      <!-- Items on table: book + cup -->
      <rect x="280" y="512" width="30" height="20" rx="1" fill="#e8e0d4" fill-opacity="0.5" transform="rotate(-5,295,522)"/>
      <ellipse cx="350" cy="518" rx="8" ry="5" fill="#f0ebe3" fill-opacity="0.5" stroke="#d0c8bc" stroke-width="0.5"/>

      <!-- === RUG === -->
      <polygon points="140,480 450,480 480,575 110,575" fill="${c[0]}" fill-opacity="0.1" stroke="${c[1]}" stroke-width="0.8" stroke-opacity="0.15" rx="4"/>
      ${style === "nordic" || style === "natural" ? `<!-- Rug pattern -->
      <line x1="200" y1="490" x2="180" y2="565" stroke="${c[1]}" stroke-width="0.5" stroke-opacity="0.08"/>
      <line x1="300" y1="485" x2="290" y2="570" stroke="${c[1]}" stroke-width="0.5" stroke-opacity="0.08"/>
      <line x1="400" y1="485" x2="410" y2="570" stroke="${c[1]}" stroke-width="0.5" stroke-opacity="0.08"/>` : ''}

      <!-- === PENDANT LIGHT === -->
      <line x1="390" y1="70" x2="390" y2="118" stroke="#888" stroke-width="1"/>
      ${style === "industrial" ? `<!-- Edison bulb style -->
      <ellipse cx="390" cy="128" rx="10" ry="14" fill="none" stroke="#a89878" stroke-width="1.5"/>
      <ellipse cx="390" cy="128" rx="3" ry="6" fill="#e8b44c" fill-opacity="0.7"/>` : style === "nordic" ? `<!-- Danish pendant -->
      <ellipse cx="390" cy="130" rx="35" ry="14" fill="${c[3]}" fill-opacity="0.5" stroke="${c[1]}" stroke-width="1"/>
      <ellipse cx="390" cy="127" rx="28" ry="10" fill="${c[3]}" fill-opacity="0.3"/>
      <ellipse cx="390" cy="133" rx="6" ry="3" fill="#e8c870" fill-opacity="0.6"/>` : `<!-- Modern pendant -->
      <polygon points="370,120 410,120 405,140 375,140" fill="${c[3]}" fill-opacity="0.4" stroke="${c[1]}" stroke-width="0.8"/>
      <ellipse cx="390" cy="140" rx="5" ry="3" fill="#e8c870" fill-opacity="0.5"/>`}
      <!-- Light glow on ceiling -->
      <ellipse cx="390" cy="100" rx="60" ry="20" fill="#f8e8a0" fill-opacity="0.04" filter="url(#blur4)"/>
      <!-- Light glow on floor -->
      <ellipse cx="380" cy="400" rx="100" ry="30" fill="#f8e8a0" fill-opacity="0.04" filter="url(#blur4)"/>

      <!-- === DINING AREA (right side) === -->
      <!-- Dining table -->
      <polygon points="560,360 680,360 690,400 550,400" fill="${style === "modern" ? "#666" : c[1]}" fill-opacity="0.35" stroke="${c[2]}" stroke-width="1" stroke-opacity="0.3"/>
      <!-- Table legs -->
      <line x1="565" y1="400" x2="560" y2="418" stroke="${c[2]}" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="678" y1="400" x2="683" y2="418" stroke="${c[2]}" stroke-width="2" stroke-opacity="0.4"/>
      <!-- Chair backs (2 visible) -->
      <rect x="575" y="345" width="22" height="15" rx="3" fill="${c[0]}" fill-opacity="0.4" stroke="${c[1]}" stroke-width="0.8" stroke-opacity="0.3"/>
      <rect x="645" y="345" width="22" height="15" rx="3" fill="${c[0]}" fill-opacity="0.4" stroke="${c[1]}" stroke-width="0.8" stroke-opacity="0.3"/>
      <!-- Chairs on near side (partially visible) -->
      <polygon points="570,420 600,420 605,445 565,445" fill="${c[0]}" fill-opacity="0.3"/>
      <polygon points="640,420 670,420 675,445 635,445" fill="${c[0]}" fill-opacity="0.3"/>
      <!-- Dining pendant light -->
      <line x1="620" y1="70" x2="620" y2="300" stroke="#888" stroke-width="0.8"/>
      <ellipse cx="620" cy="310" rx="18" ry="8" fill="${c[3]}" fill-opacity="0.35" stroke="${c[1]}" stroke-width="0.8"/>
      <ellipse cx="620" cy="312" rx="4" ry="2" fill="#e8c870" fill-opacity="0.5"/>

      <!-- === PLANT === -->
      <!-- Pot -->
      <polygon points="640,376 660,376 656,398 644,398" fill="#c4a882" fill-opacity="0.5" stroke="#b09870" stroke-width="1"/>
      <!-- Plant leaves -->
      <ellipse cx="650" cy="364" rx="20" ry="16" fill="#5a8a4e" fill-opacity="0.35"/>
      <ellipse cx="640" cy="355" rx="14" ry="14" fill="#6a9a5e" fill-opacity="0.3"/>
      <ellipse cx="660" cy="358" rx="12" ry="12" fill="#4e7a42" fill-opacity="0.25"/>
      <ellipse cx="648" cy="348" rx="10" ry="10" fill="#72a464" fill-opacity="0.2"/>

      ${style === "japandi" ? `<!-- Tatami corner accent (left wall) -->
      <polygon points="0,420 110,390 110,500 0,540" fill="#c8c098" fill-opacity="0.15" stroke="#b8b088" stroke-width="0.5" stroke-opacity="0.2"/>
      <line x1="55" y1="405" x2="55" y2="530" stroke="#b8b088" stroke-width="0.3" stroke-opacity="0.15"/>` : ''}

      ${style === "coastal" ? `<!-- Rattan basket on floor -->
      <ellipse cx="100" cy="510" rx="20" ry="12" fill="#d4bc94" fill-opacity="0.3" stroke="#c4aa7c" stroke-width="0.8"/>
      <ellipse cx="100" cy="500" rx="18" ry="10" fill="#dcc8a4" fill-opacity="0.25"/>` : ''}

      <!-- === SIDE SHELF / BOOKCASE === -->
      <rect x="85" y="320" width="25" height="70" fill="${c[2]}" fill-opacity="0.25" stroke="${c[1]}" stroke-width="0.8" stroke-opacity="0.3"/>
      <!-- Shelf divisions -->
      <line x1="85" y1="343" x2="110" y2="343" stroke="${c[1]}" stroke-width="0.5" stroke-opacity="0.3"/>
      <line x1="85" y1="366" x2="110" y2="366" stroke="${c[1]}" stroke-width="0.5" stroke-opacity="0.3"/>
      <!-- Books on shelf -->
      <rect x="88" y="325" width="4" height="16" fill="${c[0]}" fill-opacity="0.4"/>
      <rect x="93" y="327" width="3" height="14" fill="#b8a888" fill-opacity="0.4"/>
      <rect x="97" y="324" width="5" height="17" fill="${c[2]}" fill-opacity="0.3"/>
      <!-- Small vase -->
      <ellipse cx="95" cy="360" rx="5" ry="3" fill="#ddd" fill-opacity="0.4"/>
      <rect x="92" y="350" width="6" height="10" rx="2" fill="#e8e0d4" fill-opacity="0.4"/>

      <!-- === BLANKET ON SOFA === -->
      <path d="M 400 440 Q 420 460 430 490 Q 435 510 420 510" fill="none" stroke="${c[3]}" stroke-width="3" stroke-opacity="0.3"/>

      <!-- Label -->
      <rect x="0" y="${h-32}" width="${w}" height="32" fill="#fff" fill-opacity="0.7"/>
      <text x="${w/2}" y="${h-12}" fill="#888" font-size="12" text-anchor="middle" font-family="'Helvetica Neue', sans-serif">${styleLabel} / ${colorLabel} / ${housingLabel} ${sizeLabel} — インテリアイメージ</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const handleGenerateImage = async (type: "floorplan" | "3d") => {
    const setter = type === "floorplan" ? setFloorplanUrl : setRenderUrl;
    const loadingSetter = type === "floorplan" ? setIsGeneratingFloorplan : setIsGeneratingRender;
    loadingSetter(true);
    try {
      const res = await fetch("/api/sales/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type === "floorplan" ? "floorplan" : "3d",
          style,
          colorTone,
          roomSize,
          housing,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setter(data.url);
    } catch {
      // Fallback: generate SVG demo image
      const fallback = type === "floorplan" ? generateFloorplanSvg() : generate3dSvg();
      setter(fallback);
    } finally {
      loadingSetter(false);
    }
  };

  const recommendedProducts = useMemo(() => {
    if (!style || !colorTone) return [];
    return PRODUCTS
      .map((p) => {
        let score = 0;
        if (p.matchStyles.includes(style)) score += 3;
        if (p.matchColors.includes(colorTone)) score += 2;
        return { ...p, score };
      })
      .filter((p) => p.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [style, colorTone]);

  const sizeLabel = SIZE_OPTIONS.find((s) => s.value === roomSize)?.label || "";
  const colorLabel = COLOR_OPTIONS.find((c) => c.value === colorTone)?.label || "";
  const styleLabel = STYLE_OPTIONS.find((s) => s.value === style)?.label || "";
  const housingLabel = HOUSING_OPTIONS.find((h) => h.value === housing)?.label || "";

  const handleGenerate = () => {
    if (isComplete) setShowResult(true);
  };

  const handleReset = () => {
    setHousing(null);
    setRoomSize(null);
    setColorTone(null);
    setStyle(null);
    setShowResult(false);
    setFloorplanUrl(null);
    setRenderUrl(null);
  };

  if (showResult && concept) {
    return (
      <>
        {/* Concept Card */}
        <div className="sn-proposal" style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              color: "#555555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {concept.subtitle}
          </div>
          <div className="sn-proposal-concept">「{concept.name}」</div>

          {/* Specs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <span className="sn-keyword highlight">{housingLabel}</span>
            <span className="sn-keyword highlight">{sizeLabel}</span>
            <span className="sn-keyword highlight">{colorLabel}</span>
            <span className="sn-keyword highlight">{styleLabel}</span>
          </div>

          <div className="sn-proposal-desc">{concept.desc}</div>

          {/* Color Palette */}
          <div style={{ margin: "16px 0" }}>
            <div
              style={{
                fontSize: 10,
                color: "#9A9A9A",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              カラーパレット
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {concept.palette.map((color) => (
                <div
                  key={color}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 8,
                    background: color,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="sn-divider" />

          {/* Features */}
          <div className="sn-proposal-features">
            {concept.features.map((f) => (
              <div key={f} className="sn-proposal-feature">
                <span className="sn-proposal-feature-icon">◆</span>
                <div>{f}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Generation */}
        <div className="sn-card">
          <div className="sn-card-header">
            <span className="sn-card-title">
              <span style={{ fontSize: 15 }}>🖼</span>
              イメージ生成
            </span>
            <span className="sn-card-badge blue">AI</span>
          </div>

          {/* Two generation buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => handleGenerateImage("floorplan")}
              disabled={isGeneratingFloorplan}
              style={{
                flex: 1,
                padding: "14px 10px",
                borderRadius: 12,
                border: floorplanUrl
                  ? "1px solid #2E9E6E"
                  : "1px solid rgba(0, 138, 183, 0.15)",
                background: floorplanUrl
                  ? "rgba(46, 158, 110, 0.08)"
                  : "linear-gradient(135deg, rgba(0, 138, 183, 0.08), rgba(110, 94, 181, 0.06))",
                color: "#161616",
                cursor: isGeneratingFloorplan ? "wait" : "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                textAlign: "center",
              }}
            >
              {isGeneratingFloorplan ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div className="sn-spinner" />
                  <span style={{ fontSize: 11, color: "#555555" }}>生成中...</span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📐</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>間取り図</div>
                  <div style={{ fontSize: 10, color: "#9A9A9A", marginTop: 2 }}>
                    {floorplanUrl ? "✓ 生成済み（再生成）" : "AIで生成"}
                  </div>
                </>
              )}
            </button>

            <button
              onClick={() => handleGenerateImage("3d")}
              disabled={isGeneratingRender}
              style={{
                flex: 1,
                padding: "14px 10px",
                borderRadius: 12,
                border: renderUrl
                  ? "1px solid #2E9E6E"
                  : "1px solid rgba(139, 110, 62, 0.15)",
                background: renderUrl
                  ? "rgba(46, 158, 110, 0.08)"
                  : "linear-gradient(135deg, rgba(139, 110, 62, 0.08), rgba(139, 110, 62, 0.04))",
                color: "#161616",
                cursor: isGeneratingRender ? "wait" : "pointer",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                textAlign: "center",
              }}
            >
              {isGeneratingRender ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div className="sn-spinner" />
                  <span style={{ fontSize: 11, color: "#555555" }}>生成中...</span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🏠</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>3Dイメージ</div>
                  <div style={{ fontSize: 10, color: "#9A9A9A", marginTop: 2 }}>
                    {renderUrl ? "✓ 生成済み（再生成）" : "AIで生成"}
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Both at once */}
          {!floorplanUrl && !renderUrl && (
            <button
              className="sn-generate-btn"
              disabled={isGeneratingFloorplan || isGeneratingRender}
              onClick={() => {
                handleGenerateImage("floorplan");
                handleGenerateImage("3d");
              }}
              style={{
                background: "#008AB7",
                color: "white",
                marginBottom: 16,
              }}
            >
              ⚡ 間取り図 + 3Dイメージを同時生成
            </button>
          )}

          {/* Floorplan Result */}
          {floorplanUrl && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#555555",
                  fontWeight: 600,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                📐 間取り図
                <span
                  style={{
                    fontSize: 9,
                    padding: "1px 6px",
                    borderRadius: 100,
                    background: "rgba(46, 158, 110, 0.1)",
                    color: "#2E9E6E",
                  }}
                >
                  生成完了
                </span>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "#F3F0EB",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={floorplanUrl}
                  alt="間取り図"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
            </div>
          )}

          {/* 3D Render Result */}
          {renderUrl && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "#555555",
                  fontWeight: 600,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                🏠 3Dインテリアイメージ
                <span
                  style={{
                    fontSize: 9,
                    padding: "1px 6px",
                    borderRadius: 100,
                    background: "rgba(46, 158, 110, 0.1)",
                    color: "#2E9E6E",
                  }}
                >
                  生成完了
                </span>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  background: "#F3F0EB",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={renderUrl}
                  alt="3Dインテリアイメージ"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
            </div>
          )}

          {/* Loading indicators */}
          {(isGeneratingFloorplan || isGeneratingRender) && (
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                fontSize: 12,
                color: "#9A9A9A",
              }}
            >
              {isGeneratingFloorplan && isGeneratingRender
                ? "間取り図と3Dイメージを同時生成中..."
                : isGeneratingFloorplan
                ? "間取り図を生成中..."
                : "3Dイメージを生成中..."}
              <div style={{ fontSize: 11, marginTop: 4, color: "#9A9A9A" }}>
                通常10〜20秒ほどかかります
              </div>
            </div>
          )}
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="sn-card">
            <div className="sn-card-header">
              <span className="sn-card-title">
                <span style={{ fontSize: 15 }}>🛋</span>
                おすすめ商品
              </span>
              <span className="sn-card-badge gold">LivingHouse</span>
            </div>

            {recommendedProducts.map((product, i) => (
              <a
                key={i}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "14px",
                  marginBottom: 8,
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.02)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#161616",
                        marginBottom: 2,
                      }}
                    >
                      {product.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9A9A9A",
                      }}
                    >
                      {product.category}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#8B6E3E",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.price}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#555555",
                    lineHeight: 1.5,
                  }}
                >
                  {product.description}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#008AB7",
                    marginTop: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  商品を見る →
                </div>
              </a>
            ))}

            <a
              href="https://www.livinghouse-store.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="sn-ctrl-btn primary"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                marginTop: 8,
                padding: 12,
              }}
            >
              LivingHouse Store で全商品を見る
            </a>
          </div>
        )}

        {/* Room Layout Tip */}
        <div className="sn-card">
          <div className="sn-card-header">
            <span className="sn-card-title">
              <span style={{ fontSize: 15 }}>💡</span>
              レイアウトのコツ
            </span>
          </div>
          {housing === "mansion" ? (
            <div className="sn-insight-text" style={{ lineHeight: 1.8 }}>
              <strong>マンション {sizeLabel}</strong>のリビングでは、
              {Number(roomSize) <= 8
                ? "コンパクト家具を選び、壁面収納を活用して床面積を確保しましょう。ソファはアームレスタイプがおすすめです。"
                : Number(roomSize) <= 12
                ? "ソファとダイニングのゾーニングがポイント。ラグで空間を区切り、統一感のある素材選びを心がけましょう。"
                : "ゆとりある空間を活かして、リビングとダイニングの間にグリーンコーナーやワークスペースを設けるのもおすすめです。"}
            </div>
          ) : (
            <div className="sn-insight-text" style={{ lineHeight: 1.8 }}>
              <strong>戸建て {sizeLabel}</strong>のリビングでは、
              {Number(roomSize) <= 10
                ? "吹き抜けや高天井を活かした縦の空間演出がポイント。ペンダントライトで視線を上に誘導しましょう。"
                : "庭との繋がりを意識した配置がおすすめ。窓際にグリーンを配し、内と外がシームレスにつながる空間を目指しましょう。"}
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          className="sn-ctrl-btn"
          onClick={handleReset}
          style={{ width: "100%", padding: 12, marginTop: 4 }}
        >
          条件を変えてやり直す
        </button>
      </>
    );
  }

  return (
    <>
      {/* Progress */}
      <div className="sn-card">
        <div className="sn-card-header">
          <span className="sn-card-title">
            <span style={{ fontSize: 15 }}>⚡</span>
            クイック空間イメージ
          </span>
          <span className="sn-card-badge blue">
            {Math.min(step, 4)} / 4
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background:
                  s < step
                    ? "#2E9E6E"
                    : s === step
                    ? "#008AB7"
                    : "rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Step 1: Housing Type */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: step >= 1 ? "#161616" : "#9A9A9A",
              fontWeight: 600,
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background: housing ? "#2E9E6E" : step === 1 ? "#008AB7" : "rgba(0,0,0,0.06)",
                display: "inline-grid",
                placeItems: "center",
                fontSize: 10,
                color: "white",
              }}
            >
              {housing ? "✓" : "1"}
            </span>
            住まいのタイプ
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {HOUSING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setHousing(opt.value)}
                style={{
                  flex: 1,
                  padding: "16px 12px",
                  borderRadius: 12,
                  border: `1px solid ${
                    housing === opt.value
                      ? "#008AB7"
                      : "rgba(0,0,0,0.06)"
                  }`,
                  background:
                    housing === opt.value
                      ? "rgba(0, 138, 183, 0.08)"
                      : "rgba(0,0,0,0.02)",
                  color: housing === opt.value ? "#161616" : "#555555",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{opt.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Room Size */}
        <div style={{ marginBottom: 24, opacity: housing ? 1 : 0.3, pointerEvents: housing ? "auto" : "none", transition: "opacity 0.3s" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 10,
              color: housing ? "#161616" : "#9A9A9A",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background: roomSize ? "#2E9E6E" : step === 2 ? "#008AB7" : "rgba(0,0,0,0.06)",
                display: "inline-grid",
                placeItems: "center",
                fontSize: 10,
                color: "white",
              }}
            >
              {roomSize ? "✓" : "2"}
            </span>
            リビングの広さ
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRoomSize(opt.value)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 8,
                  border: `1px solid ${
                    roomSize === opt.value
                      ? "#008AB7"
                      : "rgba(0,0,0,0.06)"
                  }`,
                  background:
                    roomSize === opt.value
                      ? "rgba(0, 138, 183, 0.08)"
                      : "rgba(0,0,0,0.02)",
                  color: roomSize === opt.value ? "#161616" : "#555555",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Color Tone */}
        <div style={{ marginBottom: 24, opacity: roomSize ? 1 : 0.3, pointerEvents: roomSize ? "auto" : "none", transition: "opacity 0.3s" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 10,
              color: roomSize ? "#161616" : "#9A9A9A",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background: colorTone ? "#2E9E6E" : step === 3 ? "#008AB7" : "rgba(0,0,0,0.06)",
                display: "inline-grid",
                placeItems: "center",
                fontSize: 10,
                color: "white",
              }}
            >
              {colorTone ? "✓" : "3"}
            </span>
            お部屋の色イメージ
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setColorTone(opt.value)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 8,
                  border: `1px solid ${
                    colorTone === opt.value
                      ? "#008AB7"
                      : "rgba(0,0,0,0.06)"
                  }`,
                  background:
                    colorTone === opt.value
                      ? "rgba(0, 138, 183, 0.08)"
                      : "rgba(0,0,0,0.02)",
                  color: colorTone === opt.value ? "#161616" : "#555555",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: opt.hex,
                    border: "1px solid rgba(0,0,0,0.08)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 500 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Style */}
        <div style={{ marginBottom: 16, opacity: colorTone ? 1 : 0.3, pointerEvents: colorTone ? "auto" : "none", transition: "opacity 0.3s" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 10,
              color: colorTone ? "#161616" : "#9A9A9A",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                background: style ? "#2E9E6E" : step === 4 ? "#008AB7" : "rgba(0,0,0,0.06)",
                display: "inline-grid",
                placeItems: "center",
                fontSize: 10,
                color: "white",
              }}
            >
              {style ? "✓" : "4"}
            </span>
            スタイル
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStyle(opt.value)}
                style={{
                  padding: "12px 10px",
                  borderRadius: 10,
                  border: `1px solid ${
                    style === opt.value
                      ? "#8B6E3E"
                      : "rgba(0,0,0,0.06)"
                  }`,
                  background:
                    style === opt.value
                      ? "rgba(139, 110, 62, 0.08)"
                      : "rgba(0,0,0,0.02)",
                  color: style === opt.value ? "#161616" : "#555555",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: 10, color: "#9A9A9A" }}>
                  {opt.sub}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        className="sn-generate-btn"
        disabled={!isComplete}
        onClick={handleGenerate}
        style={{
          background: isComplete
            ? "#008AB7"
            : undefined,
        }}
      >
        ⚡ イメージを生成する
      </button>
    </>
  );
}

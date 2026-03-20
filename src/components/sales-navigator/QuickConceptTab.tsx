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
    const w = 800;
    const h = 800;
    const pad = 60;
    const iw = w - pad * 2;
    const ih = h - pad * 2;
    const isSmall = Number(roomSize) <= 8;
    const isMansion = housing === "mansion";

    const sofaW = isSmall ? 140 : 180;
    const sofaH = 60;
    const tableW = isSmall ? 100 : 140;
    const tableH = isSmall ? 60 : 80;
    const tvW = isSmall ? 120 : 160;
    const diningW = isSmall ? 100 : 130;
    const diningH = isSmall ? 70 : 90;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <rect width="${w}" height="${h}" fill="#F3F0EB"/>
      <text x="${w/2}" y="35" fill="#9A9A9A" font-size="14" text-anchor="middle" font-family="sans-serif">${isMansion ? "マンション" : "戸建て"} リビング ${roomSize}畳 / ${styleLabel}スタイル</text>
      <!-- Room outline -->
      <rect x="${pad}" y="${pad}" width="${iw}" height="${ih}" fill="none" stroke="#008AB7" stroke-width="3" rx="2"/>
      <!-- Walls -->
      <line x1="${pad}" y1="${pad+ih*0.55}" x2="${pad+iw*0.35}" y2="${pad+ih*0.55}" stroke="#008AB7" stroke-width="2" stroke-dasharray="8,4"/>
      <text x="${pad+iw*0.17}" y="${pad+ih*0.52}" fill="#008AB7" font-size="11" text-anchor="middle" font-family="sans-serif">Kitchen</text>
      <!-- Window -->
      <rect x="${pad+iw*0.3}" y="${pad}" width="${iw*0.4}" height="8" fill="#008AB7" rx="2"/>
      <text x="${pad+iw*0.5}" y="${pad+20}" fill="#008AB7" font-size="10" text-anchor="middle" font-family="sans-serif">窓</text>
      ${!isMansion ? `<rect x="${pad+iw-8}" y="${pad+ih*0.3}" width="8" height="${ih*0.35}" fill="#008AB7" rx="2"/>
      <text x="${pad+iw-20}" y="${pad+ih*0.48}" fill="#008AB7" font-size="10" text-anchor="middle" font-family="sans-serif" transform="rotate(-90,${pad+iw-20},${pad+ih*0.48})">掃き出し窓</text>` : ""}
      <!-- Door -->
      <rect x="${pad}" y="${pad+ih-50}" width="8" height="40" fill="#D4891C" rx="1"/>
      <path d="M ${pad+8} ${pad+ih-50} A 40 40 0 0 1 ${pad+48} ${pad+ih-10}" fill="none" stroke="#D4891C" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="${pad+25}" y="${pad+ih-55}" fill="#D4891C" font-size="10" text-anchor="middle" font-family="sans-serif">入口</text>
      <!-- Sofa -->
      <rect x="${pad+iw*0.5-sofaW/2}" y="${pad+ih*0.55+30}" width="${sofaW}" height="${sofaH}" fill="rgba(0,138,183,0.1)" stroke="#008AB7" stroke-width="1.5" rx="6"/>
      <rect x="${pad+iw*0.5-sofaW/2}" y="${pad+ih*0.55+30+sofaH-12}" width="${sofaW}" height="12" fill="rgba(0,138,183,0.15)" rx="3"/>
      <text x="${pad+iw*0.5}" y="${pad+ih*0.55+30+sofaH/2+4}" fill="#555555" font-size="12" text-anchor="middle" font-family="sans-serif">ソファ</text>
      <!-- Center Table -->
      <rect x="${pad+iw*0.5-tableW/2}" y="${pad+ih*0.55+30+sofaH+20}" width="${tableW}" height="${tableH}" fill="rgba(139,110,62,0.08)" stroke="#8B6E3E" stroke-width="1.5" rx="4"/>
      <text x="${pad+iw*0.5}" y="${pad+ih*0.55+30+sofaH+20+tableH/2+4}" fill="#8B6E3E" font-size="11" text-anchor="middle" font-family="sans-serif">テーブル</text>
      <!-- TV Unit -->
      <rect x="${pad+iw*0.5-tvW/2}" y="${pad+30}" width="${tvW}" height="25" fill="rgba(46,158,110,0.1)" stroke="#2E9E6E" stroke-width="1.5" rx="3"/>
      <text x="${pad+iw*0.5}" y="${pad+47}" fill="#2E9E6E" font-size="11" text-anchor="middle" font-family="sans-serif">TVボード</text>
      <rect x="${pad+iw*0.5-20}" y="${pad+58}" width="40" height="3" fill="#2E9E6E" rx="1"/>
      <!-- Dining -->
      <rect x="${pad+30}" y="${pad+ih*0.08}" width="${diningW}" height="${diningH}" fill="rgba(110,94,181,0.08)" stroke="#6E5EB5" stroke-width="1.5" rx="4"/>
      <text x="${pad+30+diningW/2}" y="${pad+ih*0.08+diningH/2+4}" fill="#6E5EB5" font-size="11" text-anchor="middle" font-family="sans-serif">ダイニング</text>
      <!-- Chairs around dining -->
      <rect x="${pad+30+diningW/2-12}" y="${pad+ih*0.08-14}" width="24" height="10" fill="rgba(110,94,181,0.15)" stroke="#6E5EB5" stroke-width="1" rx="3"/>
      <rect x="${pad+30+diningW/2-12}" y="${pad+ih*0.08+diningH+4}" width="24" height="10" fill="rgba(110,94,181,0.15)" stroke="#6E5EB5" stroke-width="1" rx="3"/>
      <rect x="${pad+30-14}" y="${pad+ih*0.08+diningH/2-8}" width="10" height="16" fill="rgba(110,94,181,0.15)" stroke="#6E5EB5" stroke-width="1" rx="3"/>
      <rect x="${pad+30+diningW+4}" y="${pad+ih*0.08+diningH/2-8}" width="10" height="16" fill="rgba(110,94,181,0.15)" stroke="#6E5EB5" stroke-width="1" rx="3"/>
      <!-- Rug -->
      <rect x="${pad+iw*0.5-sofaW*0.7}" y="${pad+ih*0.55+sofaH+30}" width="${sofaW*1.4}" height="${tableH+50}" fill="none" stroke="#9A9A9A" stroke-width="1" stroke-dasharray="6,4" rx="8"/>
      <text x="${pad+iw*0.5}" y="${pad+ih-30}" fill="#9A9A9A" font-size="10" text-anchor="middle" font-family="sans-serif">ラグ</text>
      <!-- Shelf -->
      <rect x="${pad+iw-50}" y="${pad+ih*0.6}" width="30" height="80" fill="rgba(212,137,28,0.08)" stroke="#D4891C" stroke-width="1" rx="2"/>
      <text x="${pad+iw-35}" y="${pad+ih*0.6+44}" fill="#D4891C" font-size="9" text-anchor="middle" font-family="sans-serif" transform="rotate(-90,${pad+iw-35},${pad+ih*0.6+44})">シェルフ</text>
      <!-- Dimensions -->
      <line x1="${pad}" y1="${h-25}" x2="${pad+iw}" y2="${h-25}" stroke="#9A9A9A" stroke-width="1"/>
      <text x="${pad+iw/2}" y="${h-12}" fill="#9A9A9A" font-size="11" text-anchor="middle" font-family="sans-serif">${(Number(roomSize)*1.65/Math.sqrt(Number(roomSize)*1.65/4*3)).toFixed(1)}m</text>
      <line x1="${w-25}" y1="${pad}" x2="${w-25}" y2="${pad+ih}" stroke="#9A9A9A" stroke-width="1"/>
      <text x="${w-12}" y="${pad+ih/2}" fill="#9A9A9A" font-size="11" text-anchor="middle" font-family="sans-serif" transform="rotate(-90,${w-12},${pad+ih/2})">${(Math.sqrt(Number(roomSize)*1.65/4*3)).toFixed(1)}m</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const generate3dSvg = (): string => {
    const w = 800;
    const h = 600;
    const colors = concept?.palette || ["#e0d5c0", "#c4b8a0", "#a09080", "#f0ebe3"];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${colors[1]}" stop-opacity="0.15"/>
        </linearGradient>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${colors[3]}" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="${colors[0]}" stop-opacity="0.2"/>
        </linearGradient>
        <linearGradient id="ceilGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="${colors[3]}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#F3F0EB" stop-opacity="0.8"/>
        </linearGradient>
        <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#B8D8E8" stop-opacity="0.4"/>
          <stop offset="70%" stop-color="#b8d8e8" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#f0f8ff" stop-opacity="0.15"/>
        </linearGradient>
      </defs>
      <!-- Background -->
      <rect width="${w}" height="${h}" fill="#E8E4DE"/>
      <!-- Back Wall -->
      <polygon points="100,80 700,80 700,400 100,400" fill="url(#wallGrad)"/>
      <!-- Floor (perspective) -->
      <polygon points="0,${h} ${w},${h} 700,400 100,400" fill="url(#floorGrad)"/>
      <!-- Ceiling -->
      <polygon points="0,0 ${w},0 700,80 100,80" fill="url(#ceilGrad)"/>
      <!-- Left Wall -->
      <polygon points="0,0 100,80 100,400 0,${h}" fill="${colors[2]}" fill-opacity="0.12"/>
      <!-- Right Wall -->
      <polygon points="${w},0 700,80 700,400 ${w},${h}" fill="${colors[2]}" fill-opacity="0.08"/>
      <!-- Window on back wall -->
      <rect x="200" y="110" width="400" height="200" fill="url(#windowGrad)" rx="2"/>
      <line x1="400" y1="110" x2="400" y2="310" stroke="${colors[2]}" stroke-width="2" stroke-opacity="0.3"/>
      <line x1="200" y1="210" x2="600" y2="210" stroke="${colors[2]}" stroke-width="2" stroke-opacity="0.3"/>
      <rect x="200" y="110" width="400" height="200" fill="none" stroke="${colors[1]}" stroke-width="3" stroke-opacity="0.4" rx="2"/>
      <!-- Floor line -->
      <line x1="100" y1="400" x2="700" y2="400" stroke="${colors[1]}" stroke-width="1" stroke-opacity="0.3"/>
      <!-- Sofa (perspective) -->
      <polygon points="150,430 380,430 400,520 120,520" fill="${colors[0]}" fill-opacity="0.5" stroke="${colors[1]}" stroke-width="1.5" stroke-opacity="0.4"/>
      <polygon points="150,430 120,520 110,510 140,425" fill="${colors[1]}" fill-opacity="0.3"/>
      <polygon points="150,425 380,425 380,430 150,430" fill="${colors[3]}" fill-opacity="0.3"/>
      <!-- Cushions on sofa -->
      <ellipse cx="210" cy="465" rx="35" ry="22" fill="${colors[2]}" fill-opacity="0.25" stroke="${colors[1]}" stroke-width="1" stroke-opacity="0.2"/>
      <ellipse cx="310" cy="465" rx="35" ry="22" fill="${colors[2]}" fill-opacity="0.25" stroke="${colors[1]}" stroke-width="1" stroke-opacity="0.2"/>
      <!-- Coffee Table -->
      <polygon points="250,490 450,490 460,530 240,530" fill="${colors[1]}" fill-opacity="0.35" stroke="${colors[2]}" stroke-width="1.5" stroke-opacity="0.3" rx="2"/>
      <!-- Table legs -->
      <line x1="260" y1="530" x2="255" y2="545" stroke="${colors[2]}" stroke-width="2" stroke-opacity="0.4"/>
      <line x1="445" y1="530" x2="450" y2="545" stroke="${colors[2]}" stroke-width="2" stroke-opacity="0.4"/>
      <!-- TV unit on back wall -->
      <rect x="320" y="320" width="160" height="80" fill="${colors[2]}" fill-opacity="0.2" stroke="${colors[1]}" stroke-width="1.5" stroke-opacity="0.3" rx="3"/>
      <!-- TV screen -->
      <rect x="350" y="170" width="100" height="60" fill="#D5D0C8" fill-opacity="0.6" stroke="${colors[2]}" stroke-width="1" stroke-opacity="0.3" rx="2"/>
      <!-- Pendant light -->
      <line x1="400" y1="80" x2="400" y2="130" stroke="${colors[1]}" stroke-width="1" stroke-opacity="0.4"/>
      <ellipse cx="400" cy="138" rx="30" ry="12" fill="${colors[3]}" fill-opacity="0.3" stroke="${colors[1]}" stroke-width="1" stroke-opacity="0.3"/>
      <ellipse cx="400" cy="140" rx="5" ry="3" fill="#D4891C" fill-opacity="0.6"/>
      <!-- Light glow -->
      <ellipse cx="400" cy="300" rx="120" ry="80" fill="#D4891C" fill-opacity="0.03"/>
      <!-- Plant in corner -->
      <rect x="640" y="360" width="30" height="40" fill="${colors[1]}" fill-opacity="0.25" rx="3"/>
      <ellipse cx="655" cy="350" rx="25" ry="20" fill="#2E9E6E" fill-opacity="0.2"/>
      <ellipse cx="645" cy="340" rx="15" ry="18" fill="#2E9E6E" fill-opacity="0.15"/>
      <!-- Rug on floor -->
      <ellipse cx="350" cy="510" rx="130" ry="40" fill="${colors[0]}" fill-opacity="0.12" stroke="${colors[1]}" stroke-width="1" stroke-opacity="0.1"/>
      <!-- Side table / shelf -->
      <rect x="570" y="380" width="80" height="50" fill="${colors[2]}" fill-opacity="0.15" stroke="${colors[1]}" stroke-width="1" stroke-opacity="0.2" rx="2"/>
      <!-- Label -->
      <text x="${w/2}" y="${h-15}" fill="#9A9A9A" font-size="13" text-anchor="middle" font-family="sans-serif">${styleLabel} / ${colorLabel} / ${housingLabel} ${sizeLabel} — 3Dイメージ</text>
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

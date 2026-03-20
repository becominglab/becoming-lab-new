/**
 * テキスト正規化ユーティリティ
 * 全角半角変換、住所正規化、価格パース等
 */

/** 全角英数字→半角 */
export function toHankaku(str: string): string {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s =>
    String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  );
}

/** 半角カナ→全角カナ */
const kanaMap: Record<string, string> = {
  'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
  'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
  'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
  'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
  'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
  'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
  'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
  'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
  'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
  'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
  'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
  'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
  'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
  'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
  'ﾜ': 'ワ', 'ﾝ': 'ン', 'ｰ': 'ー',
};

export function toZenkakuKana(str: string): string {
  let result = str;
  for (const [hankaku, zenkaku] of Object.entries(kanaMap)) {
    result = result.replaceAll(hankaku, zenkaku);
  }
  return result;
}

/**
 * 住所正規化
 * - 全角半角統一
 * - 「丁目」「番」「号」をハイフンに
 * - 連続スペース除去
 */
export function normalizeAddress(address: string): string {
  let s = toHankaku(address.trim());
  // 「丁目」「番地」「号」をハイフンに統一
  s = s.replace(/(\d+)丁目/g, '$1-');
  s = s.replace(/(\d+)番地?/g, '$1-');
  s = s.replace(/(\d+)号/g, '$1');
  // 末尾ハイフン除去
  s = s.replace(/-$/, '');
  // スペース正規化
  s = s.replace(/\s+/g, ' ');
  // 全角スペース→半角
  s = s.replace(/　/g, ' ');
  return s;
}

/**
 * 物件名正規化
 */
export function normalizePropertyName(name: string): string {
  let s = toHankaku(name.trim());
  s = toZenkakuKana(s);
  s = s.replace(/\s+/g, '');
  s = s.replace(/　/g, '');
  return s.toLowerCase();
}

/**
 * 価格文字列をパース
 * "1億5000万円" → 150000000
 * "5,000万円" → 50000000
 * "15000万" → 150000000
 */
export function parsePrice(priceStr: string): number | null {
  if (!priceStr) return null;
  let s = toHankaku(priceStr.trim());
  s = s.replace(/,/g, '').replace(/円/g, '').replace(/\s/g, '');

  // "1億5000万" パターン
  const okuMatch = s.match(/(\d+(?:\.\d+)?)億(?:(\d+(?:\.\d+)?)万)?/);
  if (okuMatch) {
    const oku = parseFloat(okuMatch[1]) * 100_000_000;
    const man = okuMatch[2] ? parseFloat(okuMatch[2]) * 10_000 : 0;
    return oku + man;
  }

  // "5000万" パターン
  const manMatch = s.match(/(\d+(?:\.\d+)?)万/);
  if (manMatch) {
    return parseFloat(manMatch[1]) * 10_000;
  }

  // 純粋な数値
  const num = parseFloat(s);
  return isNaN(num) ? null : num;
}

/**
 * 面積文字列をパース
 * "123.56㎡" → 123.56
 * "123.56m2" → 123.56
 */
export function parseArea(areaStr: string): number | null {
  if (!areaStr) return null;
  const s = toHankaku(areaStr.trim());
  const match = s.match(/([\d.]+)\s*(?:㎡|m2|m²|平米)?/i);
  if (match) {
    const num = parseFloat(match[1]);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * 利回り文字列をパース
 * "8.6%" → 8.6
 */
export function parseYield(yieldStr: string): number | null {
  if (!yieldStr) return null;
  const s = toHankaku(yieldStr.trim());
  const match = s.match(/([\d.]+)\s*%?/);
  if (match) {
    const num = parseFloat(match[1]);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * 徒歩分数をパース
 * "徒歩6分" → 6
 * "6分" → 6
 */
export function parseWalkMinutes(walkStr: string): number | null {
  if (!walkStr) return null;
  const s = toHankaku(walkStr.trim());
  const match = s.match(/(\d+)\s*分/);
  if (match) return parseInt(match[1], 10);
  const numMatch = s.match(/^(\d+)$/);
  if (numMatch) return parseInt(numMatch[1], 10);
  return null;
}

/**
 * 築年数文字列から建築年を抽出
 * "1998年3月" → { year: 1998, month: 3 }
 * "築26年" → 年から逆算
 */
export function parseBuiltYear(builtStr: string): { year: number; month?: number } | null {
  if (!builtStr) return null;
  const s = toHankaku(builtStr.trim());

  // "1998年3月" パターン
  const ymMatch = s.match(/(\d{4})\s*年\s*(\d{1,2})\s*月/);
  if (ymMatch) {
    return { year: parseInt(ymMatch[1], 10), month: parseInt(ymMatch[2], 10) };
  }

  // "1998年" パターン
  const yMatch = s.match(/(\d{4})\s*年/);
  if (yMatch) {
    return { year: parseInt(yMatch[1], 10) };
  }

  // "築26年" パターン
  const ageMatch = s.match(/築\s*(\d+)\s*年/);
  if (ageMatch) {
    const age = parseInt(ageMatch[1], 10);
    const currentYear = new Date().getFullYear();
    return { year: currentYear - age };
  }

  return null;
}

/**
 * 区名を抽出
 * "東京都新宿区西新宿2-8-1" → "新宿区"
 */
export function extractWard(address: string): string | null {
  const match = address.match(/(千代田|中央|港|新宿|文京|台東|墨田|江東|品川|目黒|大田|世田谷|渋谷|中野|杉並|豊島|北|荒川|板橋|練馬|足立|葛飾|江戸川)区/);
  return match ? `${match[1]}区` : null;
}

/**
 * 構造タイプを正規化
 * "鉄筋コンクリート造" → "RC"
 * "木造" → "W"
 */
export function normalizeStructureType(structStr: string): string | null {
  if (!structStr) return null;
  const s = structStr.trim();

  if (/SRC|鉄骨鉄筋コンクリート/.test(s)) return 'SRC';
  if (/RC|鉄筋コンクリート/.test(s)) return 'RC';
  if (/重量鉄骨|鉄骨造|S造/.test(s)) return 'S';
  if (/軽量鉄骨/.test(s)) return 'S';
  if (/木造.*劣化|劣化.*木造/.test(s)) return 'W劣';
  if (/木造|W造/.test(s)) return 'W';

  return null;
}

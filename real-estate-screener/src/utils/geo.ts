/**
 * 簡易ジオコーディング（将来API連携）
 * 現在は東京23区の中心座標を返す
 */

const WARD_CENTERS: Record<string, { lat: number; lng: number }> = {
  '千代田区': { lat: 35.6940, lng: 139.7536 },
  '中央区': { lat: 35.6705, lng: 139.7726 },
  '港区': { lat: 35.6585, lng: 139.7514 },
  '新宿区': { lat: 35.6938, lng: 139.7036 },
  '文京区': { lat: 35.7081, lng: 139.7522 },
  '台東区': { lat: 35.7126, lng: 139.7800 },
  '墨田区': { lat: 35.7107, lng: 139.8015 },
  '江東区': { lat: 35.6727, lng: 139.8171 },
  '品川区': { lat: 35.6095, lng: 139.7304 },
  '目黒区': { lat: 35.6414, lng: 139.6982 },
  '大田区': { lat: 35.5613, lng: 139.7160 },
  '世田谷区': { lat: 35.6462, lng: 139.6530 },
  '渋谷区': { lat: 35.6640, lng: 139.6982 },
  '中野区': { lat: 35.7077, lng: 139.6638 },
  '杉並区': { lat: 35.6997, lng: 139.6367 },
  '豊島区': { lat: 35.7263, lng: 139.7164 },
  '北区': { lat: 35.7527, lng: 139.7241 },
  '荒川区': { lat: 35.7361, lng: 139.7834 },
  '板橋区': { lat: 35.7516, lng: 139.7098 },
  '練馬区': { lat: 35.7355, lng: 139.6524 },
  '足立区': { lat: 35.7755, lng: 139.8047 },
  '葛飾区': { lat: 35.7437, lng: 139.8471 },
  '江戸川区': { lat: 35.7068, lng: 139.8682 },
};

/**
 * 区名から中心座標を返す（簡易版）
 */
export function getWardCenter(ward: string): { lat: number; lng: number } | null {
  return WARD_CENTERS[ward] ?? null;
}

/**
 * 住所から緯度経度を取得（将来はGeocoding API連携）
 * 現在は区の中心座標で代替
 */
export function geocodeAddress(address: string, ward?: string): { lat: number; lng: number } | null {
  if (ward) return getWardCenter(ward);

  // 住所から区を抽出
  for (const [w, center] of Object.entries(WARD_CENTERS)) {
    if (address.includes(w)) return center;
  }

  return null;
}

/**
 * 2点間の距離を計算（メートル）
 */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

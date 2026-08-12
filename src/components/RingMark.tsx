/**
 * ロゴ「i」上部の円環マーク。
 * 支給の becominglab_logo.ai / .pdf から書き出した SVG がある場合は、
 * このコンポーネントの中身をそれに差し替えてください。
 * アイソレーション: 上下左右にマーク高さの 1.5 倍の余白を取ること。
 */
export default function RingMark({
  size = 18,
  color = 'var(--bc-teal)',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <g fill={color}>
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="none"
          stroke={color}
          strokeWidth="3.4"
        />
        <circle cx="12" cy="12" r="3.1" />
        <rect x="10.6" y="0" width="2.8" height="7" />
        <rect
          x="1"
          y="16.2"
          width="2.8"
          height="7"
          transform="rotate(-58 2.4 19.7)"
        />
        <rect
          x="20.2"
          y="16.2"
          width="2.8"
          height="7"
          transform="rotate(58 21.6 19.7)"
        />
      </g>
    </svg>
  );
}

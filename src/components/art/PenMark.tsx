/** The BIC pen drawing a highlighter stroke: the brand illustration of screen 01. */
export function PenMark({ width = 200 }: { width?: number }) {
  return (
    <svg
      viewBox="0 0 220 110"
      role="img"
      aria-label="caneta desenhando um traço de marca-texto"
      style={{ width, display: 'block', margin: '0 auto' }}
    >
      <path
        d="M18 86 q70 -20 152 -8"
        fill="none"
        stroke="var(--color-marca-texto)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <g transform="rotate(38 172 74)">
        <rect x="166" y="28" width="13" height="40" rx="4" fill="var(--color-caneta)" />
        <path d="M166 68 h13 l-6.5 14 z" fill="var(--color-ink)" />
        <circle cx="172.5" cy="79" r="1.6" fill="var(--color-paper)" />
      </g>
    </svg>
  )
}

export default function Mascot({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="oest-m" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b7bf0" />
          <stop offset="1" stopColor="#6d3fd1" />
        </linearGradient>
      </defs>
      <line x1="60" y1="24" x2="60" y2="12" stroke="#7c4dd8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="9" r="5" fill="#9b7bf0" />
      <path d="M60 22c26 0 42 20 42 46 0 22-14 34-42 34S18 90 18 68c0-26 16-46 42-46z" fill="url(#oest-m)" />
      <circle cx="47" cy="58" r="12" fill="#fff" /><circle cx="75" cy="58" r="12" fill="#fff" />
      <circle cx="49" cy="60" r="6" fill="#2a1a52" /><circle cx="77" cy="60" r="6" fill="#2a1a52" />
      <path d="M52 82q9 7 18 0" stroke="#2a1a52" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

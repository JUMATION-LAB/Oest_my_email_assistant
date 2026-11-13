// Animated Oest mascot. Self-contained: the keyframes are injected once, so no CSS file needs editing.
// Props: size (px), thinking (faster, mouth moves while waiting for a reply), animated (false = still image)
const CSS = `
.oest-live .oest-float{animation:oest-float 3.2s ease-in-out infinite}
.oest-live .oest-body{transform-origin:60px 102px;animation:oest-breathe 3.2s ease-in-out infinite}
.oest-live .oest-antenna{transform-origin:60px 24px;animation:oest-sway 2.2s ease-in-out -.5s infinite}
.oest-live .oest-eye{animation:oest-blink 4.5s ease-in-out infinite}
.oest-live .oest-eye-l{transform-origin:47px 58px}
.oest-live .oest-eye-r{transform-origin:75px 58px}
.oest-live .oest-pupil{animation:oest-look 7s ease-in-out infinite}
.oest-live .oest-shadow{transform-origin:60px 112px;animation:oest-shadow 3.2s ease-in-out infinite}
.oest-live.oest-thinking .oest-float,
.oest-live.oest-thinking .oest-body,
.oest-live.oest-thinking .oest-shadow{animation-duration:1.1s}
.oest-live.oest-thinking .oest-antenna{animation-duration:.6s}
.oest-live.oest-thinking .oest-mouth{transform-origin:61px 82px;animation:oest-talk .45s ease-in-out infinite}
@keyframes oest-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes oest-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(.98,1.03)}}
@keyframes oest-sway{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(16deg)}}
@keyframes oest-blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}}
@keyframes oest-look{0%,100%{transform:translate(0,0)}30%{transform:translate(-2px,1px)}65%{transform:translate(2px,-1px)}}
@keyframes oest-shadow{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(.82);opacity:.5}}
@keyframes oest-talk{0%,100%{transform:scale(1,1)}50%{transform:scale(.8,1.8)}}
@media (prefers-reduced-motion:reduce){.oest-live *{animation:none!important}}
`

if (typeof document !== 'undefined') {
  const el = document.getElementById('oest-mascot-css') || Object.assign(document.createElement('style'), { id: 'oest-mascot-css' })
  el.textContent = CSS
  if (!el.isConnected) document.head.appendChild(el)
}

export default function Mascot({ size = 120, thinking = false, animated = true }) {
  const cls = ['oest-live', thinking && 'oest-thinking'].filter(Boolean)
  return (
    <svg className={animated ? cls.join(' ') : undefined} width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="oest-m" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9b7bf0" />
          <stop offset="1" stopColor="#6d3fd1" />
        </linearGradient>
      </defs>

      <ellipse className="oest-shadow" cx="60" cy="112" rx="26" ry="3.5" fill="rgba(40,20,90,.22)" />

      <g className="oest-float">
        <g className="oest-body">
          {/* antenna: swings from its base inside the head */}
          <g className="oest-antenna">
            <line x1="60" y1="26" x2="60" y2="10" stroke="#7c4dd8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="60" cy="7" r="5" fill="#9b7bf0" />
          </g>

          <path d="M60 22c26 0 42 20 42 46 0 22-14 34-42 34S18 90 18 68c0-26 16-46 42-46z" fill="url(#oest-m)" />

          <g className="oest-eye oest-eye-l">
            <circle cx="47" cy="58" r="12" fill="#fff" />
            <circle className="oest-pupil" cx="49" cy="60" r="6" fill="#2a1a52" />
          </g>
          <g className="oest-eye oest-eye-r">
            <circle cx="75" cy="58" r="12" fill="#fff" />
            <circle className="oest-pupil" cx="77" cy="60" r="6" fill="#2a1a52" />
          </g>

          <path className="oest-mouth" d="M52 82q9 7 18 0" stroke="#2a1a52" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}
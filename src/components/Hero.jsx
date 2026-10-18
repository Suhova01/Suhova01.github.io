import { useRef, useState } from 'react'

const COLORS = ['#ffd23f', '#ff8fb1', '#3dbe8b', '#5b4bdb', '#ffffff']
let ctx

function chime() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    const t = ctx.currentTime
    ;[[784, 0.5], [1568, 0.28], [2093, 0.14], [3136, 0.07]].forEach(([f, g], i) => {
      const o = ctx.createOscillator(), v = ctx.createGain()
      o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.004)
      v.gain.setValueAtTime(0, t)
      v.gain.linearRampToValueAtTime(g * 0.35, t + 0.01)
      v.gain.exponentialRampToValueAtTime(0.0001, t + 2.4 - i * 0.4)
      o.connect(v); v.connect(ctx.destination); o.start(t); o.stop(t + 2.5)
    })
  } catch { /* звук необязателен */ }
}

function spawn(stage, css, frames, opts) {
  const el = document.createElement('i')
  el.className = 'bit'
  el.style.cssText = css
  stage.appendChild(el)
  el.animate(frames, opts).onfinish = () => el.remove()
}

export default function Hero({ title = '', intro }) {
  const stage = useRef(null), btn = useRef(null), svg = useRef(null)
  const [rung, setRung] = useState(false)
  const words = title.split(' ')

  function ringBell() {
    setRung(true)
    chime()
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    svg.current.animate(
      [0, -17, 13, -9, 5, -2, 0].map((a) => ({ transform: `rotate(${a}deg)` })),
      { duration: 2000, easing: 'ease-in-out' },
    )
    const r = stage.current.getBoundingClientRect(), b = btn.current.getBoundingClientRect()
    const cx = b.left - r.left + b.width / 2, cy = b.top - r.top + b.height * 0.82
    for (let i = 0; i < 30; i++) {
      const s = 7 + Math.random() * 9, a = Math.random() * Math.PI * 2, v = 90 + Math.random() * 130
      const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 50
      spawn(stage.current,
        `left:${cx}px;top:${cy}px;width:${s}px;height:${s}px;background:${COLORS[i % 5]};border-radius:${i % 3 ? '50%' : '3px'}`,
        [{ transform: 'translate(0,0)', opacity: 1 },
         { transform: `translate(${dx}px,${dy}px) rotate(180deg)`, opacity: 1, offset: 0.55 },
         { transform: `translate(${dx * 1.1}px,${dy + 130}px) rotate(420deg) scale(.4)`, opacity: 0 }],
        { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' })
    }
    for (let k = 0; k < 2; k++) {
      spawn(stage.current,
        `left:${cx - 40}px;top:${cy - 40}px;width:80px;height:80px;border:4px solid #5b4bdb`,
        [{ transform: 'scale(.4)', opacity: 0.7 }, { transform: 'scale(3.6)', opacity: 0 }],
        { duration: 1200, delay: k * 220, easing: 'ease-out', fill: 'backwards' })
    }
  }

  return (
    <header className="hero">
      <div>
        <h1>
          {words.map((w, i) => (
            <span key={i} className={'w' + (i === words.length - 1 ? ' hl' : '')} style={{ '--i': i }}>{w}{' '}</span>
          ))}
        </h1>
        {intro && <p className="lead">{intro}</p>}
      </div>
      <div className="stage" ref={stage}>
        <button className="bell" ref={btn} onClick={ringBell} aria-label="Позвонить в колокольчик">
          <svg ref={svg} viewBox="0 0 300 330" aria-hidden="true">
            <path d="M150 0v34" stroke="#1b1747" strokeWidth="6" strokeLinecap="round" />
            <circle cx="150" cy="40" r="14" fill="#ffd23f" />
            <path d="M150 50c-10 0-18 8-18 18-45 12-72 50-72 100v48l-28 34h236l-28-34v-48c0-50-27-88-72-100 0-10-8-18-18-18z" fill="#5b4bdb" />
            <path d="M100 100c-20 22-28 50-28 80v40" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="12" strokeLinecap="round" />
            <rect x="32" y="250" width="236" height="22" rx="11" fill="#ffd23f" />
            <circle cx="105" cy="200" r="9" fill="#ff8fb1" /><circle cx="195" cy="178" r="7" fill="#3dbe8b" />
            <circle cx="150" cy="292" r="22" fill="#ff8fb1" />
          </svg>
        </button>
        <span className={'hint' + (rung ? ' off' : '')}>Позвони!</span>
      </div>
    </header>
  )
}

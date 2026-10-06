import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sound } from '../lib/sound'

interface Slash {
  id: number
  x: number
  y: number
  angle: number
  len: number
  sparks: { a: number; d: number; s: number }[]
}

const IGNORE = 'a, button, input, textarea, select, [role="button"], [data-no-slash], [data-cursor]'

/** Easter egg: clicking empty space occasionally leaves a crimson sword slash. */
export function SlashLayer() {
  const [slashes, setSlashes] = useState<Slash[]>([])
  const last = useRef(0)
  const seq = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.(IGNORE)) return
      const now = performance.now()
      if (now - last.current < 650 || Math.random() > 0.6) return
      last.current = now
      const id = ++seq.current
      const slash: Slash = {
        id,
        x: e.clientX,
        y: e.clientY,
        angle: -35 + (Math.random() - 0.5) * 50 + (Math.random() > 0.5 ? 0 : 180),
        len: 180 + Math.random() * 160,
        sparks: Array.from({ length: 9 }, () => ({ a: Math.random() * 360, d: 30 + Math.random() * 70, s: 2 + Math.random() * 3 })),
      }
      sound.slash()
      setSlashes((s) => [...s.slice(-3), slash])
      window.setTimeout(() => setSlashes((s) => s.filter((x) => x.id !== id)), 900)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] overflow-hidden" aria-hidden>
      <AnimatePresence>
        {slashes.map((s) => (
          <motion.div key={s.id} className="absolute left-0 top-0" style={{ x: s.x, y: s.y }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ transform: `rotate(${s.angle}deg)` }}>
              {/* the cut */}
              <motion.div
                className="absolute top-0 h-[3px] -translate-y-1/2 rounded-full"
                style={{
                  left: -s.len / 2,
                  width: s.len,
                  background: 'linear-gradient(90deg, transparent, #ff3347 30%, #fff 55%, #ff3347 75%, transparent)',
                  boxShadow: '0 0 18px 3px rgba(200,16,46,0.8)',
                  transformOrigin: '0% 50%',
                }}
                initial={{ scaleX: 0, scaleY: 1, opacity: 1 }}
                animate={{ scaleX: [0, 1, 1], scaleY: [1.6, 1, 0.1], opacity: [1, 1, 0] }}
                transition={{ duration: 0.55, times: [0, 0.3, 1], ease: 'easeOut' }}
              />
              {/* afterimage */}
              <motion.div
                className="absolute top-0 h-10 -translate-y-1/2"
                style={{ left: -s.len / 2, width: s.len, background: 'radial-gradient(ellipse at center, rgba(200,16,46,0.35), transparent 70%)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.6 }}
              />
            </div>
            {s.sparks.map((p, i) => (
              <motion.span
                key={i}
                className="absolute left-0 top-0 rounded-full bg-[#ffb4a8]"
                style={{ width: p.s, height: p.s, boxShadow: '0 0 6px #ff3347' }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((p.a * Math.PI) / 180) * p.d,
                  y: Math.sin((p.a * Math.PI) / 180) * p.d + 20,
                  opacity: 0,
                }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

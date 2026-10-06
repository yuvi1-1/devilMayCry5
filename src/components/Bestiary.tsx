import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, ScanEye } from 'lucide-react'
import { demons, type Demon } from '../data/demons'
import { useHasMouse } from '../hooks/useMediaQuery'
import { sound } from '../lib/sound'
import { SectionHeader, StatusDot } from './ui'

const ease = [0.16, 1, 0.3, 1] as const
type Filter = 'all' | 'enemy' | 'boss'
const filters: { id: Filter; label: string; test: (d: Demon) => boolean }[] = [
  { id: 'all', label: 'All records', test: () => true },
  { id: 'enemy', label: 'Enemies', test: (d) => d.kind === 'Enemy' },
  { id: 'boss', label: 'Bosses', test: (d) => d.kind === 'Boss' },
]

export function Bestiary() {
  const [filter, setFilter] = useState<Filter>('all')
  const list = demons.filter(filters.find((f) => f.id === filter)!.test)

  return (
    <section id="demons" className="relative overflow-hidden bg-void py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-crimson/[0.07] blur-[140px]" />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-20">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeader index="05" kicker="Demon Bestiary" title={['THE', 'BESTIARY']}>
            Demons of Red Grave City from Devil May Cry 5. Records stay obscured until a hunter requests clearance.
          </SectionHeader>

          {/* terminal panel */}
          <div className="w-full max-w-md border border-white/[0.07] bg-abyss/70 p-5 font-ui text-[0.7rem] tracking-[0.2em] text-ash uppercase backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-bone">
                <StatusDot /> Database online
              </span>
              <span className="tabular-nums">REC {String(list.length).padStart(2, '0')}/{String(demons.length).padStart(2, '0')}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <span>Location</span>
              <span className="text-crimson">Red Grave City</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Last sync</span>
              <span className="blink text-bone/70">Live</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter by class">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              data-cursor="Filter"
              className={`relative px-4 py-2 font-ui text-[0.68rem] tracking-[0.24em] uppercase transition-colors ${filter === f.id ? 'text-bone' : 'text-ash hover:text-bone'}`}
            >
              {filter === f.id && <motion.span layoutId="bestiary-filter" className="absolute inset-0 border border-crimson/70 bg-crimson/10" transition={{ duration: 0.5, ease }} />}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="mt-8 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((d, i) => (
              <DemonCard key={d.id} d={d} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&$'

function useScramble(text: string, active: boolean) {
  const [out, setOut] = useState('')
  const raf = useRef(0)
  useEffect(() => {
    cancelAnimationFrame(raf.current)
    if (!active) {
      setOut('')
      return
    }
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 600)
      const n = Math.floor(p * text.length)
      let s = text.slice(0, n)
      for (let i = n; i < text.length; i++) s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      setOut(s)
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [text, active])
  return out
}

function DemonCard({ d, index }: { d: Demon; index: number }) {
  const hasMouse = useHasMouse()
  const [hover, setHover] = useState(false)
  const [tapped, setTapped] = useState(false)
  const revealed = hasMouse ? hover : tapped
  const name = useScramble(d.name.toUpperCase(), revealed)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease, delay: index * 0.05 }}
      className="group relative aspect-[4/5] overflow-hidden bg-abyss min-[480px]:aspect-[3/4]"
      onMouseEnter={() => {
        setHover(true)
        sound.tick()
      }}
      onMouseLeave={() => setHover(false)}
      onClick={() => !hasMouse && setTapped((t) => !t)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      data-cursor={revealed ? 'Scan' : 'Reveal'}
      aria-label={`${d.name}. ${d.kind}. ${d.description}`}
    >
      <div className={`pointer-events-none absolute inset-0 border transition-colors duration-500 ${revealed ? 'border-crimson/50' : 'border-white/[0.06]'}`} />

      {/* specimen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`absolute h-2/3 w-2/3 rounded-full bg-crimson/20 blur-3xl transition-opacity duration-700 ${revealed ? 'opacity-100' : 'opacity-30'}`} />
        {d.art && !d.art.cutout ? (
          <img
            src={d.art.src}
            alt={revealed ? d.name : ''}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              filter: revealed ? 'brightness(1) saturate(1.05)' : 'brightness(0.12) grayscale(1) blur(10px)',
              transform: revealed ? 'scale(1.04)' : 'scale(1.12)',
            }}
          />
        ) : (
          <img
            src={d.art?.src ?? d.image}
            alt={revealed ? d.name : ''}
            loading="lazy"
            decoding="async"
            className="relative h-[86%] w-[86%] object-contain transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              filter: revealed ? 'brightness(1.15) contrast(1.1) drop-shadow(0 0 18px rgba(200,16,46,0.45))' : 'brightness(0) drop-shadow(0 0 1px rgba(200,16,46,0.7)) blur(1.5px)',
              transform: revealed ? 'scale(1.06) translateY(-6%)' : 'scale(0.96)',
            }}
          />
        )}
      </div>

      {/* scan line */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="scan"
            className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-crimson/25 to-transparent"
            initial={{ top: '-15%' }}
            animate={{ top: '110%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-void via-void/80 to-transparent" />

      {/* file header */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <span className="font-ui text-[0.65rem] tracking-[0.2em] text-ash tabular-nums">FILE {String(index + 1).padStart(2, '0')}</span>
        <span className={`flex items-center gap-1.5 font-ui text-[0.6rem] tracking-[0.2em] uppercase transition-colors ${revealed ? 'text-crimson' : 'text-ash/60'}`}>
          {revealed ? <ScanEye className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
          {revealed ? 'Cleared' : 'Classified'}
        </span>
      </div>

      {/* record */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <p className="label text-[0.55rem] text-ash/70">{revealed ? d.game : 'Unidentified entity'}</p>
        <h3 className="mt-1.5 min-h-[1.25em] font-display text-lg leading-tight font-bold tracking-wide text-bone sm:text-xl xl:text-[1.4rem]">
          {revealed ? (
            name
          ) : (
            <span className="flex gap-1 pt-1.5" aria-hidden>
              {d.name.split(' ').map((w, k) => (
                <span key={k} className="inline-block h-[0.85em] bg-white/[0.12] [background-image:repeating-linear-gradient(90deg,transparent_0_6px,rgba(0,0,0,0.35)_6px_7px)]" style={{ width: `${w.length * 0.62}em` }} />
              ))}
            </span>
          )}
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <span
            className="skew-x-[-12deg] border px-2 py-0.5 font-ui text-[0.6rem] tracking-[0.25em] uppercase transition-colors duration-500"
            style={{
              borderColor: revealed ? (d.kind === 'Boss' ? '#ff1e35' : 'rgba(236,232,225,0.4)') : 'rgba(255,255,255,0.1)',
              color: revealed ? (d.kind === 'Boss' ? '#ff4a5c' : '#ece8e1') : 'rgba(119,119,126,0.8)',
              boxShadow: revealed && d.kind === 'Boss' ? '0 0 10px rgba(255,30,53,0.5)' : 'none',
            }}
          >
            {revealed ? d.kind : '???'}
          </span>
        </div>
        <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ gridTemplateRows: revealed ? '1fr' : '0fr' }}>
          <div className="overflow-hidden">
            <p className="pt-3 text-[0.8rem] leading-relaxed font-light text-bone/65">{d.description}</p>
          </div>
        </div>
        {!hasMouse && !revealed && <p className="label mt-3 text-[0.5rem] text-crimson/80">Tap to request clearance</p>}
      </div>
    </motion.article>
  )
}

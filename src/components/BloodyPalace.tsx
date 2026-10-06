import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { RotateCcw, Swords, Timer, Trophy } from 'lucide-react'
import { asset, official } from '../lib/asset'

const palaceArt = official('backgrounds/bloody-palace')
const hunters = (['dante', 'nero', 'v', 'vergil'] as const)
  .map((id) => ({ id, name: id === 'v' ? 'V' : id[0].toUpperCase() + id.slice(1), art: official(`bloody-palace/${id}`) }))
  .filter((h) => h.art)
import { sound } from '../lib/sound'
import { ranks } from '../data/ranks'
import { ParticleBackground } from './ParticleBackground'
import { MaskLines, PrimaryButton, StatusDot } from './ui'

const ease = [0.16, 1, 0.3, 1] as const
const FLOORS = [...Array.from({ length: 99 }, (_, i) => String(i + 1).padStart(2, '0')), '∞']
const ITEM = 72
const START_TIME = 20
const BEST_KEY = 'dmc-bloody-palace-best'

type Phase = 'idle' | 'playing' | 'over'

const hitsFor = (floor: number) => 3 + Math.floor(floor / 5)
const rankFor = (floor: number) => {
  const steps = [5, 10, 15, 20, 30, 45]
  const i = steps.findIndex((s) => floor < s)
  return ranks[i === -1 ? ranks.length - 1 : i]
}
const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

export function BloodyPalace() {
  const section = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [hunter, setHunter] = useState(0)
  const [floor, setFloor] = useState(1)
  const [hp, setHp] = useState(hitsFor(1))
  const [time, setTime] = useState(START_TIME)
  const [best, setBest] = useState(readBest)
  const [arena, animate] = useAnimate<HTMLDivElement>()
  const [strikes, setStrikes] = useState<number[]>([])
  const floorRef = useRef(1)
  const hpRef = useRef(hitsFor(1))

  // ---- tower ticker ------------------------------------------------------
  const floorMV = useMotionValue(0)
  const smoothFloor = useSpring(floorMV, { stiffness: 120, damping: 22 })
  const towerY = useTransform(smoothFloor, (f) => f * ITEM)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (phase === 'playing' || phase === 'over') return
    floorMV.set(Math.max(0, Math.min(98, (p - 0.15) * 1.6 * 98)))
  })

  // ---- game loop ----------------------------------------------------------
  useEffect(() => {
    if (phase !== 'playing') return
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      setTime((t) => Math.max(0, t - dt))
    }, 100)
    return () => clearInterval(id)
  }, [phase])

  useEffect(() => {
    if (phase === 'playing' && time <= 0) {
      setPhase('over')
      const reached = floorRef.current
      setBest((b) => {
        const nb = Math.max(b, reached)
        try {
          localStorage.setItem(BEST_KEY, String(nb))
        } catch {
          /* storage unavailable — keep in memory */
        }
        return nb
      })
    }
  }, [time, phase])

  const start = () => {
    floorRef.current = 1
    hpRef.current = hitsFor(1)
    setFloor(1)
    setHp(hpRef.current)
    setTime(START_TIME)
    floorMV.set(0)
    setPhase('playing')
    sound.slash()
  }

  const strike = useCallback(() => {
    if (phase !== 'playing') return
    sound.hit()
    setStrikes((s) => [...s.slice(-4), performance.now()])
    if (arena.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void animate(arena.current, { x: [0, -5, 4, 0] }, { duration: 0.18 })
    }
    if (hpRef.current > 1) {
      hpRef.current -= 1
      setHp(hpRef.current)
      return
    }
    const next = floorRef.current + 1
    floorRef.current = next
    hpRef.current = hitsFor(next)
    setHp(hpRef.current)
    setFloor(next)
    floorMV.set(Math.min(99, next - 1))
    setTime((t) => Math.min(30, t + 1.6))
    sound.rank(Math.min(6, Math.floor(next / 6)))
  }, [phase, animate, arena, floorMV])

  // keyboard
  useEffect(() => {
    if (phase !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'Space' || e.key === 'j' || e.key === 'k' || e.key === 'Enter') {
        e.preventDefault()
        strike()
      }
      if (e.key === 'Escape') setPhase('idle')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, strike])

  const result = rankFor(floor)
  const maxHp = hitsFor(floor)

  return (
    <section id="bloody-palace" ref={section} className="relative overflow-hidden bg-void">
      {/* environment */}
      <img src={palaceArt?.src ?? asset('backgrounds/palace.svg')} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      {/* selected hunter's key art */}
      <AnimatePresence>
        {hunters[hunter] && (
          <motion.img
            key={hunters[hunter].id}
            src={hunters[hunter].art!.src}
            alt=""
            aria-hidden
            className="absolute inset-y-0 right-0 h-full w-full object-cover object-[70%_30%] [mask-image:linear-gradient(to_right,transparent_15%,black_65%)] lg:w-[75%]"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: phase === 'playing' ? 0.12 : 0.24, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease }}
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent" />
      <div className="fog opacity-60" />
      <ParticleBackground density={0.5} max={50} interactive={false} />
      <div className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0_2px,transparent_2px_4px)] opacity-40" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-20 lg:py-32">
        {/* left: copy / game */}
        <div ref={arena} className="relative">
          <div className="flex items-center gap-4">
            <span className="font-ui text-sm font-semibold text-crimson">09</span>
            <span className="h-px w-16 bg-gradient-to-r from-crimson to-transparent" />
            <span className="label flex items-center gap-2 text-ash">
              <StatusDot /> Arena open · 24 / 7
            </span>
          </div>

          <MaskLines
            lines={[
              'BLOODY',
              <span key="p" className="text-blood">
                PALACE
              </span>,
            ]}
            className="mt-6 font-display text-[clamp(3.2rem,10vw,10rem)] leading-[0.86] font-black text-bone"
          />
          <p className="mt-6 font-serif text-[clamp(1.4rem,2.6vw,2.4rem)] text-bone/85 italic">How far can you climb?</p>

          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
                <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed font-light text-bone/60">
                  The series’ survival mode: floor after floor of demons against a ticking clock — 101 floors in Devil May Cry 5. Clearing a floor adds time. Try this arcade take on it below.
                </p>
                {hunters.length > 0 && (
                  <div className="mt-8">
                    <p className="label text-[0.55rem] text-ash">Choose your hunter</p>
                    <div className="mt-3 grid max-w-xl grid-cols-4 gap-2" role="radiogroup" aria-label="Choose your hunter">
                      {hunters.map((h, i) => (
                        <button
                          key={h.id}
                          type="button"
                          role="radio"
                          aria-checked={hunter === i}
                          onClick={() => {
                            setHunter(i)
                            sound.tick()
                          }}
                          data-cursor="Select"
                          className={`group relative aspect-video overflow-hidden transition-all duration-500 ${hunter === i ? 'ring-1 ring-crimson shadow-[0_0_24px_-4px_rgba(200,16,46,0.8)]' : 'opacity-60 hover:opacity-100'}`}
                        >
                          <img src={h.art!.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-[65%_30%] transition-transform duration-700 group-hover:scale-110" />
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void to-transparent px-2 pb-1 pt-4 text-left font-ui text-[0.65rem] tracking-[0.2em] text-bone uppercase">{h.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-10 flex flex-wrap items-center gap-8">
                  <PrimaryButton onClick={start} cursor="Enter">
                    Enter Bloody Palace
                  </PrimaryButton>
                  <div className="font-ui text-xs tracking-[0.25em] text-ash uppercase">
                    <span className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-crimson" /> Personal best
                    </span>
                    <span className="mt-1 block font-display text-2xl tracking-normal text-bone tabular-nums">{best ? `Floor ${String(best).padStart(2, '0')}` : '— —'}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'playing' && (
              <motion.div key="play" className="mt-8 max-w-xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} data-no-slash>
                {hunters[hunter] && (
                  <p className="label mb-4 text-[0.6rem] text-crimson">
                    Hunter · <span className="text-bone">{hunters[hunter].name}</span>
                  </p>
                )}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="label text-[0.55rem] text-ash">Floor</p>
                    <div className="relative mt-1 h-[clamp(3.5rem,8vw,6rem)] overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.p
                          key={floor}
                          className="font-display text-[clamp(3.5rem,8vw,6rem)] leading-none font-black text-bone tabular-nums"
                          initial={{ y: '100%', opacity: 0 }}
                          animate={{ y: '0%', opacity: 1 }}
                          exit={{ y: '-100%', opacity: 0 }}
                          transition={{ duration: 0.35, ease }}
                        >
                          {String(floor).padStart(2, '0')}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                  <div>
                    <p className="label flex items-center gap-2 text-[0.55rem] text-ash">
                      <Timer className="h-3 w-3" /> Time
                    </p>
                    <p className={`mt-1 font-display text-[clamp(3.5rem,8vw,6rem)] leading-none font-black tabular-nums ${time < 5 ? 'text-crimson flicker' : 'text-bone'}`}>
                      {time.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between font-ui text-[0.6rem] tracking-[0.25em] text-ash uppercase">
                    <span>Floor guardians</span>
                    <span className="tabular-nums">{hp} / {maxHp}</span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: maxHp }, (_, i) => (
                      <span key={i} className="h-2 flex-1 skew-x-[-20deg] transition-colors duration-150" style={{ background: i < hp ? '#c8102e' : 'rgba(255,255,255,0.08)', boxShadow: i < hp ? '0 0 8px rgba(200,16,46,0.6)' : 'none' }} />
                    ))}
                  </div>
                  <div className="mt-3 h-px bg-white/10">
                    <div className="h-full origin-left bg-bone/70 transition-transform duration-100" style={{ transform: `scaleX(${time / 30})` }} />
                  </div>
                </div>

                <div className="relative mt-8 flex flex-wrap items-center gap-6">
                  <motion.button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault()
                      strike()
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    whileTap={{ scale: 0.94 }}
                    data-cursor="Slash"
                    className="clip-blade relative flex h-20 w-56 touch-manipulation items-center justify-center gap-3 overflow-hidden bg-crimson font-ui text-lg font-bold tracking-[0.4em] text-white uppercase shadow-[0_0_40px_-6px_rgba(200,16,46,0.9)] select-none"
                  >
                    <Swords className="h-5 w-5" /> Strike
                    <AnimatePresence>
                      {strikes.slice(-1).map((s) => (
                        <motion.span
                          key={s}
                          className="absolute inset-y-0 w-10 skew-x-[-25deg] bg-white/70"
                          initial={{ x: -200, opacity: 1 }}
                          animate={{ x: 260, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.button>
                  <div className="label text-[0.55rem] leading-loose text-ash">
                    Tap · Click · <span className="text-bone">Space</span> / <span className="text-bone">J</span>
                    <br />
                    <button type="button" onClick={() => setPhase('idle')} className="text-ash underline-offset-4 hover:text-bone hover:underline">
                      Esc to retreat
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'over' && (
              <motion.div key="over" className="mt-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease }}>
                <p className="label text-crimson">Time's up — the palace claims another</p>
                <div className="mt-4 flex items-end gap-8">
                  <div>
                    <p className="label text-[0.55rem] text-ash">Floor reached</p>
                    <p className="font-display text-[clamp(4rem,9vw,7rem)] leading-none font-black text-bone tabular-nums">{String(floor).padStart(2, '0')}</p>
                  </div>
                  <div>
                    <p className="label text-[0.55rem] text-ash">Rank</p>
                    <motion.p
                      className="font-display text-[clamp(4rem,9vw,7rem)] leading-none font-black"
                      style={{ color: result.color, textShadow: `0 0 30px ${result.glow}`, skewX: '-10deg' }}
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.2 }}
                    >
                      {result.letter}
                    </motion.p>
                  </div>
                </div>
                <p className="mt-3 font-serif text-xl italic" style={{ color: result.color }}>
                  {result.word}
                  {floor >= best && floor > 1 && <span className="label ml-4 text-[0.55rem] not-italic text-bone">New record</span>}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <PrimaryButton onClick={start} cursor="Again">
                    Climb again
                  </PrimaryButton>
                  <button type="button" onClick={() => setPhase('idle')} data-cursor="Exit" className="label flex items-center gap-2 text-ash hover:text-bone">
                    <RotateCcw className="h-3.5 w-3.5" /> Leave the palace
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* right: the tower */}
        <div className="relative mx-auto h-[min(62vh,560px)] w-full max-w-[340px] lg:h-[min(76vh,720px)]" aria-hidden>
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-crimson/40 to-transparent" />
          <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]">
            <motion.ul className="absolute inset-x-0 flex flex-col-reverse" style={{ y: towerY, bottom: `calc(50% - ${ITEM / 2}px)` }}>
              {FLOORS.map((f, i) => (
                <li key={f} className="flex items-center justify-between px-4" style={{ height: ITEM }}>
                  <span className="font-ui text-[0.55rem] tracking-[0.3em] text-ash/50 uppercase">{i % 10 === 9 ? 'Boss' : 'Floor'}</span>
                  <span className={`font-display text-4xl font-black tabular-nums ${i % 10 === 9 ? 'text-crimson/70' : 'text-bone/25'}`}>{f}</span>
                  <span className="h-px w-6 bg-white/10" />
                </li>
              ))}
            </motion.ul>
          </div>
          {/* selection frame */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ height: ITEM }}>
            <div className="absolute inset-0 border-y border-crimson/70 bg-crimson/10 shadow-[0_0_40px_-8px_rgba(200,16,46,0.8)]" />
            <div className="absolute -left-2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-l-[8px] border-y-transparent border-l-crimson" />
            <div className="absolute -right-2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[6px] border-r-[8px] border-y-transparent border-r-crimson" />
          </div>
          <p className="label absolute -bottom-8 left-0 right-0 text-center text-[0.55rem] text-ash/60">01 → 99 → ∞</p>
        </div>
      </div>
    </section>
  )
}

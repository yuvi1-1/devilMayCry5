import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ranks } from '../data/ranks'
import { sound } from '../lib/sound'
import { ParticleBackground } from './ParticleBackground'
import { MaskLines, StatusDot } from './ui'

const ease = [0.16, 1, 0.3, 1] as const
const N = ranks.length

export function StyleRank() {
  const section = useRef<HTMLElement>(null)
  const hits = useRef<HTMLSpanElement>(null)
  const [rank, setRank] = useState(0)
  const [stage, animate] = useAnimate<HTMLDivElement>()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const r = Math.min(N - 1, Math.max(0, Math.floor(p * N * 0.999)))
    setRank(r)
    if (hits.current) hits.current.textContent = String(Math.round(p * 999)).padStart(3, '0')
  })

  const gauge = useTransform(scrollYProgress, (p) => {
    const local = p * N
    return local >= N - 1 ? 1 : local - Math.floor(local)
  })

  // impact on rank change
  const prev = useRef(0)
  useEffect(() => {
    if (rank === prev.current) return
    const up = rank > prev.current
    prev.current = rank
    if (!up || !stage.current) return
    sound.rank(rank)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const k = 4 + rank * 2
      void animate(stage.current, { x: [0, -k, k * 0.7, -k * 0.4, 0], y: [0, k * 0.4, -k * 0.3, 0] }, { duration: 0.45 })
    }
  }, [rank, animate, stage])

  const jump = (i: number) => {
    const el = section.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const distance = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.5) / N) * distance, behavior: 'smooth' })
  }

  const r = ranks[rank]
  const sss = rank === N - 1
  const letterSize = r.letter.length === 1 ? 1 : r.letter.length === 2 ? 0.74 : 0.58

  return (
    <section id="style-rank" ref={section} className="relative h-[320vh] bg-void lg:h-[440vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ambient glow follows the rank colour */}
        <div
          className="absolute inset-0 transition-[background] duration-700"
          style={{ background: `radial-gradient(60% 60% at 68% 50%, ${r.glow.replace(/[\d.]+\)$/, `${0.08 + rank * 0.035})`)}, transparent 70%)` }}
        />
        {/* rotating light rays (SSS) */}
        <motion.div
          className="pointer-events-none absolute left-[68%] top-1/2 h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2 bg-[repeating-conic-gradient(from_0deg,rgba(255,30,53,0.13)_0deg_4deg,transparent_4deg_18deg)] max-lg:left-1/2"
          animate={{ opacity: sss ? 1 : 0, rotate: sss ? 360 : 0 }}
          transition={{ opacity: { duration: 0.6 }, rotate: { duration: 60, repeat: Infinity, ease: 'linear' } }}
          style={{ maskImage: 'radial-gradient(circle, black 0%, transparent 55%)', WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 55%)' }}
        />
        <AnimatePresence>
          {rank >= N - 2 && (
            <motion.div key="embers" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: sss ? 1 : 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <ParticleBackground density={1.4} max={130} interactive={false} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* scanline grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="relative mx-auto grid h-full max-w-[1600px] grid-rows-[auto_1fr_auto] px-5 pb-8 pt-24 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-1 lg:items-center lg:px-20 lg:py-0">
          {/* Copy + ladder */}
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <span className="font-ui text-sm font-semibold text-crimson">02</span>
              <span className="h-px w-16 bg-gradient-to-r from-crimson to-transparent" />
              <span className="label text-ash">Combat evaluation</span>
            </div>
            <MaskLines lines={['STYLE', 'RANK']} className="mt-4 font-display text-[clamp(2.6rem,7vw,7rem)] leading-[0.9] font-black text-bone lg:mt-6" />
            <p className="mt-4 max-w-sm font-serif text-lg text-bone/70 italic md:text-xl lg:mt-6">Master the art of combat without getting hit.</p>
            <p className="mt-3 hidden max-w-sm text-sm leading-relaxed font-light text-bone/50 lg:block">
              Variety, rhythm and zero damage push you up the ladder. Repeat yourself or take a hit and the meter drains. Keep scrolling — every frame is a combo.
            </p>

            <ol className="mt-10 hidden flex-col gap-1 lg:flex" aria-label="Rank ladder">
              {ranks.map((x, i) => {
                const on = i === rank
                const passed = i < rank
                return (
                  <li key={x.letter}>
                    <button type="button" onClick={() => jump(i)} data-cursor="Rank" className="group flex w-full max-w-sm items-center gap-4 py-1.5 text-left">
                      <span
                        className="w-10 font-display text-lg font-black transition-all duration-500"
                        style={{ color: on || passed ? x.color : 'rgba(119,119,126,0.5)', textShadow: on ? `0 0 16px ${x.glow}` : 'none' }}
                      >
                        {x.letter}
                      </span>
                      <span className="relative h-px flex-1 overflow-hidden bg-white/[0.08]">
                        <span
                          className="absolute inset-0 origin-left transition-transform duration-700"
                          style={{ background: x.color, transform: `scaleX(${passed ? 1 : on ? 0.5 : 0})` }}
                        />
                      </span>
                      <span className={`label w-40 text-right text-[0.6rem] transition-colors duration-500 ${on ? 'text-bone' : 'text-ash/50 group-hover:text-ash'}`}>{x.word}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* The meter */}
          <div ref={stage} className="relative flex min-h-0 items-center justify-center">
            {/* shockwave rings */}
            <AnimatePresence>
              {rank > 0 && (
                <motion.div key={`ring-${rank}`} className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {[0, 1].map((k) => (
                    <motion.span
                      key={k}
                      className="absolute h-[40vmin] w-[40vmin] rounded-full border"
                      style={{ borderColor: r.color }}
                      initial={{ scale: 0.4, opacity: 0.9 }}
                      animate={{ scale: 2.4 + k, opacity: 0 }}
                      transition={{ duration: 1 + k * 0.3, ease: 'easeOut', delay: k * 0.08 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {/* flash */}
            <AnimatePresence>
              <motion.div
                key={`flash-${rank}`}
                className="pointer-events-none absolute -inset-[100vmax]"
                style={{ background: r.color }}
                initial={{ opacity: rank > 3 ? 0.18 : 0 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatePresence>

            {/* outlined word behind */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`w-${rank}`}
                className={`pointer-events-none absolute whitespace-nowrap font-display font-black text-outline uppercase ${r.word.length > 10 ? 'text-[clamp(2rem,5vw,5rem)]' : 'text-[clamp(3rem,8vw,8rem)]'}`}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 0.45, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.8, ease }}
              >
                {r.word}
              </motion.span>
            </AnimatePresence>

            <div className="relative flex flex-col items-center">
              <div className="relative flex h-[clamp(11rem,34vw,30rem)] items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={r.letter}
                    className="block font-display leading-none font-black"
                    style={{
                      fontSize: `calc(clamp(11rem, 34vw, 30rem) * ${letterSize})`,
                      backgroundImage: `linear-gradient(180deg, #fff 0%, ${r.color} 55%, #200006 120%)`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      filter: `drop-shadow(0 0 ${12 + rank * 6}px ${r.glow})`,
                      skewX: '-10deg',
                    }}
                    initial={{ scale: 2.4, opacity: 0, rotate: -14, filter: `blur(20px) drop-shadow(0 0 0px ${r.glow})` }}
                    animate={{ scale: 1, opacity: 1, rotate: -4, filter: `blur(0px) drop-shadow(0 0 ${12 + rank * 6}px ${r.glow})` }}
                    exit={{ scale: 0.6, opacity: 0, x: -60, filter: 'blur(12px) drop-shadow(0 0 0px rgba(0,0,0,0))' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, opacity: { duration: 0.25 } }}
                  >
                    {r.letter}
                  </motion.span>
                </AnimatePresence>
                {sss && (
                  <motion.span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center font-display leading-none font-black text-crimson mix-blend-screen"
                    style={{ fontSize: `calc(clamp(11rem, 34vw, 30rem) * ${letterSize})`, skewX: '-10deg', rotate: -4 }}
                    animate={{ opacity: [0, 0.6, 0], scale: [1, 1.12, 1.2] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    aria-hidden
                  >
                    {r.letter}
                  </motion.span>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={r.word}
                  className="font-serif text-[clamp(1.2rem,2.4vw,2.2rem)] italic"
                  style={{ color: r.color }}
                  initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(8px)' }}
                  animate={{ opacity: 1, letterSpacing: '0.12em', filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.6, ease }}
                >
                  {r.word}
                </motion.p>
              </AnimatePresence>

              {/* gauge */}
              <div className="mt-6 w-[min(70vw,360px)]">
                <div className="flex justify-between font-ui text-[0.6rem] tracking-[0.3em] text-ash uppercase">
                  <span>Style gauge</span>
                  <span>
                    Hits <span ref={hits} className="text-bone tabular-nums">000</span>
                  </span>
                </div>
                <div className="relative mt-2 h-1.5 skew-x-[-20deg] bg-white/[0.07]">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full origin-left"
                    style={{ scaleX: gauge, background: `linear-gradient(90deg, ${r.color}66, ${r.color})`, boxShadow: `0 0 14px ${r.glow}` }}
                  />
                </div>
                <p className="label mt-3 flex items-center gap-2 text-[0.55rem] text-ash/70">
                  <StatusDot /> No damage taken
                </p>
              </div>
            </div>
          </div>

          {/* Mobile ladder */}
          <ol className="flex items-center justify-between gap-1 lg:hidden" aria-label="Rank ladder">
            {ranks.map((x, i) => (
              <li key={x.letter}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  className="px-1.5 py-2 font-display text-base font-black transition-colors duration-500"
                  style={{ color: i <= rank ? x.color : 'rgba(119,119,126,0.45)', textShadow: i === rank ? `0 0 12px ${x.glow}` : 'none' }}
                >
                  {x.letter}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

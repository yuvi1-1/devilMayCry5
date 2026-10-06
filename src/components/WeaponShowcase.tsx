import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { weapons, type Weapon } from '../data/weapons'
import { useHasMouse, useIsDesktop } from '../hooks/useMediaQuery'
import { sound } from '../lib/sound'
import { Corners, SectionHeader } from './ui'

const ease = [0.16, 1, 0.3, 1] as const

export function WeaponShowcase() {
  const isDesktop = useIsDesktop()
  return isDesktop ? <PinnedRail /> : <SwipeRail />
}

const intro = (
  <SectionHeader index="04" kicker="The Arsenal" title={['DEVIL', 'ARMS']}>
    Devil Arms forged from defeated demons, the blades of Sparda, and the guns that back them up.
  </SectionHeader>
)

/* Desktop — vertical scroll drives a horizontal track ------------------------- */
function PinnedRail() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  const distance = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const x = useTransform(() => -smooth.get() * distance.get())
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return
      const d = Math.max(0, track.current.scrollWidth - window.innerWidth)
      distance.set(d)
      setHeight(d + window.innerHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [distance])

  return (
    <section id="weapons" ref={section} className="relative bg-abyss" style={{ height: height ?? '300vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(200,16,46,0.07),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/[0.04]" />
        <motion.div ref={track} className="relative flex h-full w-max items-center gap-8 pl-20 pr-[12vw]" style={{ x }}>
          <div className="w-[34vw] max-w-[560px] shrink-0 pr-10">
            {intro}
            <p className="label mt-12 flex items-center gap-3 text-[0.6rem] text-ash/70">
              <span className="h-px w-10 bg-ash/40" /> Scroll to traverse the armoury
            </p>
          </div>
          {weapons.map((w, i) => (
            <WeaponCard key={w.id} w={w} index={i} interactive />
          ))}
          <div className="flex w-[28vw] shrink-0 flex-col justify-center pl-10">
            <p className="font-display text-5xl leading-tight font-black text-outline">MORE ARMS<br />LIE SEALED.</p>
            <p className="label mt-6 text-[0.6rem] text-ash/60">Archive continues in the next mission</p>
          </div>
        </motion.div>

        {/* progress */}
        <div className="absolute inset-x-20 bottom-10 flex items-center gap-6">
          <span className="label text-[0.55rem] text-ash">Armoury</span>
          <div className="relative h-px flex-1 bg-white/10">
            <motion.div className="absolute inset-0 origin-left bg-crimson" style={{ scaleX: bar }} />
          </div>
          <span className="label text-[0.55rem] text-ash tabular-nums">0{weapons.length} relics</span>
        </div>
      </div>
    </section>
  )
}

/* Mobile / tablet — native swipe with snap --------------------------------- */
function SwipeRail() {
  const hasMouse = useHasMouse()
  return (
    <section id="weapons" className="relative bg-abyss py-24">
      <div className="px-5 sm:px-10">{intro}</div>
      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden">
        {weapons.map((w, i) => (
          <WeaponCard key={w.id} w={w} index={i} interactive={hasMouse} />
        ))}
        <div className="w-1 shrink-0" />
      </div>
      <p className="label mt-4 px-5 text-[0.55rem] text-ash/60 sm:px-10">Swipe to browse →</p>
    </section>
  )
}

/* Artifact card --------------------------------------------------------------- */
function WeaponCard({ w, index, interactive }: { w: Weapon; index: number; interactive: boolean }) {
  const [hover, setHover] = useState(false)
  const reveal = hover || !interactive

  return (
    <motion.article
      className="group relative flex h-[min(74vh,660px)] w-[min(84vw,440px)] shrink-0 snap-center flex-col overflow-hidden bg-crypt lg:h-[min(74vh,680px)] lg:w-[clamp(360px,30vw,480px)]"
      onMouseEnter={() => {
        if (!interactive) return
        setHover(true)
        sound.tick()
      }}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      data-cursor="Inspect"
      aria-label={`${w.name}, ${w.type}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px -5% 0px -5%' }}
      transition={{ duration: 1, ease }}
    >
      <div className="pointer-events-none absolute inset-0 border border-white/[0.06] transition-colors duration-700" style={{ borderColor: hover ? `${w.accent}66` : undefined }} />
      <Corners className="border-bone/25" />

      {/* header */}
      <div className="relative z-10 flex items-start justify-between p-6">
        <div>
          <p className="font-ui text-xs text-crimson tabular-nums">0{index + 1} / 0{weapons.length}</p>
          <p className="label mt-1 text-[0.55rem] text-ash/70">Relic · {w.type}</p>
        </div>
        <span className="text-base text-white/30 [writing-mode:vertical-rl]">{w.jp}</span>
      </div>

      {/* display */}
      <div className="relative -mt-10 flex flex-1 items-center justify-center">
        <div
          className="absolute h-[70%] w-[70%] rounded-full blur-3xl transition-opacity duration-700"
          style={{ background: `radial-gradient(circle, ${w.accent}55, transparent 65%)`, opacity: hover ? 1 : 0.35 }}
        />
        <div className="absolute h-[58%] aspect-square rounded-full border border-white/[0.05]" />
        <motion.div
          className="absolute h-[72%] aspect-square rounded-full border border-dashed"
          style={{ borderColor: `${w.accent}40` }}
          animate={{ rotate: 360 }}
          transition={{ duration: hover ? 12 : 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.img
          src={w.art?.src ?? w.image}
          alt={w.name}
          loading="lazy"
          decoding="async"
          className={w.art ? 'relative max-h-[86%] max-w-[82%] object-contain' : 'relative w-[118%] max-w-none'}
          animate={{
            rotate: w.art ? (hover ? -4 : 0) : hover ? -24 : -34,
            scale: hover ? 1.06 : 0.96,
            y: hover ? -6 : [0, -8, 0],
            filter: hover ? `drop-shadow(0 0 22px ${w.accent}aa) brightness(1.15)` : `drop-shadow(0 0 0px ${w.accent}00) brightness(0.9)`,
          }}
          transition={hover ? { duration: 0.9, ease } : { duration: 0.9, ease, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        />
        {/* energy sweep */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-1/4 skew-x-[-20deg] mix-blend-screen"
          style={{ background: `linear-gradient(90deg, transparent, ${w.accent}55, transparent)` }}
          initial={{ x: '-260%' }}
          animate={hover ? { x: ['-260%', '360%'] } : { x: '-260%' }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
      </div>

      {/* info */}
      <div className="relative z-10 p-6 pt-0">
        <h3 className="flex min-h-[2em] items-end font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1] font-black tracking-wide text-bone transition-[letter-spacing] duration-700 group-hover:tracking-[0.05em]">
          {w.name.toUpperCase()}
        </h3>
        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          {[
            ['Type', w.type],
            ['Ability', w.ability],
            ['Wielder', w.wielder],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="label text-[0.5rem] text-ash">{k}</dt>
              <dd className="mt-1.5 font-ui text-[0.82rem] leading-tight tracking-wide text-bone/90">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="relative mt-5 h-[7.5rem]">
          <motion.div
            className="absolute inset-0 flex items-center gap-3"
            animate={{ opacity: reveal ? 0 : 1, y: reveal ? -8 : 0 }}
            transition={{ duration: 0.4 }}
            aria-hidden={reveal}
          >
            <span className="h-px w-8 bg-crimson" />
            <span className="label text-[0.55rem] text-ash/70">Hover to inspect artifact</span>
          </motion.div>
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 10 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="line-clamp-2 text-[0.82rem] leading-relaxed font-light text-bone/60">{w.description}</p>
            <p className="label mt-4 text-[0.5rem] text-ash">Moves · First appears in {w.debut}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {w.moves.map((m, i) => (
                <motion.li
                  key={m}
                  className="border px-2 py-1 font-ui text-[0.7rem] tracking-[0.12em] text-bone uppercase"
                  style={{ borderColor: `${w.accent}66`, boxShadow: reveal ? `inset 0 0 12px -6px ${w.accent}` : 'none' }}
                  initial={false}
                  animate={{ opacity: reveal ? 1 : 0, x: reveal ? 0 : -6 }}
                  transition={{ duration: 0.5, ease, delay: reveal ? 0.1 + i * 0.06 : 0 }}
                >
                  {m}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.article>
  )
}

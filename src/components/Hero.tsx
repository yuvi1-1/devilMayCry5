import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { asset, official, officialGroup } from '../lib/asset'

// Drop official key art at src/assets/official/backgrounds/hero.(jpg|webp|png) to replace the placeholder scene.
const heroSingle = official('backgrounds/hero')
// Every image in src/assets/official/hero becomes a crossfading Ken Burns slideshow
const heroSlides = officialGroup('hero').map((a) => a.src)
const slides = heroSlides.length ? heroSlides : heroSingle ? [heroSingle.src] : []
const heroArt = slides.length > 0

function HeroSlides({ active }: { active: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!active || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setI((n) => (n + 1) % slides.length), 6500)
    return () => clearInterval(id)
  }, [active])
  return (
    <>
      {slides.map((src, n) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          aria-hidden
          decoding="async"
          loading={n === 0 ? 'eager' : 'lazy'}
          fetchPriority={n === 0 ? 'high' : 'low'}
          className="absolute inset-0 h-full w-full object-cover object-[60%_45%]"
          initial={false}
          animate={{ opacity: n === i ? 1 : 0, scale: n === i ? 1.12 : 1.02 }}
          transition={{ opacity: { duration: 1.6, ease: 'easeInOut' }, scale: { duration: 8, ease: 'linear' } }}
        />
      ))}
      {slides.length > 1 && (
        <div className="absolute bottom-24 right-5 z-10 flex gap-1.5 sm:right-10 lg:bottom-28 lg:right-20" aria-hidden>
          {slides.map((_, n) => (
            <span key={n} className="relative h-[2px] w-6 overflow-hidden bg-white/15">
              {n === i && (
                <motion.span className="absolute inset-0 origin-left bg-crimson" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 6.5, ease: 'linear' }} />
              )}
            </span>
          ))}
        </div>
      )}
    </>
  )
}
import { useExperience } from '../context/Experience'
import { useHasMouse, useReducedMotion } from '../hooks/useMediaQuery'
import { ParticleBackground } from './ParticleBackground'
import { GhostButton, PrimaryButton, StatusDot } from './ui'

const ease = [0.16, 1, 0.3, 1] as const
const titleLines = [
  { text: 'DEVIL', className: 'text-metal' },
  { text: 'MAY', className: 'text-outline pl-[0.9em] italic md:pl-[1.4em]' },
  { text: 'CRY', className: 'text-metal' },
]

export function Hero() {
  const { ready, go } = useExperience()
  const ref = useRef<HTMLElement>(null)
  const hasMouse = useHasMouse()
  const reduced = useReducedMotion()
  const parallax = hasMouse && !reduced

  // Mouse parallax — motion values only, no React re-renders
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.6 })
  const bgX = useTransform(sx, (v) => v * -16)
  const bgY = useTransform(sy, (v) => v * -10)
  const fgX = useTransform(sx, (v) => v * -42)
  const fgY = useTransform(sy, (v) => v * -20)
  const fgR = useTransform(sx, (v) => v * 1.2)
  const txX = useTransform(sx, (v) => v * 8)

  useEffect(() => {
    if (!parallax) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2)
      my.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [parallax, mx, my])

  // Scroll-out parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scrollBg = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const scrollFg = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const contentO = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.85])

  const t = (d: number) => (ready ? { delay: d } : {})

  return (
    <section id="home" ref={ref} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-void">
      {/* Background environment */}
      <motion.div className="absolute inset-0" style={{ y: scrollBg }}>
        <motion.div className="absolute -inset-[4%]" style={parallax ? { x: bgX, y: bgY } : undefined}>
          {heroArt ? (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.18, filter: 'blur(10px) brightness(0.3)' }}
              animate={ready ? { opacity: 1, scale: 1, filter: 'blur(0px) brightness(0.8)' } : undefined}
              transition={{ duration: 3, ease, ...t(1.1) }}
            >
              <HeroSlides active={ready} />
            </motion.div>
          ) : (
            <motion.img
              src={asset('backgrounds/hero-bg.svg')}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[62%_50%]"
              initial={{ opacity: 0, scale: 1.22, filter: 'blur(10px) brightness(0.4)' }}
              animate={ready ? { opacity: 1, scale: 1.04, filter: 'blur(0px) brightness(1)' } : undefined}
              transition={{ duration: 3, ease, ...t(1.1) }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* fog */}
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ duration: 3, ...t(1.6) }}>
        <div className="fog" />
        <div className="fog fog-2" />
      </motion.div>

      {/* Foreground sword (placeholder scene only) */}
      {!heroArt && (
      <motion.div
        className="pointer-events-none absolute bottom-[-6%] right-[-28%] h-[88%] w-auto sm:right-[2%] sm:h-[96%] lg:right-[9%]"
        style={{ y: scrollFg }}
      >
        <motion.div className="relative h-full opacity-35 sm:opacity-100" style={parallax ? { x: fgX, y: fgY, rotate: fgR } : undefined}>
          <motion.div
            className="absolute left-1/2 top-[8%] h-[60%] w-[160%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,30,53,0.38),transparent)]"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: [0, 1, 0.75, 1] } : undefined}
            transition={{ duration: 3, ...t(2) }}
          />
          <motion.img
            src={asset('backgrounds/hero-sword.svg')}
            alt=""
            decoding="async"
            className="relative h-full w-auto [mask-image:linear-gradient(to_bottom,black_68%,transparent_96%)]"
            initial={{ opacity: 0, y: 120, filter: 'brightness(0)' }}
            animate={ready ? { opacity: 1, y: 0, filter: 'brightness(1)' } : undefined}
            transition={{ duration: 2.4, ease, ...t(1.6) }}
          />
        </motion.div>
      </motion.div>

      )}

      {/* embers */}
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ duration: 2, ...t(2) }}>
        <ParticleBackground active={ready} density={0.55} max={70} />
      </motion.div>

      {/* legibility gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/60 to-transparent md:via-void/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent" />
      <motion.div className="pointer-events-none absolute inset-0 bg-void" style={{ opacity: veil }} />

      {/* red light sweep */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-crimson/35 to-transparent mix-blend-screen"
        initial={{ x: '0%', opacity: 0 }}
        animate={ready ? { x: '420%', opacity: [0, 1, 1, 0] } : undefined}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1], ...t(0.9) }}
      />

      {/* Content */}
      <motion.div className="relative z-10 flex h-full flex-col justify-center px-5 pb-20 pt-20 sm:px-10 lg:px-20" style={{ y: contentY, opacity: contentO }}>
        <motion.div style={parallax ? { x: txX } : undefined}>
          <motion.div
            className="label mb-6 flex items-center gap-3 text-ash md:mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={ready ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1, ease, ...t(2.2) }}
          >
            <StatusDot />
            <span>A fan-made experience</span>
            <span className="hidden h-px w-10 bg-ash/40 sm:inline-block" />
            <span className="hidden font-serif text-[0.8rem] tracking-[0.2em] normal-case text-ash/60 sm:inline">デビル メイ クライ</span>
          </motion.div>

          <h1 className="font-display text-[clamp(3.4rem,min(13vw,16.5vh),12.5rem)] leading-[0.84] font-black tracking-[-0.02em]">
            <span className="sr-only">Devil May Cry</span>
            {titleLines.map((l, i) => (
              <span key={l.text} className="block overflow-hidden pb-[0.04em]" aria-hidden>
                <motion.span
                  className={`block ${l.className}`}
                  initial={{ y: '105%', filter: 'blur(12px)', letterSpacing: '0.12em' }}
                  animate={ready ? { y: '0%', filter: 'blur(0px)', letterSpacing: '-0.02em' } : undefined}
                  transition={{ duration: 1.5, ease, ...t(0.3 + i * 0.16) }}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-6 flex items-center gap-4 md:mt-8"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, ...t(2.3) }}
          >
            <motion.span
              className="h-px w-12 origin-left bg-crimson md:w-20"
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.2, ease, ...t(2.3) }}
            />
            <p className="font-serif text-[clamp(1.25rem,2.4vw,2rem)] tracking-[0.18em] text-bone/90 italic">Devils never cry.</p>
          </motion.div>

          <motion.p
            className="mt-4 max-w-sm font-sans text-sm leading-relaxed font-light text-bone/50 md:text-[0.95rem] [@media(max-height:780px)]:hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, ...t(2.5) }}
          >
            A demonic tree, the Qliphoth, has torn through the heart of Red Grave City. Dante, Nero and a stranger named V answer the call.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8 md:mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, ...t(2.7) }}
          >
            <PrimaryButton onClick={() => go('universe', true)}>Enter the night</PrimaryButton>
            <GhostButton onClick={() => go('characters')}>Explore the hunters</GhostButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* HUD */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-6 sm:px-10 lg:px-20 lg:pb-10"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, ...t(3) }}
      >
        <button type="button" onClick={() => go('characters')} data-cursor="Scroll" className="group flex items-center gap-3 text-ash">
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-crimson"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          <span className="label text-[0.6rem] transition-colors group-hover:text-bone">Scroll to descend</span>
        </button>
        <div className="hidden text-right sm:block">
          <p className="label text-[0.6rem] text-ash/80">Devil May Cry 5 · Red Grave City</p>
          <p className="label mt-2 flex items-center justify-end gap-2 text-[0.6rem] text-crimson/90">
            <span className="blink">●</span> Qliphoth activity rising
          </p>
        </div>
      </motion.div>

      {/* vertical decorative type */}
      <div className="label pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-[0.55rem] text-ash/40 [writing-mode:vertical-rl] xl:block">
        Devil May Cry · 2001 — 2019
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { allies, book, chapters, finale } from '../data/story'
import { asset } from '../lib/asset'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { MaskLines } from './ui'

const ease = [0.16, 1, 0.3, 1] as const
const N = chapters.length
const EXPAND_START = 0.62
const EXPAND_END = 0.86
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * "Before the Nightmare" — pinned scroll story.
 * Chapters swap beside an image card; at the end the card opens into a full-bleed
 * frame of the novel cover and the final line lands.
 */
export function StoryScroll() {
  const section = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktop()
  const [chapter, setChapter] = useState(0)
  const [expanding, setExpanding] = useState(false)
  const [finalShown, setFinalShown] = useState(false)
  const { scrollYProgress: p } = useScroll({ target: section, offset: ['start start', 'end end'] })

  useMotionValueEvent(p, 'change', (v) => {
    setChapter(Math.min(N - 1, Math.max(0, Math.floor((v / EXPAND_START) * N))))
    setExpanding(v > EXPAND_START)
    setFinalShown(v > EXPAND_END - 0.04)
  })

  // card frame: inset(top right bottom left) in %
  const from = isDesktop ? [10, 11, 10, 57, 18] : [9, 9, 45, 9, 16]
  const e = useTransform(p, [EXPAND_START, EXPAND_END], [0, 1], { clamp: true })
  const clip = useTransform(e, (t) => {
    const k = 1 - Math.pow(1 - t, 3)
    return `inset(${lerp(from[0], 0, k)}% ${lerp(from[1], 0, k)}% ${lerp(from[2], 0, k)}% ${lerp(from[3], 0, k)}% round ${lerp(from[4], 0, k)}px)`
  })
  const imgScale = useTransform(p, [EXPAND_START, EXPAND_END, 1], [1.2, 1, 1.04])
  const copyOpacity = useTransform(p, [EXPAND_START, EXPAND_START + 0.08], [1, 0])
  const copyY = useTransform(p, [EXPAND_START, EXPAND_START + 0.1], [0, -40])
  const veil = useTransform(e, [0.4, 1], [0, 1])
  const progress = useTransform(p, [0, EXPAND_START], [0, 1], { clamp: true })

  const images = [...chapters.map((c) => c.image ?? asset(`characters/${c.id}.svg`)), book.cover?.src ?? asset('backgrounds/hero-bg.svg')]
  const showing = expanding ? N : chapter
  const cardBox = { top: `${from[0]}%`, right: `${from[1]}%`, bottom: `${from[2]}%`, left: `${from[3]}%` }

  return (
    <section id="story" className="relative bg-void">
      <div ref={section as never} className="relative h-[420vh] lg:h-[520vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* ambient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_50%,rgba(200,16,46,0.12),transparent_70%)]" />

          {/* the window — every image is full-viewport; the clip-path is the "card" */}
          <motion.div className="absolute inset-0 overflow-hidden bg-abyss shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]" style={{ clipPath: clip }}>
            {images.map((src, i) => (
              <motion.div
                key={i}
                className="absolute overflow-hidden"
                style={i < N ? cardBox : { inset: 0 }}
                initial={false}
                animate={{ opacity: showing === i ? 1 : 0, scale: showing === i ? 1 : 1.04 }}
                transition={{ duration: 0.9, ease }}
              >
                <motion.img
                  src={src}
                  alt={i < N ? `${chapters[i].pov} — novel illustration` : `${book.full} cover`}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover ${i < N ? 'object-top contrast-110 grayscale' : 'object-[50%_28%]'}`}
                  style={i < N ? undefined : { scale: imgScale }}
                />
                {i < N && <div className="absolute inset-0 bg-gradient-to-tr from-crimson/45 via-transparent to-transparent mix-blend-multiply" />}
              </motion.div>
            ))}
            <motion.div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" style={{ opacity: veil }} />
          </motion.div>

          {/* chapter copy */}
          <motion.div
            className="relative z-10 flex h-full flex-col justify-end px-5 pb-8 sm:px-10 lg:w-[54%] lg:justify-center lg:px-20 lg:pb-0"
            style={{ opacity: copyOpacity, y: copyY }}
          >
            <div className="flex items-center gap-4">
              <span className="font-ui text-sm font-semibold text-crimson">03</span>
              <span className="h-px w-16 bg-gradient-to-r from-crimson to-transparent" />
              <span className="label text-ash">Before the Nightmare</span>
            </div>

            <div className="relative mt-6 min-h-[7.5rem] lg:mt-10 lg:min-h-[12rem]">
              <AnimatePresence mode="wait">
                <motion.div key={chapter} exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }} transition={{ duration: 0.35 }}>
                  <p className="label mb-3 text-[0.6rem] text-ash">
                    Chapter · <span className="text-bone">{chapters[chapter].pov}</span>
                  </p>
                  <MaskLines
                    lines={chapters[chapter].title}
                    play
                    stagger={0.07}
                    className="font-display text-[clamp(2.2rem,5.4vw,5.4rem)] leading-[0.95] font-black text-bone"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={chapter}
                className="mt-4 max-w-md text-[0.95rem] leading-relaxed font-light text-bone/65 lg:mt-6"
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.15 }}
              >
                {chapters[chapter].body}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-4 lg:mt-12">
              <span className="font-ui text-xs text-bone tabular-nums">0{chapter + 1}</span>
              <div className="relative h-px w-40 bg-white/10">
                <motion.div className="absolute inset-0 origin-left bg-crimson" style={{ scaleX: progress }} />
              </div>
              <span className="font-ui text-xs text-ash tabular-nums">0{N}</span>
            </div>
          </motion.div>

          {/* finale */}
          <AnimatePresence>
            {finalShown && (
              <motion.div
                key="finale"
                className="absolute inset-0 z-20 flex flex-col items-center justify-end px-5 pb-[12vh] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <MaskLines
                  lines={finale.line}
                  play
                  className="font-display text-[clamp(2.8rem,8vw,8rem)] leading-[0.9] font-black text-bone [text-shadow:0_10px_60px_rgba(0,0,0,0.9)]"
                />
                <motion.p
                  className="mt-6 max-w-lg text-[0.95rem] leading-relaxed font-light text-bone/75"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.35 }}
                >
                  {finale.body}
                </motion.p>
                <motion.p
                  className="label mt-6 text-[0.55rem] text-ash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {book.full} · {book.author} · Illustrations {book.illustrator} · {book.publisher}, {book.year}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* allies */}
      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 py-24 sm:px-10 md:py-32 lg:grid-cols-[1fr_1.3fr] lg:px-20">
        <div>
          <p className="label text-crimson">Also in the story</p>
          <MaskLines lines={['THE CREW', 'BEHIND THE HUNT']} className="mt-5 font-display text-[clamp(2rem,4.4vw,4rem)] leading-[0.95] font-black text-bone" />
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed font-light text-bone/60">
            The novel bridges Devil May Cry 4 and 5 — and introduces the people who keep the hunters moving.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {allies.map((a, i) => (
            <motion.article
              key={a.id}
              className="group relative flex min-h-[320px] overflow-hidden bg-abyss"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, ease, delay: i * 0.1 }}
              data-cursor="View"
            >
              <div className="pointer-events-none absolute inset-0 z-10 border border-white/[0.07] transition-colors duration-500 group-hover:border-crimson/50" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(200,16,46,0.18),transparent_65%)]" />
              {!a.image && (
                <span className="pointer-events-none absolute -right-6 -top-10 font-display text-[16rem] leading-none font-black text-outline transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-4">
                  {a.name[0]}
                </span>
              )}
              {a.image && (
                <img
                  src={a.image}
                  alt={`${a.name} official render`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-full object-contain object-bottom mix-blend-lighten transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
                />
              )}
              <div className="relative z-10 mt-auto w-full bg-gradient-to-t from-void via-void/85 to-transparent p-6 pt-24">
                <p className="label text-[0.55rem] text-crimson">{a.role}</p>
                <h3 className="mt-2 font-display text-3xl font-black text-bone">{a.name.toUpperCase()}</h3>
                <p className="mt-3 text-sm leading-relaxed font-light text-bone/65">{a.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

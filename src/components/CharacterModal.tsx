import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { characters } from '../data/characters'
import { useBodyLock } from '../hooks/useBodyLock'
import { Corners } from './ui'
import { CharacterArt } from './CharacterArt'

interface Props {
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

const ease = [0.16, 1, 0.3, 1] as const
const cine = [0.76, 0, 0.24, 1] as const

export function CharacterModal({ index, onClose, onNavigate }: Props) {
  const c = characters[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  useBodyLock(true)

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus({ preventScroll: true })
    return () => prev?.focus?.({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(index + 1)
      if (e.key === 'ArrowLeft') onNavigate(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onClose, onNavigate])

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-void lg:overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`${c.name} profile`}
      initial={{ clipPath: 'inset(50% 0 50% 0)' }}
      animate={{ clipPath: 'inset(0% 0 0% 0)' }}
      exit={{ clipPath: 'inset(50% 0 50% 0)' }}
      transition={{ duration: 0.9, ease: cine }}
      data-no-slash
    >
      {/* opening light seam */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-1/2 z-10 h-px bg-crimson shadow-[0_0_30px_6px_rgba(200,16,46,0.7)]"
        initial={{ opacity: 1, scaleX: 0 }}
        animate={{ opacity: 0, scaleX: 1 }}
        transition={{ duration: 0.9, ease: cine }}
      />

      <AnimatePresence mode="wait">
        <motion.div key={c.id} className="relative grid min-h-full lg:h-full lg:grid-cols-[1.05fr_1fr]" initial="hidden" animate="show" exit="exit">
          {/* Art */}
          <div className="relative h-[58svh] overflow-hidden lg:h-full">
            <motion.div
              className="absolute inset-0"
              variants={{
                hidden: { scale: 1.3, opacity: 0, filter: 'blur(14px)' },
                show: { scale: 1.05, opacity: 1, filter: 'blur(0px)', transition: { duration: 1.6, ease } },
                exit: { opacity: 0, scale: 1.1, transition: { duration: 0.4 } },
              }}
            >
              <CharacterArt c={c} eager />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-void" />
            <motion.span
              className="pointer-events-none absolute -bottom-6 left-4 font-display text-[28vw] leading-none font-black text-white/[0.04] lg:text-[16vw]"
              variants={{ hidden: { x: -60, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 1.4, ease } }, exit: { opacity: 0 } }}
            >
              {c.numeral}
            </motion.span>
            <motion.span
              className="absolute left-5 top-24 text-2xl text-white/50 [writing-mode:vertical-rl] lg:left-10 lg:top-28 lg:text-3xl"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 1 } }, exit: { opacity: 0 } }}
            >
              {c.jp}
            </motion.span>
          </div>

          {/* Dossier */}
          <motion.div
            className="relative flex flex-col justify-center px-5 pb-28 pt-4 sm:px-10 lg:overflow-y-auto lg:px-16 lg:py-24 xl:px-24"
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } }, exit: { transition: { staggerChildren: 0.02 } } }}
          >
            <motion.p variants={rise} className="label flex items-center gap-3" style={{ color: c.accent }}>
              <span className="h-px w-10" style={{ background: c.accent }} />
              Dossier 0{index + 1} · {c.affiliation}
            </motion.p>
            <div className="mt-4 overflow-hidden">
              <motion.h2
                variants={{ hidden: { y: '100%' }, show: { y: '0%', transition: { duration: 1, ease } }, exit: { y: '-100%', transition: { duration: 0.4 } } }}
                className="font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.88] font-black text-bone"
              >
                {c.name.toUpperCase()}
              </motion.h2>
            </div>
            <motion.p variants={rise} className="mt-3 font-serif text-xl text-bone/70 italic md:text-2xl">
              {c.title}
            </motion.p>
            <motion.p variants={rise} className="mt-7 max-w-xl text-[0.95rem] leading-[1.8] font-light text-bone/70">
              {c.bio}
            </motion.p>

            {c.quote && (
              <motion.figure variants={rise} className="relative mt-8 max-w-xl border-l pl-5" style={{ borderColor: c.accent }}>
                <blockquote className="font-serif text-lg text-bone/90 italic">“{c.quote.text}”</blockquote>
                <figcaption className="label mt-2 text-[0.55rem] text-ash">— {c.name}, {c.quote.source}</figcaption>
              </motion.figure>
            )}

            <motion.dl variants={rise} className="relative mt-10 grid max-w-xl grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2">
              {[
                ['Weapon', c.weapon],
                ['Fighting style', c.style],
                ['Signature ability', c.signature],
                ['Affiliation', c.affiliation],
              ].map(([k, v]) => (
                <div key={k} className="relative bg-void p-4">
                  <dt className="label text-[0.55rem] text-ash">{k}</dt>
                  <dd className="mt-2 font-ui text-[0.95rem] leading-snug tracking-wide text-bone">{v}</dd>
                </div>
              ))}
              <Corners className="border-crimson/60" size="h-2 w-2" />
            </motion.dl>

            <motion.div variants={rise} className="mt-10 max-w-xl">
              <p className="label text-[0.55rem] text-ash">First appearance</p>
              <p className="mt-2 font-ui text-[0.95rem] tracking-wide text-bone">{c.debut}</p>
              <p className="label mt-6 text-[0.55rem] text-ash">Playable in</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.playable.map((g, i) => (
                  <motion.li
                    key={g}
                    className="border px-3 py-1.5 font-ui text-xs tracking-[0.2em] text-bone uppercase"
                    style={{ borderColor: `${c.accent}77`, boxShadow: `inset 0 0 14px -6px ${c.accent}` }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.8 + i * 0.06 }}
                  >
                    {g}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-10">
        <span className="label text-[0.6rem] text-ash">
          <span className="text-bone tabular-nums">0{index + 1}</span> / 0{characters.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          data-cursor="Close"
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-void/60 backdrop-blur transition-colors hover:border-crimson"
          aria-label="Close profile"
        >
          <X className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
        </button>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between bg-gradient-to-t from-void to-transparent px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-8 sm:px-10 lg:bg-none">
        {[-1, 1].map((dir) => {
          const n = characters[(index + dir + characters.length) % characters.length]
          return (
            <button
              key={dir}
              type="button"
              onClick={() => onNavigate(index + dir)}
              data-cursor={dir < 0 ? 'Prev' : 'Next'}
              className={`group flex items-center gap-3 font-ui text-xs tracking-[0.25em] text-ash uppercase transition-colors hover:text-bone ${dir > 0 ? 'flex-row-reverse' : ''}`}
            >
              <span className="flex h-10 w-10 items-center justify-center border border-white/15 transition-colors group-hover:border-crimson">
                {dir < 0 ? <ChevronLeft className="h-4 w-4" strokeWidth={1.5} /> : <ChevronRight className="h-4 w-4" strokeWidth={1.5} />}
              </span>
              {n.name}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

const rise = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
}

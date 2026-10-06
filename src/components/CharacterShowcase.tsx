import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { characters, type Character } from '../data/characters'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { sound } from '../lib/sound'
import { CharacterModal } from './CharacterModal'
import { SectionHeader } from './ui'
import { CharacterArt } from './CharacterArt'

const ease = [0.16, 1, 0.3, 1] as const

export function CharacterShowcase() {
  const isDesktop = useIsDesktop()
  const [openId, setOpenId] = useState<string | null>(null)
  const openIndex = characters.findIndex((c) => c.id === openId)

  return (
    <section id="characters" className="relative overflow-hidden bg-void py-24 md:py-36">
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-crimson/[0.06] blur-[120px]" />
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader index="01" kicker="The Hunters" kanji="デビルハンター" title={['THE', 'HUNTERS']}>
            Six souls who walk between worlds. Half-demons, a born weapon, a woman with nothing but nerve — and a poet whose days are numbered.
          </SectionHeader>
          <p className="label hidden max-w-[16rem] text-right text-[0.6rem] leading-loose text-ash/60 md:block">
            Hover to focus · Click to open dossier
            <br />
            Six profiles on file
          </p>
        </div>
      </div>

      <div className="mt-14 md:mt-20">
        {isDesktop ? <DesktopPanels onOpen={setOpenId} /> : <MobileRail onOpen={setOpenId} />}
      </div>

      {createPortal(
        <AnimatePresence>
          {openIndex >= 0 && (
            <CharacterModal
              key="modal"
              index={openIndex}
              onClose={() => setOpenId(null)}
              onNavigate={(i) => setOpenId(characters[(i + characters.length) % characters.length].id)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function DesktopPanels({ onOpen }: { onOpen: (id: string) => void }) {
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)

  return (
    <motion.div
      className="mx-auto flex h-[min(78vh,820px)] max-w-[1800px] gap-1.5 px-6"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2, ease }}
    >
      {characters.map((c, i) => (
        <Panel
          key={c.id}
          c={c}
          index={i}
          active={active === i}
          dimmed={hovering && active !== i}
          onFocus={() => {
            if (active !== i) sound.tick()
            setActive(i)
          }}
          onOpen={() => onOpen(c.id)}
        />
      ))}
    </motion.div>
  )
}

interface PanelProps {
  c: Character
  index: number
  active: boolean
  dimmed: boolean
  onFocus: () => void
  onOpen: () => void
}

function Panel({ c, index, active, dimmed, onFocus, onOpen }: PanelProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${c.name} — ${c.title}. Open profile`}
      data-cursor="View"
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
      className="group relative min-w-0 overflow-hidden bg-abyss outline-none transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ flexGrow: active ? 4.6 : 1, flexBasis: 0 }}
    >
      {/* artwork */}
      <CharacterArt
        c={c}
        className="transition-[transform,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: active ? 'scale(1.06)' : 'scale(1.25)',
          filter: dimmed ? 'brightness(0.32) saturate(0.2)' : active ? 'brightness(1)' : 'brightness(0.62) saturate(0.6)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />

      {/* red edge lighting */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: active ? 1 : 0,
          boxShadow: `inset 0 0 0 1px ${c.accent}88, inset 0 0 60px -20px ${c.accent}`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] transition-transform duration-700"
        style={{ background: `linear-gradient(to bottom, transparent, ${c.accent}, transparent)`, transform: active ? 'scaleY(1)' : 'scaleY(0)' }}
      />

      {/* collapsed label */}
      <div className={`absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-between py-8 transition-opacity duration-500 ${active ? 'opacity-0' : 'opacity-100'}`}>
        <span className="font-ui text-xs text-crimson tabular-nums">0{index + 1}</span>
        <span className="font-display text-2xl font-bold tracking-[0.25em] whitespace-nowrap text-bone/80 [writing-mode:vertical-rl] rotate-180">{c.name.toUpperCase()}</span>
        <span className="font-serif text-xs text-ash/60">{c.numeral}</span>
      </div>

      {/* expanded content */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="content"
            className="absolute inset-0 flex flex-col justify-end p-8 xl:p-12"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } }, hidden: {} }}
          >
            <div className="absolute right-8 top-8 flex flex-col items-end gap-1 text-right xl:right-12 xl:top-10">
              <motion.span variants={fade} className="text-3xl text-white/25">{c.jp}</motion.span>
              <motion.span variants={fade} className="label text-[0.55rem] text-ash/60">File 0{index + 1} / 06</motion.span>
            </div>

            <motion.p variants={rise} className="label mb-3 flex items-center gap-3" style={{ color: c.accent }}>
              <span className="h-px w-8" style={{ background: c.accent }} />
              {c.title}
            </motion.p>
            <div className="overflow-hidden">
              <motion.h3
                variants={{ hidden: { y: '100%' }, show: { y: '0%', transition: { duration: 0.9, ease } } }}
                className="font-display text-[clamp(3.5rem,6.4vw,7.5rem)] leading-[0.9] font-black text-bone"
              >
                {c.name.toUpperCase()}
              </motion.h3>
            </div>
            <motion.p variants={rise} className="mt-5 max-w-md text-[0.95rem] leading-relaxed font-light text-bone/70">
              {c.description}
            </motion.p>

            <motion.dl variants={rise} className="mt-8 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                ['Weapon', c.weapon],
                ['Fighting style', c.style],
                ['Signature', c.signature],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label text-[0.55rem] text-ash">{k}</dt>
                  <dd className="mt-2 font-ui text-sm leading-snug tracking-wide text-bone/90">{v}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.span variants={rise} className="label mt-8 inline-flex items-center gap-2 self-start text-bone/80 transition-colors group-hover:text-bone">
              Open dossier <ArrowUpRight className="h-3.5 w-3.5 text-crimson" />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const fade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } }
const rise = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
}

/* -------------------------------------------------------------------------- */

function MobileRail({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden">
      {characters.map((c, i) => (
        <motion.button
          key={c.id}
          type="button"
          onClick={() => onOpen(c.id)}
          className="relative h-[min(72svh,620px)] w-[80vw] max-w-[380px] shrink-0 snap-center overflow-hidden bg-abyss text-left"
          style={{ boxShadow: `inset 0 0 0 1px ${c.accent}44` }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: Math.min(i, 2) * 0.08 }}
          whileTap={{ scale: 0.98 }}
        >
          <CharacterArt c={c} />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[2px]" style={{ background: `linear-gradient(to bottom, transparent, ${c.accent}, transparent)` }} />
          <div className="absolute left-5 right-5 top-5 flex justify-between">
            <span className="font-ui text-xs text-crimson tabular-nums">0{i + 1}</span>
            <span className="text-xl text-white/30">{c.jp}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="label text-[0.6rem]" style={{ color: c.accent }}>
              {c.title}
            </p>
            <h3 className="mt-2 font-display text-5xl leading-none font-black text-bone">{c.name.toUpperCase()}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed font-light text-bone/70">{c.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-ui text-xs tracking-wide text-bone/80">{c.weapon.split(' · ')[0]}</span>
              <span className="label flex items-center gap-1 text-[0.6rem] text-bone">
                Dossier <ArrowUpRight className="h-3 w-3 text-crimson" />
              </span>
            </div>
          </div>
        </motion.button>
      ))}
      <div className="w-1 shrink-0" />
    </div>
  )
}

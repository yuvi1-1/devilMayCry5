import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navItems, sections } from '../data/nav'
import { useExperience } from '../context/Experience'
import { useActiveSection } from '../hooks/useActiveSection'
import { useBodyLock } from '../hooks/useBodyLock'
import { sound } from '../lib/sound'
import { Emblem } from './Emblem'
import { SoundToggle } from './SoundToggle'

const ease = [0.76, 0, 0.24, 1] as const
const sectionIds = sections.map((s) => s.id)
// Map secondary sections onto the nav item they live under
const navParent: Record<string, string> = { 'style-rank': 'characters', 'bloody-palace': 'media', gallery: 'media' }

export function Navbar() {
  const { ready, go } = useExperience()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const activeSection = useActiveSection(sectionIds)
  const active = navParent[activeSection] ?? activeSection
  useBodyLock(open)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > window.innerHeight * 0.9 && y > prev + 2)
  })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const navigate = (id: string) => {
    setOpen(false)
    go(id)
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 md:px-6 md:pt-5"
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: hidden && !open ? -110 : 0, opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease, delay: ready && !scrolled ? 2.6 : 0 }}
      >
        <nav
          className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-[2px] px-4 py-3 transition-[background-color,box-shadow,backdrop-filter] duration-700 md:px-6 ${
            scrolled
              ? 'bg-abyss/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl'
              : 'bg-white/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-[2px]'
          }`}
          aria-label="Main"
        >
          <button type="button" onClick={() => navigate('home')} data-cursor="Home" className="group flex items-center gap-3" aria-label="Devil May Cry — home">
            <Emblem className="h-7 w-7 transition-transform duration-700 group-hover:rotate-180" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[0.8rem] font-bold tracking-[0.32em] text-bone">DEVIL MAY CRY</span>
              <span className="label mt-1 text-[0.5rem] text-ash/70">Fan concept · Est. Red Grave</span>
            </span>
          </button>

          <ul className="hidden items-center gap-0 xl:flex">
            {navItems.map((item, i) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => navigate(item.id)}
                    onMouseEnter={() => sound.tick()}
                    data-cursor="Go"
                    className={`group relative px-3 py-2 font-ui text-[0.7rem] 2xl:px-4 font-medium tracking-[0.26em] uppercase transition-all duration-500 hover:tracking-[0.34em] hover:text-bone hover:[text-shadow:0_0_14px_rgba(200,16,46,0.9)] ${
                      isActive ? 'text-bone' : 'text-ash'
                    }`}
                  >
                    <span className="mr-2 text-[0.55rem] text-crimson/80 tabular-nums">0{i + 1}</span>
                    {item.label}
                    <span
                      className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-crimson transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-5">
            <SoundToggle className="hidden sm:flex" />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center text-bone xl:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              data-cursor="Open"
            >
              {open ? <X className="h-5 w-5" strokeWidth={1.4} /> : <Menu className="h-5 w-5" strokeWidth={1.4} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[79] flex flex-col overflow-y-auto bg-void xl:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 36px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(200,16,46,0.22),transparent_55%)]" />
            <div className="pointer-events-none absolute -right-10 bottom-10 font-display text-[40vw] leading-none font-black text-white/[0.025]">DMC</div>
            <ul className="relative mt-28 flex flex-1 flex-col justify-center gap-1 px-6">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(item.id)}
                    className="group flex w-full items-baseline gap-4 border-b border-white/[0.06] py-4 text-left"
                  >
                    <span className="w-6 font-ui text-xs text-crimson tabular-nums">0{i + 1}</span>
                    <span className={`font-display text-[clamp(2rem,9vw,3.4rem)] leading-none font-bold tracking-wide ${active === item.id ? 'text-bone' : 'text-bone/60'}`}>
                      {item.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="relative flex items-center justify-between px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <SoundToggle />
              <span className="label text-[0.55rem] text-ash/60">Devils never cry</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUp, AtSign, MessageSquareText, Play } from 'lucide-react'
import { navItems } from '../data/nav'
import { useExperience } from '../context/Experience'
import { Emblem } from './Emblem'
import { ParticleBackground } from './ParticleBackground'
import { SoundToggle } from './SoundToggle'

const ease = [0.16, 1, 0.3, 1] as const
const socials = [
  { label: 'Trailers', icon: Play, href: 'https://www.youtube.com/results?search_query=devil+may+cry+trailer' },
  { label: 'Community', icon: MessageSquareText, href: 'https://www.reddit.com/r/DevilMayCry/' },
  { label: 'Social', icon: AtSign, href: 'https://x.com/search?q=%23DevilMayCry' },
]

export function Footer() {
  const { go } = useExperience()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })

  return (
    <footer className="relative overflow-hidden bg-void pt-28 md:pt-40">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[60vh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(200,16,46,0.22),transparent_60%)]" />
      <ParticleBackground density={0.35} max={40} interactive={false} />

      <div ref={ref} className="relative mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-20">
        <motion.p
          className="label mb-8 text-center text-ash"
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={inView ? { opacity: 1, letterSpacing: '0.6em' } : undefined}
          transition={{ duration: 1.6, ease }}
        >
          Fin
        </motion.p>
        <h2 className="text-center font-display text-[clamp(3.4rem,13vw,14rem)] leading-[0.85] font-black tracking-[-0.02em]">
          {['DEVILS', 'NEVER', 'CRY.'].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className={`block ${i === 1 ? 'text-outline' : i === 2 ? 'text-blood' : 'text-metal'}`}
                initial={{ y: '105%', filter: 'blur(10px)' }}
                animate={inView ? { y: '0%', filter: 'blur(0px)' } : undefined}
                transition={{ duration: 1.4, ease, delay: 0.15 + i * 0.14 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.div
          className="mx-auto mt-10 h-px w-full max-w-3xl origin-center bg-gradient-to-r from-transparent via-crimson to-transparent"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.6, ease, delay: 0.7 }}
        />
        <motion.p
          className="mt-6 text-center font-serif text-lg text-bone/60 italic"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1 }}
        >
          See you in the next mission.
        </motion.p>
      </div>

      {/* credits row */}
      <div className="relative mx-auto mt-24 max-w-[1600px] border-t border-white/[0.06] px-5 py-10 sm:px-10 md:mt-32 lg:px-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_auto] md:items-start">
          <div className="flex items-start gap-4">
            <Emblem className="h-10 w-10 shrink-0" />
            <div>
              <p className="font-display text-lg font-bold tracking-[0.3em] text-bone">DEVIL MAY CRY</p>
              <p className="label mt-2 text-[0.6rem] text-ash">© Fan-made concept · {new Date().getFullYear()}</p>
              <p className="mt-4 max-w-sm text-xs leading-relaxed font-light text-ash/70">
                An unofficial, non-commercial tribute. Not affiliated with or endorsed by CAPCOM. Devil May Cry and all related names are trademarks of their respective owners. Official artwork © CAPCOM, used here for non-commercial fan purposes only.
              </p>
            </div>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {navItems.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => go(n.id)} data-cursor="Go" className="group flex items-center gap-2 font-ui text-xs tracking-[0.28em] text-ash uppercase transition-colors hover:text-bone">
                    <span className="h-px w-3 bg-ash/40 transition-all group-hover:w-5 group-hover:bg-crimson" />
                    {n.label}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => go('bloody-palace')} data-cursor="Go" className="group flex items-center gap-2 font-ui text-xs tracking-[0.28em] text-ash uppercase transition-colors hover:text-bone">
                  <span className="h-px w-3 bg-ash/40 transition-all group-hover:w-5 group-hover:bg-crimson" />
                  Bloody Palace
                </button>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-6 md:items-end">
            <div className="flex gap-2">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-cursor="Open"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 text-ash transition-all duration-500 hover:border-crimson hover:text-bone hover:shadow-[0_0_20px_-4px_rgba(200,16,46,0.8)]"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
            <SoundToggle />
            <button type="button" onClick={() => go('home', true)} data-cursor="Top" className="label flex items-center gap-2 text-[0.6rem] text-ash hover:text-bone">
              Back to the beginning <ArrowUp className="h-3 w-3 text-crimson" />
            </button>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.04] pt-6 sm:flex-row">
          <p className="label text-[0.5rem] text-ash/50">Red Grave City · デビル メイ クライ</p>
          <p className="label flicker text-[0.5rem] text-crimson/80">To be continued</p>
        </div>
      </div>
    </footer>
  )
}

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { sections } from '../data/nav'
import { useActiveSection } from '../hooks/useActiveSection'
import { useExperience } from '../context/Experience'

const ids = sections.map((s) => s.id)

/** Thin top progress line + desktop chapter indicator on the right edge. */
export function ScrollHUD() {
  const { ready, go } = useExperience()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const active = useActiveSection(ids)
  const idx = Math.max(0, ids.indexOf(active))

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-[85] h-[2px] origin-left bg-crimson shadow-[0_0_10px_rgba(200,16,46,0.8)]" style={{ scaleX }} />
      <motion.aside
        className="fixed right-5 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end gap-3 2xl:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready && idx > 0 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        aria-label="Section progress"
      >
        <div className="flex items-baseline gap-1 font-ui tabular-nums">
          <span className="relative h-5 overflow-hidden text-sm font-semibold text-bone">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={idx}
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              >
                {String(idx + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-[0.6rem] text-ash">/ {String(ids.length).padStart(2, '0')}</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          {sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              data-cursor="Go"
              aria-label={s.label}
              className="group flex items-center gap-3"
            >
              <span className="label text-[0.5rem] text-ash opacity-0 transition-opacity duration-300 group-hover:opacity-100">{s.label}</span>
              <span className={`block h-px transition-all duration-500 ${i === idx ? 'w-8 bg-crimson' : 'w-3 bg-ash/40 group-hover:w-5 group-hover:bg-bone'}`} />
            </button>
          ))}
        </div>
      </motion.aside>
    </>
  )
}

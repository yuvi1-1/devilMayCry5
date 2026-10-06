import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useHasMouse } from '../hooks/useMediaQuery'

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor]'

/** Dot + lagging ring. Ring expands over interactive elements and shows a label. */
export function CustomCursor() {
  const hasMouse = useHasMouse()
  if (!hasMouse) return null
  return <CursorImpl />
}

function CursorImpl() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 })
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null
      setHover(!!el)
      setLabel(el?.dataset.cursor ?? '')
    }
    const leave = () => setVisible(false)
    const pd = () => setDown(true)
    const pu = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', pd)
    window.addEventListener('pointerup', pu)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', pd)
      window.removeEventListener('pointerup', pu)
    }
  }, [x, y])

  const size = hover ? (label ? 74 : 46) : 30

  return (
    <div className="pointer-events-none fixed inset-0 z-[120]" aria-hidden style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s' }}>
      <motion.div className="fixed left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
          animate={{
            width: size,
            height: size,
            scale: down ? 0.82 : 1,
            borderColor: hover ? 'rgba(200,16,46,0.9)' : 'rgba(236,232,225,0.28)',
            backgroundColor: hover ? 'rgba(200,16,46,0.12)' : 'rgba(0,0,0,0)',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <AnimatePresence>
            {hover && label && (
              <motion.span
                key={label}
                className="font-ui text-[0.55rem] font-semibold tracking-[0.25em] text-bone uppercase"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div className="fixed left-0 top-0" style={{ x, y }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson shadow-[0_0_10px_rgba(200,16,46,0.9)]"
          animate={{ width: hover ? 4 : 6, height: hover ? 4 : 6, backgroundColor: hover ? '#ece8e1' : '#c8102e' }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  )
}

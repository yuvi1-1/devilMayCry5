import { useEffect, useRef } from 'react'
import { useAnimate } from 'framer-motion'

interface Props {
  trigger: number
  onCovered: () => void
}

/** Black clip-path wipe with a red light streak riding the leading edge. */
export function TransitionOverlay({ trigger, onCovered }: Props) {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const running = useRef(false)
  const cb = useRef(onCovered)
  cb.current = onCovered

  useEffect(() => {
    if (!trigger || running.current) return
    running.current = true
    const ease = [0.76, 0, 0.24, 1] as const
    const run = async () => {
      const root = scope.current
      root.style.visibility = 'visible'
      await Promise.all([
        animate('.wipe-panel', { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }, { duration: 0.6, ease }),
        animate('.wipe-streak', { left: ['0%', '100%'], opacity: [1, 1] }, { duration: 0.6, ease }),
        animate('.wipe-text', { opacity: [0, 1], letterSpacing: ['0.2em', '0.6em'] }, { duration: 0.8, delay: 0.25 }),
      ])
      cb.current()
      await new Promise((r) => setTimeout(r, 260))
      await Promise.all([
        animate('.wipe-panel', { clipPath: ['inset(0 0 0 0%)', 'inset(0 0 0 100%)'] }, { duration: 0.7, ease }),
        animate('.wipe-streak', { left: ['0%', '100%'] }, { duration: 0.7, ease }),
        animate('.wipe-text', { opacity: 0 }, { duration: 0.25 }),
      ])
      root.style.visibility = 'hidden'
      running.current = false
    }
    void run()
  }, [trigger, animate, scope])

  return (
    <div ref={scope} className="pointer-events-none fixed inset-0 z-[95]" style={{ visibility: 'hidden' }} aria-hidden>
      <div className="wipe-panel absolute inset-0 bg-void" style={{ clipPath: 'inset(0 100% 0 0)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,16,46,0.18),transparent_60%)]" />
        <div className="wipe-text label absolute inset-0 flex items-center justify-center text-bone/70 opacity-0">
          Entering the night
        </div>
      </div>
      <div className="wipe-streak absolute top-0 h-full w-[3px] -translate-x-1/2 bg-crimson shadow-[0_0_30px_8px_rgba(200,16,46,0.7),0_0_80px_20px_rgba(200,16,46,0.35)]" />
    </div>
  )
}

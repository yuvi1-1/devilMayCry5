import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Phase = 'boot' | 'loading' | 'title'

interface Props {
  onDone: () => void
}

const ease = [0.76, 0, 0.24, 1] as const

export function Loader({ onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('boot')
  const [progress, setProgress] = useState(0)

  // Simulated progress that also waits for fonts + window load
  useEffect(() => {
    let raf = 0
    let assetsReady = false
    let done = false
    const start = performance.now()
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }))
    void Promise.all([fonts, loaded]).then(() => (assetsReady = true))
    const fallback = window.setTimeout(() => (assetsReady = true), 5000)

    const bootT = window.setTimeout(() => setPhase('loading'), 700)
    const tick = (now: number) => {
      const t = Math.max(0, now - start - 700) / 2000
      const eased = 1 - Math.pow(1 - Math.min(t, 1), 3)
      const p = Math.min(assetsReady ? eased : Math.min(eased, 0.92), 1)
      setProgress(p)
      if (p >= 1 && !done) {
        done = true
        setPhase('title')
        window.setTimeout(onDone, 1500)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(bootT)
      clearTimeout(fallback)
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 1.1, ease }}
      onClick={onDone}
      data-cursor="Skip"
      role="status"
      aria-label="Loading"
    >
      {/* corners */}
      <div className="label absolute left-5 top-5 text-[0.6rem] text-ash md:left-10 md:top-8">
        <span className="blink mr-2 inline-block h-1.5 w-1.5 rounded-full bg-crimson align-middle" />
        Signal · Unstable
      </div>
      <div className="label absolute right-5 top-5 text-[0.6rem] text-ash md:right-10 md:top-8">デビル メイ クライ</div>
      <div className="label absolute bottom-5 left-5 text-[0.6rem] text-ash/70 md:bottom-8 md:left-10">Fan-made concept</div>
      <div className="label absolute bottom-5 right-5 font-mono text-[0.6rem] tabular-nums text-ash/70 md:bottom-8 md:right-10">
        {String(Math.round(progress * 100)).padStart(3, '0')}%
      </div>

      <AnimatePresence mode="wait">
        {phase !== 'title' ? (
          <motion.div
            key="loading"
            className="flex w-[min(78vw,420px)] flex-col items-center"
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              className="label text-bone/80"
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.55em' }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            >
              Red Grave City
            </motion.p>
            <motion.p
              className="label mt-4 text-[0.6rem] text-ash"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'loading' ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="flicker">Loading hell</span>
              <span className="blink">...</span>
            </motion.p>
            <div className="relative mt-6 h-px w-full overflow-hidden bg-white/10">
              <div
                className="absolute inset-y-0 left-0 w-full origin-left bg-crimson shadow-[0_0_12px_rgba(200,16,46,0.9)]"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="title" className="relative text-center">
            <motion.div
              className="absolute left-1/2 top-1/2 h-[2px] w-[140vw] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-crimson to-transparent"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <motion.h1
              className="text-metal font-display text-[clamp(2.4rem,9vw,7rem)] leading-none font-black tracking-[0.12em]"
              initial={{ opacity: 0, filter: 'blur(16px)', scale: 1.15, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, letterSpacing: '0.12em' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              DEVIL MAY CRY
            </motion.h1>
            <motion.p
              className="label mt-4 text-crimson"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Devils never cry
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

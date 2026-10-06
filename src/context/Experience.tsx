import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { sound } from '../lib/sound'
import { scrollToId } from '../lib/scroll'
import { TransitionOverlay } from '../components/TransitionOverlay'

interface ExperienceValue {
  ready: boolean
  setReady: (v: boolean) => void
  soundOn: boolean
  toggleSound: () => void
  /** Navigate to a section. `cinematic` plays the black-wipe transition. */
  go: (id: string, cinematic?: boolean) => void
}

const Ctx = createContext<ExperienceValue | null>(null)

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [wipe, setWipe] = useState(0)
  const pending = useRef<string | null>(null)

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      void sound.setEnabled(!on)
      return !on
    })
  }, [])

  const go = useCallback((id: string, cinematic = false) => {
    if (!cinematic || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scrollToId(id)
      return
    }
    pending.current = id
    sound.slash()
    setWipe((n) => n + 1)
  }, [])

  const onCovered = useCallback(() => {
    if (pending.current) scrollToId(pending.current, true)
    pending.current = null
  }, [])

  const value = useMemo(() => ({ ready, setReady, soundOn, toggleSound, go }), [ready, soundOn, toggleSound, go])

  return (
    <Ctx.Provider value={value}>
      {children}
      <TransitionOverlay trigger={wipe} onCovered={onCovered} />
    </Ctx.Provider>
  )
}

export function useExperience() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useExperience must be used inside ExperienceProvider')
  return v
}

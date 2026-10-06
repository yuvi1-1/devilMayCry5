import { useEffect } from 'react'

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.classList.add('is-locked')
    document.body.style.paddingRight = gap ? `${gap}px` : ''
    return () => {
      document.body.classList.remove('is-locked')
      document.body.style.paddingRight = ''
    }
  }, [locked])
}

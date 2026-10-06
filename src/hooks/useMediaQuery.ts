import { useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Fine pointer + hover — real mouse. */
export const useHasMouse = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

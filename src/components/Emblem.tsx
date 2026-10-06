/** Original minimalist emblem — a blade through a diamond. Not an official logo. */
export function Emblem({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 4 L54 32 L32 60 L10 32Z" fill="none" stroke="#c8102e" strokeWidth="2.5" />
      <path d="M32 10 L35 18 L35 46 L32 56 L29 46 L29 18Z" fill="#e7e7ea" />
      <path d="M20 20 Q32 26 44 20 L40 24 L24 24Z" fill="#e7e7ea" />
      <circle cx="32" cy="32" r="3" fill="#c8102e" />
    </svg>
  )
}

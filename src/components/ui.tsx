import { motion, useInView, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

/* -------------------------------------------------------------------------- */
/* Masked line reveal — text rises out of a clipping mask                      */
/* -------------------------------------------------------------------------- */
interface MaskLinesProps {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** animate when this is true; defaults to in-view */
  play?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}

export function MaskLines({ lines, className = '', lineClassName = '', delay = 0, stagger = 0.09, play, as = 'h2' }: MaskLinesProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const show = play ?? inView
  const Tag = motion[as]
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={{ y: '110%', rotate: 2 }}
            animate={show ? { y: '0%', rotate: 0 } : undefined}
            transition={{ duration: 1.1, ease, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/* Section header                                                              */
/* -------------------------------------------------------------------------- */
interface SectionHeaderProps {
  index: string
  kicker: string
  title: ReactNode[]
  kanji?: string
  children?: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function SectionHeader({ index, kicker, title, kanji, children, align = 'left', className = '' }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const right = align === 'right'
  return (
    <div ref={ref} className={`relative ${right ? 'text-right' : ''} ${className}`}>
      <div className={`flex items-center gap-4 ${right ? 'justify-end' : ''}`}>
        <span className="overflow-hidden font-ui text-sm font-semibold tabular-nums text-crimson">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 0.8, ease }}
          >
            {index}
          </motion.span>
        </span>
        <motion.span
          className="h-px w-16 origin-left bg-gradient-to-r from-crimson to-transparent md:w-24"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
        />
        <motion.span
          className="label text-ash"
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          animate={inView ? { opacity: 1, letterSpacing: '0.32em' } : undefined}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
        >
          {kicker}
        </motion.span>
        {kanji && (
          <motion.span
            className="hidden font-serif text-sm text-ash/50 md:inline"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            {kanji}
          </motion.span>
        )}
      </div>
      <MaskLines
        lines={title}
        play={inView}
        delay={0.1}
        className="mt-6 font-display text-[clamp(2.6rem,7.4vw,7.5rem)] leading-[0.92] font-black tracking-[-0.01em] text-bone"
      />
      {children && (
        <motion.div
          className={`mt-6 max-w-md font-sans text-[0.95rem] leading-relaxed font-light text-bone/60 ${right ? 'ml-auto' : ''}`}
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
          transition={{ duration: 1, ease, delay: 0.45 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                     */
/* -------------------------------------------------------------------------- */
type BtnProps = HTMLMotionProps<'button'> & { children: ReactNode; cursor?: string }

export function PrimaryButton({ children, className = '', cursor = 'Enter', ...rest }: BtnProps) {
  return (
    <motion.button
      type="button"
      data-cursor={cursor}
      whileTap={{ scale: 0.97 }}
      className={`group sheen clip-blade relative inline-flex items-center gap-4 overflow-hidden bg-crimson/10 px-7 py-4 font-ui text-sm font-semibold tracking-[0.3em] text-bone uppercase ring-1 ring-crimson/70 ring-inset transition-[letter-spacing,box-shadow] duration-500 hover:tracking-[0.36em] hover:shadow-[0_0_40px_-6px_rgba(200,16,46,0.8)] md:px-9 md:py-5 ${className}`}
      {...rest}
    >
      <span className="absolute inset-0 origin-left scale-x-0 bg-crimson transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100" />
      <span className="relative">{children}</span>
      <ArrowRight className="relative h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
    </motion.button>
  )
}

export function GhostButton({ children, className = '', cursor = 'View', ...rest }: BtnProps) {
  return (
    <motion.button
      type="button"
      data-cursor={cursor}
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex items-center gap-3 py-3 font-ui text-sm font-medium tracking-[0.3em] text-bone/80 uppercase transition-[color,letter-spacing] duration-500 hover:tracking-[0.36em] hover:text-bone ${className}`}
      {...rest}
    >
      <span className="h-px w-8 bg-bone/40 transition-all duration-500 group-hover:w-12 group-hover:bg-crimson" />
      {children}
    </motion.button>
  )
}

/* -------------------------------------------------------------------------- */
/* Corner brackets — weapon-inspired frame detail                              */
/* -------------------------------------------------------------------------- */
export function Corners({ className = 'border-bone/30', size = 'h-3 w-3' }: { className?: string; size?: string }) {
  const base = `pointer-events-none absolute ${size} ${className}`
  return (
    <>
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </>
  )
}

export function StatusDot({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-1.5 w-1.5 ${className}`}>
      <span className="absolute inset-0 animate-ping rounded-full bg-crimson/70" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-crimson" />
    </span>
  )
}

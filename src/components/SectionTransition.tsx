import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface Props {
  chapter: string
  title: string
  phrase?: string
}

/**
 * Cinematic divider between sections: a red light streak sweeps across as it
 * enters view while a giant outlined phrase drifts with scroll.
 */
export function SectionTransition({ chapter, title, phrase = 'Devils never cry · デビル メイ クライ · ' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-35%'])

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-white/[0.04] bg-abyss py-14 md:py-20" aria-hidden>
      <motion.div className="whitespace-nowrap font-display text-[clamp(3rem,10vw,9rem)] leading-none font-black text-outline" style={{ x }}>
        {phrase.repeat(4)}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-4 bg-abyss/80 px-5 py-2 backdrop-blur-sm">
          <span className="label text-crimson">{chapter}</span>
          <span className="h-px w-8 bg-ash/40" />
          <span className="label text-bone/80">{title}</span>
        </div>
      </div>
      <motion.div
        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-crimson/40 to-transparent mix-blend-screen"
        initial={{ x: '-100%' }}
        animate={inView ? { x: '400%' } : undefined}
        transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute left-0 top-1/2 h-px w-full origin-left bg-gradient-to-r from-transparent via-crimson to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: [0, 1, 0.25] } : undefined}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

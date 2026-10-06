import { useRef } from 'react'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'
import { lore, type LoreEntry } from '../data/lore'
import { SectionHeader } from './ui'

const ease = [0.16, 1, 0.3, 1] as const
const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

export function LoreTimeline() {
  const line = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: line, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26 })

  return (
    <section id="universe" className="relative overflow-hidden bg-abyss py-24 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-crimson/[0.05] blur-[160px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-3xl text-left md:text-center">
          <SectionHeader index="06" kicker="The Universe" title={['A WAR OF', 'TWO WORLDS']} className="md:[&>div:first-child]:justify-center md:[&>div:last-child]:mx-auto">
            Two thousand years of blood, betrayal and borrowed time. Descend through the history that made the hunters.
          </SectionHeader>
        </div>

        <div ref={line} className="relative mt-20 md:mt-28">
          {/* spine */}
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/[0.08] md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-crimson via-crimson to-crimson/0 shadow-[0_0_12px_rgba(200,16,46,0.9)] md:left-1/2 md:-translate-x-1/2"
            style={{ scaleY: fill }}
          />

          <ol className="relative flex flex-col gap-16 md:gap-24">
            {lore.map((entry, i) => (
              <TimelineItem key={entry.id} entry={entry} index={i} />
            ))}
          </ol>

          <motion.div
            className="relative mt-20 flex flex-col items-start pl-10 md:items-center md:pl-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          >
            <span className="absolute left-[7px] top-1 h-[9px] w-[9px] rotate-45 bg-crimson shadow-[0_0_14px_rgba(200,16,46,1)] md:static md:mb-6" />
            <p className="font-serif text-2xl text-bone/80 italic md:text-3xl">…and the story is still being written.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ entry, index }: { entry: LoreEntry; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })
  const right = index % 2 === 1

  return (
    <li ref={ref} className="relative grid pl-10 md:grid-cols-2 md:gap-20 md:pl-0">
      {/* node */}
      <motion.span
        className="absolute left-[5px] top-2 flex h-[13px] w-[13px] items-center justify-center md:left-1/2 md:-translate-x-1/2"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <span className="absolute h-full w-full rotate-45 border border-crimson bg-abyss" />
        <span className="relative h-[5px] w-[5px] rotate-45 bg-crimson shadow-[0_0_10px_rgba(200,16,46,1)]" />
      </motion.span>

      {/* era — on the opposite side on desktop */}
      <div className={`hidden md:block ${right ? 'md:order-1 md:pl-4' : 'md:order-2 md:pl-4'} ${right ? 'md:text-left' : ''}`}>
        <motion.div
          className={`sticky top-1/3 ${right ? '' : 'text-left'}`}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <span className={`block font-display text-[7rem] leading-none font-black text-outline ${right ? 'text-right pr-4' : ''}`}>{roman[index]}</span>
        </motion.div>
      </div>

      <div className={`${right ? 'md:order-2' : 'md:order-1 md:text-right'}`}>
        <motion.p
          className="label text-[0.62rem] text-crimson"
          initial={{ opacity: 0, x: right ? 20 : -20 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.8, ease }}
        >
          {entry.era}
        </motion.p>
        <div className="mt-3 overflow-hidden">
          <motion.h3
            className="font-display text-[clamp(2rem,4.4vw,3.8rem)] leading-[0.95] font-black text-bone"
            initial={{ y: '100%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 1, ease, delay: 0.1 }}
          >
            {entry.title}
          </motion.h3>
        </div>
        <motion.p
          className="mt-2 font-serif text-lg text-ash italic"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {entry.source}
        </motion.p>
        <motion.p
          className={`mt-5 max-w-md text-[0.95rem] leading-[1.8] font-light text-bone/65 ${right ? '' : 'md:ml-auto'}`}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)', clipPath: right ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)', clipPath: 'inset(0 0% 0 0%)' } : undefined}
          transition={{ duration: 1.2, ease, delay: 0.25 }}
        >
          {entry.body}
        </motion.p>
      </div>
    </li>
  )
}

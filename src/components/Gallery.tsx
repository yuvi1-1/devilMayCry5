import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { gallery, type GalleryItem, type GalleryKind } from '../data/gallery'
import { useBodyLock } from '../hooks/useBodyLock'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { sound } from '../lib/sound'
import { SectionHeader } from './ui'

const ease = [0.16, 1, 0.3, 1] as const

/** Frame shape per kind — every piece sits in a fixed frame so the wall lines up while it animates. */
const ratio: Record<GalleryKind, number> = { scene: 10 / 16, poster: 4 / 3, print: 4 / 3, render: 4 / 3 }

/** Greedy layout: each piece goes to the currently shortest column so the columns end level. */
function layout(cols: number) {
  const columns: { item: GalleryItem; index: number }[][] = Array.from({ length: cols }, () => [])
  const heights = Array(cols).fill(0)
  gallery.forEach((item, index) => {
    const c = heights.indexOf(Math.min(...heights))
    columns[c].push({ item, index })
    heights[c] += ratio[item.kind] + 0.04
  })
  return columns
}

function Frame({ item, index, onOpen }: { item: GalleryItem; index: number; onOpen: () => void }) {
  const print = item.kind === 'print'
  const render = item.kind === 'render'
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      data-cursor="View"
      className="group relative block w-full overflow-hidden bg-abyss text-left"
      style={{ aspectRatio: `1 / ${ratio[item.kind]}` }}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* backdrop for mounted prints and cut-out renders */}
      {(print || render) && (
        <div className={`absolute inset-0 ${print ? 'bg-crypt' : 'bg-[radial-gradient(ellipse_at_50%_45%,rgba(200,16,46,0.28),transparent_65%)]'}`} />
      )}
      <motion.img
        src={item.src}
        alt={`${item.title} — ${item.caption}`}
        loading="lazy"
        decoding="async"
        className={`absolute h-full w-full transition-[filter] duration-700 ${
          print
            ? 'inset-0 object-contain p-5 brightness-[0.88] drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] group-hover:brightness-100 md:p-7'
            : render
              ? 'inset-0 object-contain p-4 drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]'
              : `inset-0 object-cover ${item.kind === 'poster' ? 'object-top' : 'object-center'} brightness-[0.92] group-hover:brightness-105`
        }`}
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        whileHover={{ scale: print || render ? 1.03 : 1.07 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.6, ease }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 border border-white/[0.06] transition-colors duration-500 group-hover:border-crimson/60" />
      <span className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-crimson transition-[width] duration-700 group-hover:w-full" />
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <p className="label translate-y-2 text-[0.5rem] text-crimson opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">{item.caption}</p>
        <p className="mt-1 hidden font-display text-lg font-bold text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block">{item.title}</p>
      </div>
      <span className="absolute right-3 top-3 font-ui text-[0.6rem] text-bone/50 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
    </motion.button>
  )
}

/** Poster wall: columns drift gently at different speeds; click opens a full-screen viewer. */
export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktop()
  const [open, setOpen] = useState<number | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y0 = useTransform(scrollYProgress, [0, 1], [30, -30])
  const y1 = useTransform(scrollYProgress, [0, 1], [70, -70])
  const y2 = useTransform(scrollYProgress, [0, 1], [10, -10])
  const columns = useMemo(() => layout(isDesktop ? 3 : 2), [isDesktop])

  if (gallery.length === 0) return null
  const speeds: MotionValue<number>[] = [y0, y1, y2]

  return (
    <section id="gallery" ref={ref} className="relative overflow-hidden bg-void py-24 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-crimson/[0.06] blur-[160px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader index="08" kicker="Artwork" title={['THE', 'GALLERY']}>
            Key art, screenshots, illustrations and concept art. Select any piece to view it full screen.
          </SectionHeader>
          <p className="label text-[0.6rem] text-ash/70">{String(gallery.length).padStart(2, '0')} pieces on display</p>
        </div>

        <div className="mt-16 grid gap-3 md:mt-20 md:gap-5" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map((col, c) => (
            <motion.div key={c} className="flex flex-col gap-3 md:gap-5" style={isDesktop ? { y: speeds[c] } : undefined}>
              {col.map(({ item, index }) => (
                <Frame
                  key={index}
                  item={item}
                  index={index}
                  onOpen={() => {
                    sound.tick()
                    setOpen(index)
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>{open !== null && <Lightbox key="lb" index={open} onClose={() => setOpen(null)} onGo={(i) => setOpen((i + gallery.length) % gallery.length)} />}</AnimatePresence>,
        document.body,
      )}
    </section>
  )
}

function Lightbox({ index, onClose, onGo }: { index: number; onClose: () => void; onGo: (i: number) => void }) {
  const item = gallery[index]
  const touchX = useRef<number | null>(null)
  useBodyLock(true)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onGo(index + 1)
      if (e.key === 'ArrowLeft') onGo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onClose, onGo])

  return (
    <motion.div
      className="fixed inset-0 z-[96] flex flex-col bg-void/[0.97] backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      data-no-slash
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) onGo(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-10">
        <span className="label text-[0.6rem] text-ash">
          <span className="text-bone tabular-nums">{String(index + 1).padStart(2, '0')}</span> / {String(gallery.length).padStart(2, '0')}
        </span>
        <button type="button" onClick={onClose} aria-label="Close" data-cursor="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:border-crimson">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-24" onClick={onClose}>
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={item.src}
            alt={`${item.title} — ${item.caption}`}
            className="max-h-full max-w-full object-contain shadow-[0_0_80px_-20px_rgba(200,16,46,0.6)]"
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            aria-label={d < 0 ? 'Previous' : 'Next'}
            data-cursor={d < 0 ? 'Prev' : 'Next'}
            onClick={(e) => {
              e.stopPropagation()
              onGo(index + d)
            }}
            className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/15 bg-void/60 hover:border-crimson ${d < 0 ? 'left-2 sm:left-6' : 'right-2 sm:right-6'}`}
          >
            {d < 0 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ))}
      </div>
      <div className="px-5 py-5 text-center sm:px-10">
        <p className="label text-[0.55rem] text-crimson">{item.caption}</p>
        <p className="mt-1 font-display text-2xl font-bold text-bone">{item.title}</p>
      </div>
    </motion.div>
  )
}

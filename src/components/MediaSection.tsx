import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Play, X } from 'lucide-react'
import { embedUrl, thumb, videos, watchUrl, type Video } from '../data/media'
import { asset } from '../lib/asset'
import { useBodyLock } from '../hooks/useBodyLock'
import { sound } from '../lib/sound'
import { SectionHeader } from './ui'

const ease = [0.16, 1, 0.3, 1] as const

/** YouTube poster frame with graceful fallbacks (maxres → hq → placeholder scene). */
function Poster({ id, className = '', alt }: { id: string; className?: string; alt: string }) {
  const [src, setSrc] = useState(thumb(id))
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onLoad={(e) => {
        // YouTube serves a 120px grey stub when maxres doesn't exist
        if (e.currentTarget.naturalWidth <= 120 && src === thumb(id)) setSrc(thumb(id, 'hqdefault'))
      }}
      onError={() => setSrc(src === thumb(id) ? thumb(id, 'hqdefault') : asset('backgrounds/hero-bg.svg'))}
    />
  )
}

export function MediaSection() {
  const [playing, setPlaying] = useState<Video | null>(null)
  const [featured, ...rest] = videos

  const open = (v: Video) => {
    sound.slash()
    setPlaying(v)
  }

  return (
    <section id="media" className="relative overflow-hidden bg-abyss py-24 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-crimson/[0.08] blur-[160px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader index="07" kicker="Official media" title={['WATCH', 'THE TRAILERS']}>
            The official Devil May Cry 5 trailers and battle themes from Capcom, straight from devilmaycry.com.
          </SectionHeader>
          <a
            href="https://www.devilmaycry.com/5/us/movie/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Open"
            className="label group flex items-center gap-2 self-start text-ash transition-colors hover:text-bone md:self-auto"
          >
            Official site <ArrowUpRight className="h-3.5 w-3.5 text-crimson transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          {/* featured */}
          <motion.button
            type="button"
            onClick={() => open(featured)}
            data-cursor="Play"
            className="group relative aspect-video overflow-hidden bg-void text-left"
            initial={{ opacity: 0, y: 40, clipPath: 'inset(10% 10% 10% 10%)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.2, ease }}
          >
            <Poster id={featured.id} alt={`${featured.title} poster`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 border border-white/[0.06] transition-colors duration-500 group-hover:border-crimson/60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-bone/40 bg-void/40 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-crimson group-hover:bg-crimson/80 md:h-24 md:w-24">
                <span className="absolute inset-0 animate-ping rounded-full border border-crimson/40 [animation-duration:2.4s]" />
                <Play className="ml-1 h-7 w-7 fill-bone text-bone" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
              <div>
                <p className="label text-[0.6rem] text-crimson">Featured · {featured.kind}</p>
                <h3 className="mt-2 font-display text-[clamp(1.6rem,3.6vw,3.4rem)] leading-none font-black text-bone">{featured.title.toUpperCase()}</h3>
              </div>
              <span className="label hidden text-[0.55rem] text-ash sm:block">Devil May Cry 5</span>
            </div>
          </motion.button>

          {/* list */}
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
            {rest.map((v, i) => (
              <motion.li
                key={v.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: i * 0.06 }}
              >
                <button
                  type="button"
                  onClick={() => open(v)}
                  data-cursor="Play"
                  className="group flex w-full items-center gap-4 border border-white/[0.05] bg-void/50 p-2 pr-4 text-left transition-colors duration-500 hover:border-crimson/50 hover:bg-crimson/[0.06]"
                >
                  <span className="relative aspect-video w-32 shrink-0 overflow-hidden bg-void lg:w-36">
                    <Poster id={v.id} alt="" className="h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-700 group-hover:scale-110 group-hover:opacity-100" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-4 w-4 fill-bone text-bone opacity-0 transition-opacity group-hover:opacity-100" />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="label block text-[0.5rem] text-crimson/90">{v.kind}</span>
                    <span className="mt-1 block truncate font-ui text-[0.95rem] tracking-wide text-bone">{v.title}</span>
                  </span>
                  <span className="ml-auto font-ui text-xs text-ash tabular-nums">0{i + 2}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {createPortal(<AnimatePresence>{playing && <VideoModal key="video" video={playing} onClose={() => setPlaying(null)} />}</AnimatePresence>, document.body)}
    </section>
  )
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useBodyLock(true)
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[96] flex items-center justify-center bg-void/95 p-4 backdrop-blur-md md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      data-no-slash
    >
      <motion.div
        className="relative w-full max-w-6xl"
        initial={{ clipPath: 'inset(50% 0 50% 0)' }}
        animate={{ clipPath: 'inset(0% 0 0% 0)' }}
        exit={{ clipPath: 'inset(50% 0 50% 0)' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="label text-[0.55rem] text-crimson">{video.kind}</p>
            <p className="font-display text-xl font-bold text-bone md:text-2xl">{video.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href={watchUrl(video.id)} target="_blank" rel="noopener noreferrer" className="label hidden items-center gap-1 text-[0.6rem] text-ash hover:text-bone sm:flex" data-cursor="Open">
              YouTube <ArrowUpRight className="h-3 w-3" />
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              data-cursor="Close"
              aria-label="Close video"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-crimson"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="relative aspect-video w-full overflow-hidden bg-black shadow-[0_0_80px_-10px_rgba(200,16,46,0.5)] ring-1 ring-crimson/40">
          <Poster id={video.id} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl(video.id)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <a href={watchUrl(video.id)} target="_blank" rel="noopener noreferrer" className="label mt-3 inline-flex items-center gap-1 text-[0.6rem] text-ash hover:text-bone sm:hidden">
          Watch on YouTube <ArrowUpRight className="h-3 w-3" />
        </a>
      </motion.div>
    </motion.div>
  )
}

import type { CSSProperties } from 'react'
import type { Character } from '../data/characters'

interface Props {
  c: Character
  className?: string
  style?: CSSProperties
  eager?: boolean
}

/**
 * Character artwork.
 *  - transparent renders (png/webp/avif) stand on top of the atmospheric placeholder poster
 *  - full-scene art (jpg) fills the frame, anchored on `c.focus` so the face stays in shot
 *    while panels expand, collapse and scale; a light grade ties it to the site palette
 *  - no official art → the placeholder poster
 */
export function CharacterArt({ c, className = '', style, eager }: Props) {
  const loading = eager ? 'eager' : 'lazy'
  const scene = c.art && !c.art.cutout

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={style}>
      {scene ? (
        <>
          <img
            src={c.art!.src}
            alt={`${c.name} — Devil May Cry 5`}
            loading={loading}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover saturate-[0.9]"
            style={{ objectPosition: c.focus ?? '50% 25%' }}
          />
          {/* grade: crush the edges and pull a little of the character's accent into the shadows */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_40%,rgba(5,5,5,0.75)_100%)]" />
          <div className="absolute inset-0 mix-blend-soft-light" style={{ background: `linear-gradient(200deg, transparent 40%, ${c.accent}66)` }} />
        </>
      ) : (
        <>
          <img src={c.image} alt="" loading={loading} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          {c.art && (
            <img
              src={c.art.src}
              alt={`${c.name} — official render`}
              loading={loading}
              decoding="async"
              className="absolute inset-x-0 bottom-0 mx-auto h-[96%] w-full object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
            />
          )}
        </>
      )}
    </div>
  )
}

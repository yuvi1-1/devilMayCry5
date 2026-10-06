import { officialGroup } from '../lib/asset'

export type GalleryKind = 'scene' | 'poster' | 'print' | 'render'

export interface GalleryItem {
  src: string
  title: string
  caption: string
  kind: GalleryKind
}

/** How a piece is framed: landscape scenes, portrait posters, mounted concept prints, or cut-out renders. */
const kindOf = (caption: string, cutout: boolean): GalleryKind =>
  cutout ? 'render' : /concept|graphic arts/i.test(caption) ? 'print' : /novel/i.test(caption) ? 'poster' : 'scene'

const pretty = (key: string) =>
  key
    .split('/')
    .pop()!
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

/** Anything dropped into src/assets/official/gallery shows up first (prefix names with 01-, 02- to order them). */
const labels: Record<string, [string, string]> = {
  'bloody-palace-dante': ['The Legend Continues — Dante', 'Bloody Palace key art'],
  'bloody-palace-nero': ['The Legend Continues — Nero', 'Bloody Palace key art'],
  'bloody-palace-v': ['The Legend Continues — V', 'Bloody Palace key art'],
  'bloody-palace-vergil': ['The Legend Continues — Vergil', 'Bloody Palace key art'],
  'nero-vs-goliath': ['Nero vs. Goliath', 'Devil May Cry 5 screenshot'],
  'nero-in-red-grave': ['Nero in Red Grave City', 'Devil May Cry 5 screenshot'],
  'devil-breaker': ['Devil Breaker', 'Devil May Cry 5 screenshot'],
  v: ['V', 'Devil May Cry 5 screenshot'],
  yamato: ['Yamato', 'Devil May Cry 5 key visual'],
  'devil-sword-dante': ['Devil Sword Dante', 'Devil May Cry 5 screenshot'],
  'devil-sword-dante-ii': ['Devil Sword Dante', 'Devil May Cry 5 screenshot'],
  'king-cerberus': ['King Cerberus', 'Devil May Cry 5 screenshot'],
  'nero-tomboy': ['Nero — Tomboy', 'Devil May Cry 5 screenshot'],
  'dante-in-battle': ['Dante', 'Devil May Cry 5 screenshot'],
  'dante-in-flames': ['Dante', 'Devil May Cry 5 screenshot'],
  'bloody-palace-legion': ['The Legion', 'Bloody Palace screenshot'],
  'bloody-palace-onslaught': ['Onslaught', 'Bloody Palace screenshot'],
  'bloody-palace-v-arena': ['V in the Arena', 'Bloody Palace screenshot'],
  'bloody-palace-colossus': ['Colossus', 'Bloody Palace screenshot'],
  'concept-red-queen': ['Red Queen — Design Work', 'Devil May Cry 5 concept art'],
  'concept-red-queen-ii': ['Red Queen — Design Work', 'Devil May Cry 5 concept art'],
  'concept-blue-rose': ['Blue Rose — Design Work', 'Devil May Cry 5 concept art'],
  'concept-balrog': ['Balrog — Design Work', 'Devil May Cry 5 concept art'],
  'concept-yamato': ['Yamato — Design Work', 'Devil May Cry 5 concept art'],
  lady: ['Lady', 'Devil May Cry 5 key visual'],
  'lady-close-up': ['Lady', 'Devil May Cry 5 screenshot'],
  'concept-neros-weapons': ["Nero's Weapons", 'Devil May Cry 3142 Graphic Arts'],
}

const dropped: GalleryItem[] = officialGroup('gallery').map((a) => {
  const id = a.key.split('/').pop()!.replace(/^\d+[-_ ]*/, '')
  const [title, caption] = labels[id] ?? [pretty(a.key), 'Devil May Cry 5']
  return { src: a.src, title, caption, kind: kindOf(caption, a.cutout) }
})

const curated: [string, string, string][] = [
  ['story/cover', 'Before the Nightmare', 'Novel cover · Tsuyomaru'],
  ['story/dante', 'Dante', 'Novel illustration · Tsuyomaru'],
  ['story/nero', 'Nero', 'Novel illustration · Tsuyomaru'],
  ['story/v', 'V', 'Novel illustration · Tsuyomaru'],
  ['characters/vergil', 'Vergil', 'Devil May Cry 5 promo render'],
  ['characters/lady', 'Lady', 'Devil May Cry 5 promo render'],
  ['characters/trish', 'Trish', 'Devil May Cry 5 promo render'],
]

const fromFolders: GalleryItem[] = curated.flatMap(([key, title, caption]) => {
  const art = officialGroup(key.split('/')[0]).find((a) => a.key === key)
  return art ? [{ src: art.src, title, caption, kind: kindOf(caption, art.cutout) }] : []
})

export const gallery: GalleryItem[] = [...dropped, ...fromFolders]

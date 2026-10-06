import { asset, official, type OfficialArt } from '../lib/asset'

export interface Quote {
  text: string
  source: string
}

export interface Character {
  id: string
  name: string
  title: string
  /** Official Japanese (katakana) name */
  jp: string
  numeral: string
  accent: string
  image: string
  art?: OfficialArt
  description: string
  bio: string
  /** Verbatim in-game line. Left empty rather than paraphrased. */
  quote?: Quote
  weapon: string
  style: string
  signature: string
  affiliation: string
  debut: string
  playable: string[]
  /** object-position for full-scene official art (keeps the face in frame as panels resize) */
  focus?: string
}

const c = (x: Omit<Character, 'image' | 'art'>): Character => ({
  ...x,
  image: asset(`characters/${x.id}.svg`),
  art: official(`characters/${x.id}`),
})

export const characters: Character[] = [
  c({
    id: 'dante',
    focus: '58% 28%',
    name: 'Dante',
    title: 'Legendary Devil Hunter',
    jp: 'ダンテ',
    numeral: 'I',
    accent: '#c8102e',
    description: 'Son of the dark knight Sparda and owner of the Devil May Cry agency in Red Grave City.',
    bio: 'Half-demon son of Sparda and the human Eva. Dante runs the Devil May Cry agency, takes the jobs no one else will, and fights with a swordsman’s precision and a showman’s ego. He is perpetually in debt and permanently hungry for pizza.',
    quote: { text: 'Jackpot!', source: 'Devil May Cry' },
    weapon: 'Rebellion · Ebony & Ivory',
    style: 'Trickster · Swordmaster · Gunslinger · Royalguard',
    signature: 'Sin Devil Trigger',
    affiliation: 'Devil May Cry',
    debut: 'Devil May Cry (2001)',
    playable: ['DMC', 'DMC2', 'DMC3', 'DMC4', 'DMC5'],
  }),
  c({
    id: 'vergil',
    name: 'Vergil',
    title: 'The Alpha and the Omega',
    jp: 'バージル',
    numeral: 'II',
    accent: '#6f93c9',
    description: 'Dante’s older twin. A disciplined swordsman who chased his father’s power above all else.',
    bio: 'Where Dante embraced his human side, Vergil sought the power of Sparda. He wields the Yamato, a katana capable of cutting through space itself. His rivalry with his brother drives Devil May Cry 3 and returns at the heart of Devil May Cry 5.',
    quote: { text: 'Might controls everything, and without strength, you cannot protect anything.', source: 'Devil May Cry 3' },
    weapon: 'Yamato · Beowulf · Force Edge',
    style: 'Dark Slayer',
    signature: 'Judgement Cut End',
    affiliation: 'Son of Sparda',
    debut: 'Devil May Cry 3 (2005)',
    playable: ['DMC3 SE', 'DMC4 SE', 'DMC5 SE'],
  }),
  c({
    id: 'nero',
    focus: '16% 18%',
    name: 'Nero',
    title: 'The Young Devil Hunter',
    jp: 'ネロ',
    numeral: 'III',
    accent: '#5b84d9',
    description: 'Former Holy Knight of the Order of the Sword from Fortuna. Vergil’s son.',
    bio: 'Raised in Fortuna and trained by the Order of the Sword, Nero awakened a demonic right arm — the Devil Bringer — in Devil May Cry 4. In Devil May Cry 5 he hunts with Nico’s prosthetic Devil Breakers after the arm is torn away.',
    weapon: 'Red Queen · Blue Rose · Devil Breakers',
    style: 'Exceed',
    signature: 'Devil Trigger',
    affiliation: 'Devil May Cry',
    debut: 'Devil May Cry 4 (2008)',
    playable: ['DMC4', 'DMC5'],
  }),
  c({
    id: 'lady',
    name: 'Lady',
    title: 'Human. Fearless. Deadly.',
    jp: 'レディ',
    numeral: 'IV',
    accent: '#b91c3a',
    description: 'A fully human devil hunter armed with the rocket-launcher Kalina Ann.',
    bio: 'Born Mary, Lady climbed Temen-ni-gru in Devil May Cry 3 to stop her father, Arkham, and left with a new name. She has no demonic blood and no special powers — just an arsenal and the nerve to use it.',
    quote: { text: 'Maybe somewhere out there even a devil may cry when he loses a loved one.', source: 'Devil May Cry 3' },
    weapon: 'Kalina Ann',
    style: 'Firearms',
    signature: 'Kalina Ann',
    affiliation: 'Freelance devil hunter',
    debut: 'Devil May Cry 3 (2005)',
    playable: ['DMC4 SE'],
  }),
  c({
    id: 'trish',
    name: 'Trish',
    title: 'Demon. Hunter. Lightning-fast.',
    jp: 'トリッシュ',
    numeral: 'V',
    accent: '#a78bfa',
    description: 'Created by Mundus in the image of Dante’s mother. Became Dante’s partner instead.',
    bio: 'Mundus built Trish to lure Dante to Mallet Island in the first Devil May Cry. She turned on her creator, and has worked alongside Dante ever since — wielding lightning and, when needed, the sword Sparda.',
    quote: { text: 'So, you must be the handyman who’ll take any dirty job, am I correct?', source: 'Devil May Cry' },
    weapon: 'Sparda · Luce & Ombra',
    style: 'Lightning',
    signature: 'Round Trip',
    affiliation: 'Devil May Cry',
    debut: 'Devil May Cry (2001)',
    playable: ['DMC4 SE'],
  }),
  c({
    id: 'v',
    focus: '60% 22%',
    name: 'V',
    title: 'The Mysterious Poet',
    jp: 'V',
    numeral: 'VI',
    accent: '#8fae95',
    description: 'A frail stranger with a cane and a book of William Blake’s poetry who hires Dante.',
    bio: 'V fights through three familiars — Griffon, Shadow and Nightmare — and lands the finishing blow with his cane. He quotes William Blake constantly. His true identity is the central reveal of Devil May Cry 5.',
    weapon: 'Griffon · Shadow · Nightmare',
    style: 'Summoner',
    signature: 'Nightmare',
    affiliation: 'Unknown',
    debut: 'Devil May Cry 5 (2019)',
    playable: ['DMC5'],
  }),
]

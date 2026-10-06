import { official } from '../lib/asset'

/** Devil May Cry 5 — Before the Nightmare (prequel novel). Summaries are written for this site. */
export const book = {
  title: 'Before the Nightmare',
  full: 'Devil May Cry 5 — Before the Nightmare',
  author: 'Bingo Morihashi',
  illustrator: 'Tsuyomaru',
  publisher: 'Kadokawa Sneaker Bunko',
  year: 2019,
  cover: official('story/cover'),
}

export interface StoryChapter {
  id: string
  pov: string
  title: string[]
  body: string
  image?: string
}

export const chapters: StoryChapter[] = [
  {
    id: 'nero',
    pov: 'Nero',
    title: ['An arm', 'for an arm'],
    body: 'In Fortuna, a hooded stranger tears the Devil Bringer from Nero’s body. Then Nico — a self-proclaimed weapon artist — shows up with an offer to build him something better.',
    image: official('story/nero')?.src,
  },
  {
    id: 'dante',
    pov: 'Dante',
    title: ['A job from', 'a stranger'],
    body: 'Morrison brings a new client to the Devil May Cry office: a thin man with a cane, tattoos and a mouth full of poetry, asking Dante to kill a powerful demon. Old faces from Dumary Island resurface along the way.',
    image: official('story/dante')?.src,
  },
  {
    id: 'v',
    pov: 'V',
    title: ['The poet', 'waits'],
    body: 'V moves in the margins, setting the pieces in place before the Qliphoth breaks through Red Grave City.',
    image: official('story/v')?.src,
  },
]

export const finale = {
  line: ['Cross into', 'Red Grave.'],
  body: 'A month later, Nero and Nico roll out in a van with the Devil May Cry sign hitched to it and the very first Devil Breaker in its case. The game begins where the book ends.',
}

export const allies = [
  {
    id: 'nico',
    name: 'Nico',
    role: 'Weapon artist',
    body: 'Granddaughter of Nell Goldstein, the gunsmith behind Ebony & Ivory. Builds Nero’s Devil Breakers and drives the van.',
    image: official('story/nico')?.src,
  },
  {
    id: 'morrison',
    name: 'Morrison',
    role: 'Information broker',
    body: 'Dante’s long-time contact. Brokers the jobs between clients and devil hunters — and brings V to the office.',
    image: official('story/morrison')?.src,
  },
]

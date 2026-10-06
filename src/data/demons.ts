import { asset, official, type OfficialArt } from '../lib/asset'

export type DemonClass = 'Enemy' | 'Boss'

export interface Demon {
  id: string
  name: string
  kind: DemonClass
  game: string
  image: string
  art?: OfficialArt
  description: string
}

const d = (x: Omit<Demon, 'image' | 'art'>): Demon => ({ ...x, image: asset(`demons/${x.id}.svg`), art: official(`demons/${x.id}`) })

export const demons: Demon[] = [
  d({ id: 'hell-caina', name: 'Hell Caina', kind: 'Enemy', game: 'Devil May Cry 5', description: 'Scythe-wielding lesser demons. The first enemies you face in Red Grave City, and the most common.' }),
  d({ id: 'empusa', name: 'Empusa', kind: 'Enemy', game: 'Devil May Cry 5', description: 'Insect-like demons that burrow underground and attack in swarms, led by the Empusa Queen.' }),
  d({ id: 'fury', name: 'Fury', kind: 'Enemy', game: 'Devil May Cry 5', description: 'Fast, teleporting demons with blade-like claws that strike before you can react.' }),
  d({ id: 'nobody', name: 'Nobody', kind: 'Enemy', game: 'Devil May Cry 5', description: 'Lanky demons that put on a mask to transform into a far larger and more dangerous form.' }),
  d({ id: 'goliath', name: 'Goliath', kind: 'Boss', game: 'Devil May Cry 5', description: 'A giant demon with a furnace-like maw in its belly, fought by Nero early in the story.' }),
  d({ id: 'artemis', name: 'Artemis', kind: 'Boss', game: 'Devil May Cry 5', description: 'A winged demon powered by a captured Lady. Nero has to fight it to get her back.' }),
  d({ id: 'cavaliere-angelo', name: 'Cavaliere Angelo', kind: 'Boss', game: 'Devil May Cry 5', description: 'A heavily armoured demon knight of the Underworld fought by Dante.' }),
  d({ id: 'urizen', name: 'Urizen', kind: 'Boss', game: 'Devil May Cry 5', description: 'The demon king enthroned at the top of the Qliphoth, feeding on its fruit for power.' }),
]

import { asset, official, type OfficialArt } from '../lib/asset'

export interface Weapon {
  id: string
  name: string
  /** Official Japanese name */
  jp: string
  type: string
  /** A real in-game move or ability */
  ability: string
  wielder: string
  debut: string
  accent: string
  image: string
  art?: OfficialArt
  description: string
  moves: string[]
}

const w = (x: Omit<Weapon, 'image' | 'art'>): Weapon => ({ ...x, image: asset(`weapons/${x.id}.svg`), art: official(`weapons/${x.id}`) })

export const weapons: Weapon[] = [
  w({
    id: 'rebellion',
    name: 'Rebellion',
    jp: 'リベリオン',
    type: 'Sword',
    ability: 'Stinger',
    wielder: 'Dante',
    debut: 'Devil May Cry 3',
    accent: '#c8102e',
    description: 'A sword left to Dante by Sparda. In Devil May Cry 3 it awakens Dante’s demonic power when he is run through with it.',
    moves: ['Stinger', 'High Time', 'Million Stab'],
  }),
  w({
    id: 'yamato',
    name: 'Yamato',
    jp: '閻魔刀',
    type: 'Katana',
    ability: 'Judgement Cut',
    wielder: 'Vergil',
    debut: 'Devil May Cry 3',
    accent: '#6f93c9',
    description: 'Sparda’s katana, inherited by Vergil. Its edge can cut space itself — and, in Devil May Cry 5, separate a demon from its human half.',
    moves: ['Judgement Cut', 'Rapid Slash', 'Upper Slash'],
  }),
  w({
    id: 'red-queen',
    name: 'Red Queen',
    jp: 'レッドクイーン',
    type: 'Exceed Sword',
    ability: 'Exceed',
    wielder: 'Nero',
    debut: 'Devil May Cry 4',
    accent: '#c8102e',
    description: 'A modified Order of the Sword blade with a motorcycle-style grip that injects propellant into its edge for Exceed attacks.',
    moves: ['Streak', 'High Roller', 'MAX-Act'],
  }),
  w({
    id: 'blue-rose',
    name: 'Blue Rose',
    jp: 'ブルーローズ',
    type: 'Revolver',
    ability: 'Charge Shot',
    wielder: 'Nero',
    debut: 'Devil May Cry 4',
    accent: '#5b84d9',
    description: 'Nero’s custom double-barrelled revolver, firing two rounds with a single pull of the trigger.',
    moves: ['Charge Shot'],
  }),
  w({
    id: 'devil-sword-dante',
    name: 'Devil Sword Dante',
    jp: '魔剣ダンテ',
    type: 'Devil Sword',
    ability: 'Sin Devil Trigger',
    wielder: 'Dante',
    debut: 'Devil May Cry 5',
    accent: '#ff2a3d',
    description: 'Born in Devil May Cry 5 when Dante fuses the broken Rebellion with Sparda’s power, awakening his true strength.',
    moves: ['Sin Devil Trigger'],
  }),
  w({
    id: 'balrog',
    name: 'Balrog',
    jp: 'バルログ',
    type: 'Gauntlets & Greaves',
    ability: 'Blow / Kick Mode',
    wielder: 'Dante',
    debut: 'Devil May Cry 5',
    accent: '#ff6a1a',
    description: 'Flame-wreathed Devil Arm gauntlets and greaves. Dante switches between Blow Mode and Kick Mode on the fly.',
    moves: ['Blow Mode', 'Kick Mode'],
  }),
  w({
    id: 'cerberus',
    name: 'Cerberus',
    jp: 'ケルベロス',
    type: 'Tri-Nunchaku',
    ability: 'Ice Age',
    wielder: 'Dante',
    debut: 'Devil May Cry 3',
    accent: '#7fd3ff',
    description: 'Earned by defeating the three-headed ice hound that guards Temen-ni-gru in Devil May Cry 3.',
    moves: ['Revolver', 'Windmill', 'Ice Age'],
  }),
]

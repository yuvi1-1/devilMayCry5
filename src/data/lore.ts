export interface LoreEntry {
  id: string
  era: string
  title: string
  /** Game where this part of the story is told */
  source: string
  body: string
}

export const lore: LoreEntry[] = [
  { id: 'demon-world', era: 'The Underworld', title: 'The Demon World', source: 'Devil May Cry', body: 'Beneath the human world lies the realm of demons, ruled by the Demon Emperor Mundus.' },
  { id: 'sparda', era: '2,000 Years Ago', title: 'Sparda', source: 'Devil May Cry', body: 'The Legendary Dark Knight Sparda awoke to justice, rebelled against his own kind and sealed Mundus and the demon world away from humanity.' },
  { id: 'humans', era: 'The Human World', title: 'Humans', source: 'Devil May Cry 3', body: 'Sparda remained among humans and fell in love with a human woman, Eva. Together they had twin sons.' },
  { id: 'sons', era: 'The Bloodline', title: 'The Sons of Sparda', source: 'Devil May Cry 3', body: 'Dante and Vergil. One embraced his human side, the other chased his father’s power — a conflict that raised the tower Temen-ni-gru.' },
  { id: 'hunters', era: 'The Agency', title: 'Devil Hunters', source: 'Devil May Cry', body: 'Dante opened his own business hunting demons for hire: Devil May Cry. Lady, Trish and later Nero join the trade.' },
  { id: 'order', era: 'Fortuna', title: 'The Order', source: 'Devil May Cry 4', body: 'On the island of Fortuna, the Order of the Sword worshipped Sparda as a god — while secretly creating demons of their own. Nero was raised among its knights.' },
  { id: 'qliphoth', era: 'Red Grave City', title: 'Qliphoth', source: 'Devil May Cry 5', body: 'A demonic tree erupts through Red Grave City, draining human blood to grow a fruit that grants the power of a demon king.' },
]

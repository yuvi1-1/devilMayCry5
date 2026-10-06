export interface Rank {
  letter: string
  word: string
  color: string
  glow: string
}

export const ranks: Rank[] = [
  { letter: 'D', word: 'Dismal', color: '#8b8d96', glow: 'rgba(139,141,150,0.35)' },
  { letter: 'C', word: 'Crazy', color: '#b8b9c0', glow: 'rgba(184,185,192,0.4)' },
  { letter: 'B', word: 'Badass', color: '#d9d4c8', glow: 'rgba(217,212,200,0.45)' },
  { letter: 'A', word: 'Apocalyptic', color: '#e8a24a', glow: 'rgba(232,162,74,0.5)' },
  { letter: 'S', word: 'Savage', color: '#ff5a3a', glow: 'rgba(255,90,58,0.55)' },
  { letter: 'SS', word: 'Sick Skills', color: '#ff2a3d', glow: 'rgba(255,42,61,0.6)' },
  { letter: 'SSS', word: 'Smokin’ Sexy Style', color: '#ff1e35', glow: 'rgba(255,30,53,0.85)' },
]

export interface NavItem {
  id: string
  label: string
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'characters', label: 'Characters' },
  { id: 'story', label: 'Story' },
  { id: 'weapons', label: 'Weapons' },
  { id: 'demons', label: 'Demons' },
  { id: 'universe', label: 'Universe' },
  { id: 'media', label: 'Media' },
]

/** All sections in order — used by the scroll HUD. */
export const sections = [
  { id: 'home', label: 'Prologue' },
  { id: 'characters', label: 'The Hunters' },
  { id: 'style-rank', label: 'Style Rank' },
  { id: 'story', label: 'Before the Nightmare' },
  { id: 'weapons', label: 'Arsenal' },
  { id: 'demons', label: 'Bestiary' },
  { id: 'universe', label: 'Universe' },
  { id: 'media', label: 'Media' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'bloody-palace', label: 'Bloody Palace' },
]

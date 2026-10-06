/** Official Devil May Cry 5 videos, as listed on devilmaycry.com/5/us/movie/ */
export interface Video {
  id: string
  title: string
  kind: 'Trailer' | 'Battle Music'
}

export const videos: Video[] = [
  { id: 'MWxlbnI9mpU', title: 'Final Trailer', kind: 'Trailer' },
  { id: 'jHPAnj_Lcbo', title: 'Main Trailer', kind: 'Trailer' },
  { id: 'rKp1Hy0pjtw', title: 'TGS 2018 Trailer', kind: 'Trailer' },
  { id: '0gBESLaqXFs', title: 'Gamescom 2018 Trailer', kind: 'Trailer' },
  { id: 'KMSGj9Y2T9Q', title: 'E3 2018 Trailer', kind: 'Trailer' },
  { id: '1l0elvnMgfA', title: 'V Battle Music', kind: 'Battle Music' },
  { id: '8k6GC5NtuAg', title: 'Nero Battle Music', kind: 'Battle Music' },
]

export const thumb = (id: string, q: 'maxresdefault' | 'hqdefault' = 'maxresdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`
export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`
export const embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`

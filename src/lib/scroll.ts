export function scrollToId(id: string, instant = false) {
  const el = document.getElementById(id)
  if (!el) return
  const top = id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' })
}

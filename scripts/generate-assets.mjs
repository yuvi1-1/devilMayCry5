// Generates the original placeholder artwork in /public/assets.
// Every file here is procedural and fan-made — swap any of them for real
// artwork by dropping a file with the same name (or updating src/data/*).
//   node scripts/generate-assets.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets')
const out = (p, svg) => {
  const f = join(root, p)
  mkdirSync(dirname(f), { recursive: true })
  writeFileSync(f, svg.replace(/\n\s+/g, '\n').trim() + '\n')
}

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const f = (n) => Math.round(n * 10) / 10

/* ------------------------------------------------------------------ */
/* Shared defs                                                          */
/* ------------------------------------------------------------------ */
const fogFilter = (id, freq = 0.006, oct = 3, seed = 3) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="${freq} ${freq * 2.2}" numOctaves="${oct}" seed="${seed}"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.1 -0.45"/>
  </filter>`

const steel = (id, a = '#e8e8ec', b = '#6b6d75', c = '#1a1b20') => `
  <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${a}"/><stop offset=".45" stop-color="${b}"/>
    <stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${b}"/>
  </linearGradient>`

/* ------------------------------------------------------------------ */
/* Characters — abstract cinematic posters with a unique sigil each     */
/* ------------------------------------------------------------------ */
const W = 900, H = 1350, cx = 450, cy = 560

const sigils = {
  dante: (c) => `
    <circle cx="${cx}" cy="${cy}" r="230" fill="none" stroke="${c}" stroke-width="2" opacity=".55"/>
    <circle cx="${cx}" cy="${cy}" r="252" fill="none" stroke="#d9d9de" stroke-width=".8" opacity=".35" stroke-dasharray="2 10"/>
    <path d="M${cx} ${cy - 330} L${cx + 18} ${cy - 250} L${cx + 18} ${cy + 250} L${cx} ${cy + 320} L${cx - 18} ${cy + 250} L${cx - 18} ${cy - 250}Z" fill="url(#metal)" opacity=".9"/>
    <path d="M${cx - 110} ${cy - 210} Q${cx} ${cy - 160} ${cx + 110} ${cy - 210} L${cx + 60} ${cy - 180} L${cx} ${cy - 190} L${cx - 60} ${cy - 180}Z" fill="#cfcfd4" opacity=".75"/>
    <path d="M${cx} ${cy - 120} l70 120 -70 120 -70 -120z" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M${cx - 250} ${cy + 40} L${cx - 120} ${cy + 40} M${cx + 120} ${cy + 40} L${cx + 250} ${cy + 40}" stroke="${c}" stroke-width="2" opacity=".7"/>`,
  vergil: (c) => `
    <circle cx="${cx}" cy="${cy}" r="210" fill="${c}" opacity=".08"/>
    <mask id="cres"><rect width="${W}" height="${H}" fill="#000"/><circle cx="${cx}" cy="${cy}" r="200" fill="#fff"/><circle cx="${cx + 80}" cy="${cy - 40}" r="185" fill="#000"/></mask>
    <circle cx="${cx}" cy="${cy}" r="200" fill="#e6ecf5" mask="url(#cres)" opacity=".92"/>
    <circle cx="${cx}" cy="${cy}" r="260" fill="none" stroke="#dfe6f0" stroke-width=".8" opacity=".35"/>
    ${[...Array(7)].map((_, i) => `<line x1="${cx - 330 + i * 30}" y1="${cy - 260 + i * 80}" x2="${cx + 330 - i * 20}" y2="${cy - 300 + i * 85}" stroke="#dfe6f0" stroke-width="${i % 3 === 0 ? 2.2 : 0.8}" opacity="${0.25 + (i % 3) * 0.2}"/>`).join('')}
    <line x1="${cx - 400}" y1="${cy + 40}" x2="${cx + 400}" y2="${cy - 40}" stroke="${c}" stroke-width="3"/>`,
  nero: (c) => `
    ${[0, 1, 2, 3].map((i) => `<path d="M${cx} ${cy} C${cx - 120 - i * 40} ${cy - 160 - i * 30}, ${cx - 260 - i * 30} ${cy - 120 + i * 10}, ${cx - 330 - i * 10} ${cy - 20 + i * 40}" fill="none" stroke="${i % 2 ? '#5b84d9' : c}" stroke-width="${3 - i * 0.5}" opacity=".8"/>
    <path d="M${cx} ${cy} C${cx + 120 + i * 40} ${cy - 160 - i * 30}, ${cx + 260 + i * 30} ${cy - 120 + i * 10}, ${cx + 330 + i * 10} ${cy - 20 + i * 40}" fill="none" stroke="${i % 2 ? '#5b84d9' : c}" stroke-width="${3 - i * 0.5}" opacity=".8"/>`).join('')}
    <circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="#dfe6f0" stroke-width="2"/>
    <path d="M${cx} ${cy - 50} a50 50 0 1 1 -1 0 M${cx} ${cy - 30} a30 30 0 1 0 1 0" fill="none" stroke="${c}" stroke-width="3"/>`,
  lady: (c) => `
    ${[90, 160, 240].map((r, i) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${i === 1 ? c : '#cfd3d8'}" stroke-width="${i === 1 ? 3 : 1}" opacity=".7" ${i === 2 ? 'stroke-dasharray="40 14"' : ''}/>`).join('')}
    <path d="M${cx} ${cy - 320} V${cy - 60} M${cx} ${cy + 60} V${cy + 320} M${cx - 320} ${cy} H${cx - 60} M${cx + 60} ${cy} H${cx + 320}" stroke="#cfd3d8" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="6" fill="${c}"/>
    <path d="M${cx - 180} ${cy - 180} l30 0 M${cx - 180} ${cy - 180} l0 30 M${cx + 180} ${cy + 180} l-30 0 M${cx + 180} ${cy + 180} l0 -30" stroke="${c}" stroke-width="3"/>`,
  trish: (c) => `
    <path d="M${cx} ${cy - 260} L${cx + 225} ${cy + 130} L${cx - 225} ${cy + 130}Z M${cx} ${cy + 260} L${cx + 225} ${cy - 130} L${cx - 225} ${cy - 130}Z" fill="none" stroke="${c}" stroke-width="2" opacity=".8"/>
    <path d="M${cx + 40} ${cy - 230} L${cx - 70} ${cy + 10} L${cx + 10} ${cy + 10} L${cx - 50} ${cy + 240} L${cx + 90} ${cy - 40} L${cx + 5} ${cy - 40}Z" fill="#f3e9ff" opacity=".9"/>
    <circle cx="${cx}" cy="${cy}" r="290" fill="none" stroke="#f3e9ff" stroke-width=".8" opacity=".35"/>`,
  v: (c) => `
    <path d="M${cx} ${cy + 120} C${cx - 80} ${cy + 80}, ${cx - 200} ${cy + 90}, ${cx - 280} ${cy + 130} L${cx - 280} ${cy - 120} C${cx - 200} ${cy - 160}, ${cx - 80} ${cy - 150}, ${cx} ${cy - 110}Z M${cx} ${cy + 120} C${cx + 80} ${cy + 80}, ${cx + 200} ${cy + 90}, ${cx + 280} ${cy + 130} L${cx + 280} ${cy - 120} C${cx + 200} ${cy - 160}, ${cx + 80} ${cy - 150}, ${cx} ${cy - 110}Z" fill="none" stroke="#e8e4d8" stroke-width="2" opacity=".8"/>
    ${[...Array(6)].map((_, i) => `<path d="M${cx - 240} ${cy - 80 + i * 32} C${cx - 170} ${cy - 105 + i * 32}, ${cx - 90} ${cy - 100 + i * 32}, ${cx - 30} ${cy - 75 + i * 32}" fill="none" stroke="#e8e4d8" stroke-width=".8" opacity=".35"/>`).join('')}
    <path d="M${cx + 60} ${cy + 260} C${cx + 120} ${cy + 80}, ${cx + 200} ${cy - 120}, ${cx + 320} ${cy - 300} C${cx + 250} ${cy - 120}, ${cx + 160} ${cy + 80}, ${cx + 60} ${cy + 260}Z" fill="${c}" opacity=".85"/>
    ${[0, 1, 2].map((i) => `<circle cx="${cx - 60 + i * 60}" cy="${cy + 220}" r="7" fill="${c}"/>`).join('')}`,
}

function characterPoster(id, accent, tint, numeral, seed) {
  const r = rng(seed)
  const shafts = [...Array(5)]
    .map(() => {
      const x = 100 + r() * 700, w = 40 + r() * 120
      return `<rect x="${f(x)}" y="-200" width="${f(w)}" height="1800" fill="url(#shaft)" opacity="${f(0.05 + r() * 0.08)}" transform="rotate(${f(-18 + r() * 10)} ${f(x)} 0)"/>`
    })
    .join('')
  const slashes = [...Array(3)]
    .map(() => {
      const y = 200 + r() * 900
      return `<path d="M-50 ${f(y + 220)} L950 ${f(y)} L950 ${f(y + 3)} Z" fill="${accent}" opacity="${f(0.25 + r() * 0.3)}"/>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050506"/><stop offset=".5" stop-color="${tint}"/><stop offset="1" stop-color="#030303"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".42" r=".55">
      <stop offset="0" stop-color="${accent}" stop-opacity=".55"/><stop offset=".45" stop-color="${accent}" stop-opacity=".12"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".95"/>
    </linearGradient>
    ${steel('metal')}
    ${fogFilter('fog', 0.005, 3, seed)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${shafts}
  <text x="${cx}" y="1080" text-anchor="middle" font-family="Georgia, serif" font-size="620" font-weight="700" fill="#fff" opacity=".035" letter-spacing="-20">${numeral}</text>
  <g>${sigils[id](accent)}</g>
  ${slashes}
  <rect width="${W}" height="${H}" filter="url(#fog)" opacity=".22"/>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
</svg>`
}

const characters = [
  ['dante', '#c8102e', '#1c0508', 'I', 11],
  ['vergil', '#6f93c9', '#070b14', 'II', 22],
  ['nero', '#c8102e', '#0a0b16', 'III', 33],
  ['lady', '#b91c3a', '#0c0c0e', 'IV', 44],
  ['trish', '#a78bfa', '#0d0814', 'V', 55],
  ['v', '#8fae95', '#070a08', 'VI', 66],
]
for (const c of characters) out(`characters/${c[0]}.svg`, characterPoster(...c))

/* ------------------------------------------------------------------ */
/* Hero — gothic skyline, crimson moon, rising roots, planted sword     */
/* ------------------------------------------------------------------ */
function skyline(seed, baseY, minH, maxH, color, windows) {
  const r = rng(seed)
  let x = -20, d = `M-20 1080 `
  const lights = []
  while (x < 1940) {
    const w = 26 + r() * 90, h = minH + r() * (maxH - minH), top = baseY - h
    d += `L${f(x)} ${f(top)} `
    const kind = r()
    if (kind < 0.28) {
      // gothic spire
      d += `L${f(x + w * 0.2)} ${f(top)} L${f(x + w / 2)} ${f(top - 60 - r() * 140)} L${f(x + w * 0.8)} ${f(top)} `
    } else if (kind < 0.42) {
      // twin pinnacles
      d += `L${f(x + w * 0.1)} ${f(top - 40)} L${f(x + w * 0.2)} ${f(top)} L${f(x + w * 0.8)} ${f(top)} L${f(x + w * 0.9)} ${f(top - 40)} `
    } else if (kind < 0.5) {
      // clock tower
      d += `L${f(x)} ${f(top - 80)} L${f(x + w / 2)} ${f(top - 150)} L${f(x + w)} ${f(top - 80)} `
    }
    d += `L${f(x + w)} ${f(top)} `
    if (windows && r() < 0.5) lights.push(`<rect x="${f(x + w * (0.2 + r() * 0.6))}" y="${f(top + 20 + r() * h * 0.6)}" width="2.5" height="5" fill="#ff3a3a" opacity="${f(0.4 + r() * 0.6)}"/>`)
    x += w + r() * 6
  }
  d += `L1940 1080 Z`
  return `<path d="${d}" fill="${color}"/>${lights.join('')}`
}

function roots(seed) {
  const r = rng(seed)
  const paths = []
  const grow = (x, y, ang, len, w, depth) => {
    if (depth > 6 || w < 0.6) return
    const nx = x + Math.cos(ang) * len, ny = y + Math.sin(ang) * len
    const mx = (x + nx) / 2 + (r() - 0.5) * len * 0.5, my = (y + ny) / 2 + (r() - 0.5) * len * 0.3
    paths.push(`<path d="M${f(x)} ${f(y)} Q${f(mx)} ${f(my)} ${f(nx)} ${f(ny)}" stroke-width="${f(w)}"/>`)
    const n = depth < 2 ? 2 : r() < 0.6 ? 2 : 1
    for (let i = 0; i < n; i++) grow(nx, ny, ang + (r() - 0.5) * 1.1, len * (0.68 + r() * 0.2), w * 0.62, depth + 1)
  }
  grow(1340, 1080, -Math.PI / 2 - 0.08, 260, 34, 0)
  grow(1340, 1080, -Math.PI / 2 + 0.5, 200, 20, 1)
  grow(1340, 1080, -Math.PI / 2 - 0.6, 200, 20, 1)
  return `<g fill="none" stroke="#2a0306" stroke-linecap="round">${paths.join('')}</g>`
}

out(
  'backgrounds/hero-bg.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#030304"/><stop offset=".55" stop-color="#12030a"/><stop offset=".82" stop-color="#3a0610"/><stop offset="1" stop-color="#0a0102"/>
    </linearGradient>
    <radialGradient id="moonGlow" gradientUnits="userSpaceOnUse" cx="1340" cy="360" r="700">
      <stop offset="0" stop-color="#ff5a4a" stop-opacity=".45"/><stop offset=".4" stop-color="#b3101f" stop-opacity=".18"/><stop offset="1" stop-color="#b3101f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="moon" cx=".42" cy=".38" r=".7">
      <stop offset="0" stop-color="#ffd9cf"/><stop offset=".55" stop-color="#e2493f"/><stop offset="1" stop-color="#6d0a12"/>
    </radialGradient>
    ${fogFilter('fog', 0.0028, 4, 9)}
    ${fogFilter('craters', 0.03, 3, 4)}
    <clipPath id="mc"><circle cx="1340" cy="360" r="190"/></clipPath>
    <linearGradient id="feather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff"/><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="fogMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><rect y="520" width="1920" height="560" fill="url(#feather)"/></mask>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  ${(() => { const r = rng(7); return [...Array(120)].map(() => `<circle cx="${f(r() * 1920)}" cy="${f(r() * 600)}" r="${f(r() * 1.1 + 0.2)}" fill="#fff" opacity="${f(r() * 0.5)}"/>`).join('') })()}
  <rect width="1920" height="1080" fill="url(#moonGlow)"/>
  <circle cx="1340" cy="360" r="190" fill="url(#moon)"/>
  <rect x="1140" y="160" width="400" height="400" filter="url(#craters)" opacity=".25" clip-path="url(#mc)"/>
  ${roots(17)}
  ${skyline(101, 860, 120, 300, '#14050a', false)}
  <g mask="url(#fogMask)"><rect y="520" width="1920" height="560" filter="url(#fog)" opacity=".35"/></g>
  ${skyline(202, 960, 80, 260, '#080203', true)}
  ${skyline(303, 1050, 40, 150, '#020101', true)}
  <rect y="700" width="1920" height="380" fill="url(#ground)"/>
</svg>`,
)

out(
  'backgrounds/hero-sword.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1400" width="600" height="1400">
  <defs>
    ${steel('blade', '#f4f4f6', '#8b8d96', '#1c1d22')}
    <linearGradient id="bladeV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2a2b31"/><stop offset=".48" stop-color="#c9cad1"/><stop offset=".52" stop-color="#56585f"/><stop offset="1" stop-color="#121317"/>
    </linearGradient>
    <linearGradient id="guard" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1b1b1f"/><stop offset=".5" stop-color="#7d7f88"/><stop offset="1" stop-color="#141417"/>
    </linearGradient>
    <radialGradient id="aura" cx=".5" cy=".3" r=".5"><stop offset="0" stop-color="#ff1e35" stop-opacity=".5"/><stop offset="1" stop-color="#ff1e35" stop-opacity="0"/></radialGradient>
    <linearGradient id="sink" x1="0" y1="0" x2="0" y2="1"><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000"/></linearGradient>
  </defs>
  <rect x="284" y="60" width="32" height="270" rx="6" fill="#16161a"/>
  ${[...Array(12)].map((_, i) => `<path d="M284 ${80 + i * 20} L316 ${92 + i * 20}" stroke="#3a3b42" stroke-width="5"/>`).join('')}
  <path d="M300 10 l26 30 -26 30 -26 -30z" fill="url(#guard)" stroke="#c8102e" stroke-width="2"/>
  <path d="M120 330 C180 300 240 320 300 300 C360 320 420 300 480 330 L460 370 C400 360 360 380 300 390 C240 380 200 360 140 370Z" fill="url(#guard)"/>
  <path d="M300 300 l20 45 -20 45 -20 -45z" fill="#c8102e"/>
  <path d="M250 390 L350 390 L338 1300 L300 1390 L262 1300Z" fill="url(#bladeV)"/>
  <path d="M300 400 L300 1360" stroke="#000" stroke-opacity=".4" stroke-width="3"/>
  <path d="M262 1300 L300 1390 L338 1300" fill="none" stroke="#ff2a3d" stroke-opacity=".5" stroke-width="2"/>
</svg>`,
)

out(
  'backgrounds/palace.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="g" cx=".5" cy=".15" r=".8"><stop offset="0" stop-color="#5a0711"/><stop offset=".6" stop-color="#120205"/><stop offset="1" stop-color="#030102"/></radialGradient>
    ${fogFilter('fog', 0.004, 3, 21)}
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  ${[...Array(9)].map((_, i) => { const x = 800 + (i - 4) * 170; return `<path d="M${x - 40} 1000 L${x - 40} ${300 + Math.abs(i - 4) * 50} Q${x} ${180 + Math.abs(i - 4) * 50} ${x + 40} ${300 + Math.abs(i - 4) * 50} L${x + 40} 1000Z" fill="#000" opacity="${f(0.55 + Math.abs(i - 4) * 0.08)}"/>` }).join('')}
  <path d="M0 1000 L800 520 L1600 1000Z" fill="#000" opacity=".5"/>
  <rect width="1600" height="1000" filter="url(#fog)" opacity=".18"/>
</svg>`,
)

/* ------------------------------------------------------------------ */
/* Weapons — horizontal artifact renders on transparent backgrounds     */
/* ------------------------------------------------------------------ */
const wDefs = (accent) => `<defs>
  <linearGradient id="bl" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f6f6f8"/><stop offset=".46" stop-color="#a5a7af"/><stop offset=".54" stop-color="#3a3c43"/><stop offset="1" stop-color="#16171b"/>
  </linearGradient>
  <linearGradient id="dk" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#5d5f68"/><stop offset=".5" stop-color="#1d1e23"/><stop offset="1" stop-color="#0a0a0c"/>
  </linearGradient>
  <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="#2a0306"/></linearGradient>
  <filter id="gl"><feGaussianBlur stdDeviation="6"/></filter>
</defs>`
const wrap = (accent, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" width="1000" height="400">${wDefs(accent)}${body}</svg>`
const grip = (x, y, len, h = 26) => `<rect x="${x}" y="${y - h / 2}" width="${len}" height="${h}" rx="5" fill="#141418"/>` + [...Array(Math.floor(len / 18))].map((_, i) => `<path d="M${x + 6 + i * 18} ${y - h / 2 + 2} l10 ${h - 4}" stroke="#34353c" stroke-width="5"/>`).join('')

const weapons = {
  rebellion: wrap('#c8102e', `
    ${grip(70, 200, 150)}
    <path d="M40 200 l30 -22 0 44z" fill="url(#dk)"/>
    <path d="M220 120 C250 150 250 180 262 200 C250 220 250 250 220 280 L290 240 L290 160Z" fill="url(#dk)" stroke="#6a6c75"/>
    <path d="M262 200 l18 -18 18 18 -18 18z" fill="url(#ac)"/>
    <path d="M290 168 L900 178 L960 200 L900 222 L290 232Z" fill="url(#bl)"/>
    <path d="M300 200 L890 200" stroke="#000" stroke-opacity=".35" stroke-width="3"/>`),
  yamato: wrap('#6f93c9', `
    ${grip(60, 214, 190, 22)}
    <ellipse cx="258" cy="212" rx="10" ry="34" fill="url(#dk)" stroke="#8a8d96"/>
    <rect x="266" y="200" width="22" height="22" fill="#b8a46a"/>
    <path d="M288 201 Q620 196 960 168 Q640 214 288 222Z" fill="url(#bl)"/>
    <path d="M300 213 Q620 208 940 176" stroke="#dfe6f0" stroke-opacity=".6" stroke-width="1.5" fill="none"/>
    <path d="M288 201 Q620 196 960 168" stroke="#6f93c9" stroke-width="2" fill="none" filter="url(#gl)"/>`),
  'red-queen': wrap('#c8102e', `
    ${grip(60, 200, 120, 30)}
    <rect x="180" y="170" width="70" height="60" rx="8" fill="url(#dk)" stroke="#6a6c75"/>
    <circle cx="215" cy="200" r="16" fill="url(#ac)"/>
    <path d="M250 150 L300 160 L300 240 L250 250Z" fill="url(#dk)"/>
    <path d="M300 156 L860 168 L950 200 L860 236 L300 244Z" fill="url(#bl)"/>
    <path d="M300 214 L840 214" stroke="#c8102e" stroke-width="5" opacity=".85"/>
    <path d="M330 224 L360 244 M380 224 L410 244" stroke="#2b2c31" stroke-width="6"/>`),
  'blue-rose': wrap('#5b84d9', `
    <path d="M150 210 L250 190 L300 300 L240 320 Z" fill="#141418" stroke="#3a3b42"/>
    <rect x="250" y="150" width="140" height="70" rx="10" fill="url(#dk)" stroke="#6a6c75"/>
    <rect x="270" y="160" width="100" height="50" rx="20" fill="#2a2c33"/>
    ${[0, 1, 2].map((i) => `<rect x="${282 + i * 28}" y="166" width="16" height="38" rx="6" fill="#5b84d9" opacity=".7"/>`).join('')}
    <rect x="390" y="150" width="440" height="30" rx="4" fill="url(#bl)"/>
    <rect x="390" y="186" width="440" height="30" rx="4" fill="url(#bl)"/>
    <rect x="380" y="146" width="20" height="74" fill="#2b2c31"/>
    <path d="M300 220 Q310 260 340 250" stroke="#8a8d96" stroke-width="5" fill="none"/>
    <circle cx="830" cy="165" r="5" fill="#000"/><circle cx="830" cy="201" r="5" fill="#000"/>`),
  'devil-sword-dante': wrap('#ff2a3d', `
    ${grip(60, 200, 130, 30)}
    <path d="M190 120 Q230 170 210 200 Q230 230 190 280 L280 230 L280 170Z" fill="#1a0306" stroke="#5a0b14"/>
    <path d="M280 160 L420 150 L470 175 L560 158 L620 182 L720 166 L780 186 L900 182 L970 200 L900 220 L780 214 L720 234 L620 218 L560 242 L470 225 L420 250 L280 240Z" fill="url(#dk)" stroke="#5a0b14"/>
    <path d="M290 200 C380 180 450 220 540 196 S700 186 760 204 S880 196 950 200" stroke="#ff2a3d" stroke-width="3" fill="none"/>
    <path d="M290 200 C380 180 450 220 540 196 S700 186 760 204 S880 196 950 200" stroke="#ff2a3d" stroke-width="10" fill="none" filter="url(#gl)" opacity=".7"/>
    <circle cx="235" cy="200" r="14" fill="url(#ac)"/>`),
  balrog: wrap('#ff6a1a', `
    ${[0, 1].map((k) => { const ox = 180 + k * 360; return `<g transform="translate(${ox} ${k ? 20 : -10}) rotate(${k ? 8 : -6} 150 200)">
      <path d="M0 160 L170 140 L200 170 L200 240 L170 270 L0 250Z" fill="url(#dk)" stroke="#6a6c75"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="200" y="${150 + i * 26}" width="80" height="22" rx="8" fill="url(#dk)" stroke="#45474e"/>`).join('')}
      <path d="M20 205 L160 195" stroke="#ff6a1a" stroke-width="5"/><path d="M20 205 L160 195" stroke="#ff6a1a" stroke-width="14" filter="url(#gl)" opacity=".6"/>
      <path d="M40 150 l20 -40 20 36 M100 145 l20 -46 20 42" fill="url(#dk)" stroke="#45474e"/>
    </g>` }).join('')}`),
  cerberus: wrap('#7fd3ff', `
    ${[0, 1, 2].map((i) => `<g transform="rotate(${-14 + i * 14} ${300 + i * 200} 200)">
      <rect x="${200 + i * 210}" y="186" width="170" height="28" rx="12" fill="url(#bl)"/>
      <rect x="${200 + i * 210}" y="186" width="170" height="28" rx="12" fill="#7fd3ff" opacity=".25"/>
      <path d="M${210 + i * 210} 200 L${360 + i * 210} 200" stroke="#e8f8ff" stroke-width="2"/>
    </g>`).join('')}
    <path d="M370 196 C385 170 400 220 415 200 M580 200 C595 175 610 225 625 200" stroke="#9aa0aa" stroke-width="4" fill="none" stroke-dasharray="4 3"/>
    <path d="M200 200 L860 200" stroke="#7fd3ff" stroke-width="14" filter="url(#gl)" opacity=".35"/>`),
}
for (const [k, v] of Object.entries(weapons)) out(`weapons/${k}.svg`, v)

/* ------------------------------------------------------------------ */
/* Demons — symmetric procedural ink silhouettes ("specimen plates")    */
/* ------------------------------------------------------------------ */
function demon(seed, opt) {
  const r = rng(seed)
  const { horns = 1, hornLen = 120, arms = 1, armLen = 120, legs = 1, jag = 0.06, sy = 1.25, eye = '#ff2a3d', eyes = 2, tint = '#3a0a10' } = opt
  const bumps = []
  if (horns) bumps.push([0.42, hornLen / 200, 0.07])
  if (horns > 1) bumps.push([0.75, hornLen / 300, 0.06])
  if (arms) bumps.push([1.75, armLen / 200, 0.12], [2.15, armLen / 280, 0.09])
  if (legs) bumps.push([2.85, 0.65, 0.08])
  const harm = [...Array(5)].map((_, k) => [k + 2, (r() - 0.5) * (opt.wob ?? 0.18)])
  const pts = []
  const N = 360
  for (let i = 0; i <= N; i++) {
    const p = (i / N) * Math.PI * 2
    const q = p > Math.PI ? Math.PI * 2 - p : p
    let rad = 1
    for (const [k, a] of harm) rad += a * Math.cos(k * q)
    for (const [c, a, w] of bumps) rad += a * Math.exp(-((q - c) ** 2) / (2 * w * w))
    rad += jag * Math.sin(q * 23 + 1) * Math.sin(q * 7)
    rad -= q < 0.12 ? 0.1 : 0
    const R = 205 * rad
    pts.push([500 + R * Math.sin(p), 500 - R * Math.cos(p) * sy * 0.92])
  }
  const d = 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + 'Z'
  const eyeY = 500 - 205 * sy * 0.92 * 0.5
  const eyeEls = []
  if (eyes === 1) eyeEls.push(`<ellipse cx="500" cy="${f(eyeY)}" rx="16" ry="6"/>`)
  else for (let i = 0; i < eyes / 2; i++) eyeEls.push(`<ellipse cx="${f(500 - 32 - i * 28)}" cy="${f(eyeY + i * 18)}" rx="${11 - i * 3}" ry="${4 - i}"/><ellipse cx="${f(500 + 32 + i * 28)}" cy="${f(eyeY + i * 18)}" rx="${11 - i * 3}" ry="${4 - i}"/>`)
  const ribs = [...Array(5)].map((_, i) => `<path d="M${500 - 70 + i * 4} ${f(470 + i * 26)} Q500 ${f(450 + i * 26)} ${500 + 70 - i * 4} ${f(470 + i * 26)}" />`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <radialGradient id="body" cx=".5" cy=".38" r=".6"><stop offset="0" stop-color="${tint}"/><stop offset=".6" stop-color="#0b0507"/><stop offset="1" stop-color="#030203"/></radialGradient>
    <filter id="g"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="tex"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="${seed}"/><feColorMatrix values="0 0 0 0 .6  0 0 0 0 .05  0 0 0 0 .08  0 0 0 .55 -.28"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <clipPath id="c"><path d="${d}"/></clipPath>
  </defs>
  <path d="${d}" fill="url(#body)" stroke="#7a1420" stroke-width="2"/>
  <path d="${d}" fill="#000" filter="url(#tex)"/>
  <g clip-path="url(#c)" fill="none" stroke="#7a1420" stroke-width="2" opacity=".55">${ribs}<path d="M500 ${f(eyeY + 30)} L500 760"/></g>
  <g fill="${eye}" filter="url(#g)">${eyeEls.join('')}</g>
  <g fill="#ffd0d0">${eyeEls.join('')}</g>
</svg>`
}
const demons = {
  'hell-caina': [5, { horns: 1, hornLen: 160, arms: 1, armLen: 260, legs: 0, jag: 0.05, sy: 1.5, eyes: 1 }],
  empusa: [9, { horns: 2, hornLen: 90, arms: 1, armLen: 200, legs: 1, jag: 0.1, sy: 0.9, eyes: 4, eye: '#ffb02a' }],
  fury: [13, { horns: 1, hornLen: 60, arms: 1, armLen: 320, legs: 1, jag: 0.08, sy: 1.0, eyes: 2 }],
  nobody: [17, { horns: 0, arms: 1, armLen: 170, legs: 1, jag: 0.03, sy: 1.6, eyes: 2, tint: '#2a1830', eye: '#d7b8ff' }],
  goliath: [21, { horns: 2, hornLen: 200, arms: 1, armLen: 150, legs: 1, jag: 0.04, sy: 1.05, eyes: 6, tint: '#4a0d06', eye: '#ff7a1a' }],
  'cavaliere-angelo': [25, { horns: 2, hornLen: 140, arms: 1, armLen: 120, legs: 1, jag: 0.02, sy: 1.4, eyes: 1, tint: '#141c2a', eye: '#9cc3ff' }],
  urizen: [29, { horns: 2, hornLen: 260, arms: 1, armLen: 230, legs: 0, jag: 0.12, sy: 1.15, eyes: 2, tint: '#4a0612' }],
  'artemis': [33, { horns: 2, hornLen: 180, arms: 1, armLen: 300, legs: 0, jag: 0.05, sy: 1.2, eyes: 2, tint: '#1e1030', eye: '#c9a6ff' }],
}
for (const [k, [s, o]] of Object.entries(demons)) out(`demons/${k}.svg`, demon(s, o))

/* ------------------------------------------------------------------ */
/* Icons — original emblem (not an official logo)                       */
/* ------------------------------------------------------------------ */
const emblem = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <path d="M32 4 L54 32 L32 60 L10 32Z" fill="none" stroke="#c8102e" stroke-width="2.5"/>
  <path d="M32 10 L35 18 L35 46 L32 56 L29 46 L29 18Z" fill="#e7e7ea"/>
  <path d="M20 20 Q32 26 44 20 L40 24 L24 24Z" fill="#e7e7ea"/>
  <circle cx="32" cy="32" r="3" fill="#c8102e"/>
</svg>`
out('icons/emblem.svg', emblem)
writeFileSync(join(root, '..', 'favicon.svg'), emblem)
console.log('assets generated →', root)

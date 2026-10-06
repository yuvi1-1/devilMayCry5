/**
 * Image resolution.
 *
 *  asset('characters/dante.svg')  → the bundled placeholder in /public/assets
 *  official('characters/dante')   → your own official artwork, if you dropped a file into
 *                                   src/assets/official/characters/dante.(webp|png|jpg|jpeg|avif)
 *                                   Returns undefined when there is no file, so the site falls
 *                                   back to the placeholder automatically. No code changes needed.
 */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}assets/${path}`

const files = import.meta.glob('../assets/official/**/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byKey: Record<string, { url: string; path: string }> = {}
for (const [path, url] of Object.entries(files)) {
  const key = path.replace('../assets/official/', '').replace(/\.[a-z0-9]+$/i, '')
  byKey[key] = { url, path }
}

export interface OfficialArt {
  src: string
  /** PNG/WebP/AVIF renders are treated as transparent cut-outs and layered over the atmosphere. */
  cutout: boolean
}

export const official = (key: string): OfficialArt | undefined => {
  const hit = byKey[key]
  return hit ? { src: hit.url, cutout: !/\.jpe?g$/i.test(hit.path) } : undefined
}

/** Every official image under a folder, e.g. officialGroup('gallery'). Sorted by file name. */
export const officialGroup = (prefix: string): (OfficialArt & { key: string })[] =>
  Object.keys(byKey)
    .filter((k) => k.startsWith(prefix + '/'))
    .sort()
    .map((k) => ({ key: k, ...official(k)! }))

// Single-file build used only for the hosted preview: every asset is inlined.
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function inlineAssets(): Plugin {
  const root = join(__dirname, 'public', 'assets')
  const map: Record<string, string> = {}
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const full = join(dir, f)
      if (statSync(full).isDirectory()) walk(full)
      else map[full.slice(root.length + 1)] = 'data:image/svg+xml;base64,' + readFileSync(full).toString('base64')
    }
  }
  walk(root)
  const offRoot = join(__dirname, 'src', 'assets', 'official')
  const off: Record<string, { src: string; cutout: boolean }> = {}
  const walkOff = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const full = join(dir, f)
      if (statSync(full).isDirectory()) walkOff(full)
      else if (/\.(jpe?g|png|webp|avif)$/i.test(f)) {
        const ext = f.split('.').pop()!.toLowerCase()
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
        off[full.slice(offRoot.length + 1).replace(/\.[^.]+$/, '')] = { src: `data:${mime};base64,` + readFileSync(full).toString('base64'), cutout: !/jpe?g/.test(ext) }
      }
    }
  }
  walkOff(offRoot)
  return {
    name: 'inline-assets',
    enforce: 'pre',
    load(id) {
      if (id.endsWith('/src/lib/asset.ts')) return `const m = ${JSON.stringify(map)};\nconst o = ${JSON.stringify(off)};\nexport const asset = (p) => m[p] ?? p;\nexport const official = (k) => o[k];\nexport const officialGroup = (pre) => Object.keys(o).filter((k) => k.startsWith(pre + '/')).sort().map((k) => ({ key: k, ...o[k] }));`
    },
  }
}

export default defineConfig({
  plugins: [inlineAssets(), react(), tailwindcss()],
  build: { outDir: 'dist-artifact', assetsInlineLimit: 100_000_000, cssCodeSplit: false, modulePreload: false },
})

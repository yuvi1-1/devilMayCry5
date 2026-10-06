import { useEffect, useRef } from 'react'

interface Props {
  /** particles per 100k px² of canvas, capped */
  density?: number
  max?: number
  active?: boolean
  color?: [number, number, number]
  /** push particles away from the cursor */
  interactive?: boolean
  className?: string
}

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  life: number
  max: number
  phase: number
}

/** Canvas embers. Pre-rendered glow sprite, DPR-capped, paused off-screen. */
export function ParticleBackground({ density = 0.6, max = 70, active = true, color = [255, 60, 50], interactive = true, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active
  const rgb = color.join(',')

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let embers: Ember[] = []
    let raf = 0
    let visible = true
    let last = performance.now()
    const mouse = { x: -9999, y: -9999 }

    // glow sprite
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 32
    const s = sprite.getContext('2d')!
    const g = s.createRadialGradient(16, 16, 0, 16, 16, 16)
    g.addColorStop(0, `rgba(255,235,220,1)`)
    g.addColorStop(0.18, `rgba(${rgb},0.9)`)
    g.addColorStop(0.5, `rgba(${rgb},0.18)`)
    g.addColorStop(1, `rgba(${rgb},0)`)
    s.fillStyle = g
    s.fillRect(0, 0, 32, 32)

    const spawn = (initial = false): Ember => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.25 + Math.random() * 0.9),
      r: 1 + Math.random() * 3.2,
      life: 0,
      max: 400 + Math.random() * 600,
      phase: Math.random() * Math.PI * 2,
    })

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.min(max * (coarse ? 0.4 : 1), Math.round(((w * h) / 100000) * density))
      embers = Array.from({ length: Math.max(8, target) }, () => spawn(true))
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const dt = Math.min((now - last) / 16.67, 3)
      last = now
      ctx.clearRect(0, 0, w, h)
      if (!activeRef.current) return
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.life += dt
        e.phase += 0.02 * dt
        e.x += (e.vx + Math.sin(e.phase) * 0.22) * dt
        e.y += e.vy * dt
        if (interactive) {
          const dx = e.x - mouse.x
          const dy = e.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 18000) {
            const force = (1 - d2 / 18000) * 0.9
            e.x += (dx / Math.sqrt(d2 + 1)) * force * dt
            e.y += (dy / Math.sqrt(d2 + 1)) * force * dt
          }
        }
        if (e.y < -20 || e.life > e.max || e.x < -20 || e.x > w + 20) {
          embers[i] = spawn()
          continue
        }
        const fade = Math.min(1, e.life / 60) * Math.min(1, (e.max - e.life) / 120)
        const flick = 0.65 + Math.sin(e.phase * 6) * 0.35
        ctx.globalAlpha = Math.max(0, fade * flick)
        const size = e.r * 6
        ctx.drawImage(sprite, e.x - size / 2, e.y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const onMove = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ev.clientX - rect.left
      mouse.y = ev.clientY - rect.top
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting
      last = performance.now()
    })
    io.observe(canvas)
    if (interactive && !coarse) window.addEventListener('pointermove', onMove, { passive: true })
    if (!reduced) raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [density, max, rgb, interactive])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />
}

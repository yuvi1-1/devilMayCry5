/**
 * Tiny synthesized sound engine (Web Audio). No audio files, no copyrighted
 * music — an original low drone plus procedural slash/impact effects.
 * Nothing plays until the user explicitly switches sound on.
 */
class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private droneGain: GainNode | null = null
  private noise: AudioBuffer | null = null
  enabled = false

  private ensure() {
    if (this.ctx) return this.ctx
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = 0.9
    this.master.connect(ctx.destination)

    // white-noise buffer reused by every effect
    const len = ctx.sampleRate
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    this.noise = buf

    // Drone: detuned saws through a slowly breathing low-pass filter
    const drone = ctx.createGain()
    drone.gain.value = 0
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 260
    filter.Q.value = 7
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.06
    lfoGain.gain.value = 140
    lfo.connect(lfoGain).connect(filter.frequency)
    lfo.start()
    ;[
      [55, 'sawtooth', 0.5],
      [55.35, 'sawtooth', 0.5],
      [27.5, 'sine', 0.9],
      [82.4, 'triangle', 0.18],
    ].forEach(([freq, type, g]) => {
      const o = ctx.createOscillator()
      o.type = type as OscillatorType
      o.frequency.value = freq as number
      const og = ctx.createGain()
      og.gain.value = g as number
      o.connect(og).connect(filter)
      o.start()
    })
    filter.connect(drone).connect(this.master)
    this.droneGain = drone
    return ctx
  }

  async setEnabled(on: boolean) {
    this.enabled = on
    if (on) {
      const ctx = this.ensure()
      await ctx.resume()
      this.droneGain!.gain.cancelScheduledValues(ctx.currentTime)
      this.droneGain!.gain.setTargetAtTime(0.07, ctx.currentTime, 1.2)
    } else if (this.ctx && this.droneGain) {
      const ctx = this.ctx
      this.droneGain.gain.cancelScheduledValues(ctx.currentTime)
      this.droneGain.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
      window.setTimeout(() => {
        if (!this.enabled) void ctx.suspend()
      }, 1200)
    }
  }

  private burst(from: number, to: number, dur: number, gain: number, q = 1.2) {
    const ctx = this.ctx
    if (!ctx || !this.noise || !this.master) return
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = q
    bp.frequency.setValueAtTime(from, t)
    bp.frequency.exponentialRampToValueAtTime(to, t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(bp).connect(g).connect(this.master)
    src.start(t)
    src.stop(t + dur + 0.05)
  }

  private thump(from: number, to: number, dur: number, gain: number) {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(from, t)
    o.frequency.exponentialRampToValueAtTime(to, t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(this.master)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  slash() {
    if (!this.enabled) return
    this.burst(7000, 700, 0.2, 0.5, 0.9)
    this.thump(160, 45, 0.18, 0.25)
  }

  hit() {
    if (!this.enabled) return
    this.burst(3200, 300, 0.12, 0.45, 0.7)
    this.thump(120, 38, 0.14, 0.4)
  }

  tick() {
    if (!this.enabled) return
    this.burst(5200, 4000, 0.04, 0.06, 4)
  }

  rank(level: number) {
    if (!this.enabled || !this.ctx || !this.master) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const base = 220 * Math.pow(2, level / 6)
    ;[1, 1.5, 2].forEach((m, i) => {
      const o = ctx.createOscillator()
      o.type = i === 0 ? 'sawtooth' : 'triangle'
      o.frequency.value = base * m
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.06 / (i + 1), t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
      o.connect(g).connect(this.master!)
      o.start(t)
      o.stop(t + 0.55)
    })
    this.burst(4000, 1200, 0.25, 0.15)
  }
}

export const sound = new SoundEngine()

let ctx = null
let master = null
let enabled = true

function ensure() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.6
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function setSoundEnabled(value) {
  enabled = !!value
  if (master) master.gain.value = enabled ? 0.6 : 0
}

export function soundEnabled() {
  return enabled
}

export function unlockAudio() {
  ensure()
}

function tone({ freq = 440, end = null, dur = 0.1, type = 'square', gain = 0.08, delay = 0, pan = 0 }) {
  if (!enabled) return
  const audio = ensure()
  if (!audio) return
  const t0 = audio.currentTime + delay
  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (end) osc.frequency.exponentialRampToValueAtTime(Math.max(20, end), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  if (pan && audio.createStereoPanner) {
    const p = audio.createStereoPanner()
    p.pan.value = pan
    osc.connect(g).connect(p).connect(master)
  } else {
    osc.connect(g).connect(master)
  }
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noise({ dur = 0.15, gain = 0.05, delay = 0, lowpass = 1200 }) {
  if (!enabled) return
  const audio = ensure()
  if (!audio) return
  const t0 = audio.currentTime + delay
  const length = Math.max(1, Math.floor(audio.sampleRate * dur))
  const buffer = audio.createBuffer(1, length, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length)
  const src = audio.createBufferSource()
  src.buffer = buffer
  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = lowpass
  const g = audio.createGain()
  g.gain.value = gain
  src.connect(filter).connect(g).connect(master)
  src.start(t0)
}

export const sfx = {
  click() { tone({ freq: 300, end: 240, dur: 0.05, type: 'square', gain: 0.05 }) },
  select() { tone({ freq: 620, end: 760, dur: 0.06, type: 'triangle', gain: 0.06 }) },
  deselect() { tone({ freq: 420, end: 300, dur: 0.06, type: 'triangle', gain: 0.05 }) },
  hover() { tone({ freq: 900, dur: 0.02, type: 'sine', gain: 0.02 }) },
  shuffle() { noise({ dur: 0.25, gain: 0.05, lowpass: 2600 }) },
  play() {
    tone({ freq: 180, end: 320, dur: 0.16, type: 'sawtooth', gain: 0.06 })
    noise({ dur: 0.18, gain: 0.04, lowpass: 900 })
  },
  chip(index = 0) {
    tone({ freq: 330 + index * 55, dur: 0.07, type: 'square', gain: 0.05 })
  },
  mult(index = 0) {
    tone({ freq: 440 + index * 70, end: 660 + index * 70, dur: 0.18, type: 'triangle', gain: 0.06 })
  },
  score(big = false) {
    const notes = big ? [261, 329, 392, 523] : [261, 329, 392]
    notes.forEach((n, i) => tone({ freq: n, dur: 0.2, type: 'triangle', gain: 0.05, delay: i * 0.055 }))
    if (big) noise({ dur: 0.35, gain: 0.05, lowpass: 1800 })
  },
  hit() {
    tone({ freq: 120, end: 55, dur: 0.25, type: 'sine', gain: 0.14 })
    noise({ dur: 0.2, gain: 0.08, lowpass: 600 })
  },
  coin() {
    tone({ freq: 880, dur: 0.08, type: 'square', gain: 0.055 })
    tone({ freq: 1320, dur: 0.16, type: 'square', gain: 0.045, delay: 0.07 })
  },
  buy() {
    ;[523, 659, 784, 1046].forEach((n, i) => tone({ freq: n, dur: 0.15, type: 'triangle', gain: 0.05, delay: i * 0.06 }))
  },
  error() { tone({ freq: 150, end: 100, dur: 0.18, type: 'sawtooth', gain: 0.07 }) },
  win() {
    ;[392, 523, 659, 784, 1046].forEach((n, i) => tone({ freq: n, dur: 0.3, type: 'triangle', gain: 0.06, delay: i * 0.1 }))
    noise({ dur: 0.6, gain: 0.05, lowpass: 2400 })
  },
  lose() {
    ;[392, 330, 262, 196, 147].forEach((n, i) => tone({ freq: n, dur: 0.35, type: 'sawtooth', gain: 0.045, delay: i * 0.14 }))
  },
  boss() {
    ;[98, 110, 98].forEach((n, i) => tone({ freq: n, dur: 0.5, type: 'sawtooth', gain: 0.05, delay: i * 0.32 }))
  },
}

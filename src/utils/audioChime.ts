/**
 * Zero-dependency Web Audio API synthetic culinary chime.
 * Synthesizes a pleasant dual-frequency chime (E5: 659.25Hz -> A5: 880Hz) with natural exponential decay.
 * Guarantees zero latency and immunity to asset download failures or network issues.
 */
export function playKitchenChime(): void {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

    if (!AudioContextClass) return

    const ctx = new AudioContextClass()

    // Resume AudioContext if suspended by browser autoplay policy
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime)
    gain1.gain.setValueAtTime(0.3, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.8)

    // Note 2: A5 (880 Hz) with 150ms delay
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880.0, ctx.currentTime + 0.15)
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.15)
    osc2.stop(ctx.currentTime + 1.2)
  } catch (err) {
    console.warn('Audio chime playback suppressed by browser policy:', err)
  }
}

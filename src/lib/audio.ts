/**
 * Retro-Futuristic Terminal Sound Synthesizer using Web Audio API
 * Generates custom synthesized sounds on-the-fly without requiring high-latency assets.
 */

let audioCtx: AudioContext | null = null;
let isSoundMuted = false;

// Read default mute preference if on clientside
if (typeof window !== 'undefined') {
  const savedMute = localStorage.getItem('manjunathan_muted');
  isSoundMuted = savedMute === 'true';
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Suppress typescript warning for WebkitAudioContext if necessary
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  // Resume context if suspended (common browser security constraint)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch((err) => console.warn('AudioContext failed to resume:', err));
  }
  
  return audioCtx;
}

export const audioSystem = {
  getIsMuted: (): boolean => {
    return isSoundMuted;
  },

  toggleMute: (): boolean => {
    isSoundMuted = !isSoundMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('manjunathan_muted', String(isSoundMuted));
      window.dispatchEvent(new CustomEvent('audio-mute-toggle'));
    }
    return isSoundMuted;
  },

  /**
   * Play a subtle retro computer terminal click (high frequency, quick decay)
   */
  playClick: () => {
    if (isSoundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    
    // Quick frequency swoop for a crisp key sound
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

    gainNode.gain.setValueAtTime(0.10, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  },

  /**
   * Play an extremely light, tiny keyboard keypress tick
   */
  playKeystroke: () => {
    if (isSoundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    // Very high pitch tick for neat retro vibe
    const baseFreq = 1600 + Math.random() * 400; // Slight randomness for organic feel
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.02);

    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  },

  /**
   * Play a pleasant ascending double-beep for successful commands/actions
   */
  playSuccess: () => {
    if (isSoundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // First high note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, t); // D5
    gain1.gain.setValueAtTime(0.12, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.09);

    // Second higher note shortly after
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, t + 0.06); // A5
    gain2.gain.setValueAtTime(0.12, t + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.06);
    osc2.stop(t + 0.2);
  },

  /**
   * Play an offline-friendly/error falling buzzer tone
   */
  playError: () => {
    if (isSoundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // triangle has a softer buzzer quality than sawtooth
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.15);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.setValueAtTime(0.18, t + 0.05); // Hold briefly
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  },

  /**
   * Play a clean, tactile sliding tone for navigation or theme toggling features
   */
  playToggle: (isTurningOn: boolean = true) => {
    if (isSoundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';

    if (isTurningOn) {
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
    } else {
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.12);
    }

    gainNode.gain.setValueAtTime(0.10, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }
};

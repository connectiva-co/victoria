// Procedural Web Audio API Sound System - 100% code-synthesized, zero external dependencies

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private currentStep: number = 0;

  constructor() {
    // Check saved mute preference
    const savedMute = localStorage.getItem('victoria_ice_cream_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.16, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('victoria_ice_cream_muted', String(this.isMuted));

    if (this.ctx && this.bgmGain && this.sfxGain) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.16, now, 0.05);
      this.sfxGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.4, now, 0.05);
    }

    return this.isMuted;
  }

  // --- Sound Effects ---

  public playClick() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playScoop() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Satisfying soft creamy scoop plop
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playSprinkles() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // Burst of 4 high-pitched sparkle sprinkles
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.035;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqs = [1760, 2093, 2637, 3135];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[i % freqs.length] + Math.random() * 80, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    }
  }

  public playSauce() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Creamy smooth sliding swoosh
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.18);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playBell() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Dual frequency resonant chime bell
    const freqs = [1046.5, 2093]; // C6 and C7 harmonics
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.8);
    });
  }

  public playCoins() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // Clinking coin sequence
    const coinNotes = [987.77, 1318.51, 1567.98]; // B5, E6, G6
    coinNotes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const delay = idx * 0.07;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.18);
    });
  }

  public playFanfare() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    // Happy victory arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const delay = idx * 0.1;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + (idx === 3 ? 0.5 : 0.25));

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + (idx === 3 ? 0.5 : 0.25));
    });
  }

  public playError() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // --- Background Music (BGM) - Cheerful Marimba / Pastel Lofi Melody ---

  public startBGM() {
    if (this.isBgmPlaying) return;
    this.initContext();
    this.isBgmPlaying = true;

    // 16-step melody loop in C major / A minor pentatonic (marimba sound)
    // Notes: C4, D4, E4, G4, A4, C5, D5, E5
    const melody: (number | null)[] = [
      523.25, null, 659.25, 783.99,
      659.25, null, 523.25, 392.00,
      440.00, null, 523.25, 659.25,
      523.25, 783.99, null, 659.25,
    ];

    const bass: (number | null)[] = [
      261.63, null, null, null,
      196.00, null, null, null,
      220.00, null, null, null,
      174.61, null, null, null,
    ];

    this.currentStep = 0;
    const stepDuration = 240; // ms per 16th note

    this.bgmIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.bgmGain || this.isMuted) {
        this.currentStep = (this.currentStep + 1) % melody.length;
        return;
      }

      const note = melody[this.currentStep];
      const bassNote = bass[this.currentStep];
      const now = this.ctx.currentTime;

      // Play melody note with soft marimba envelope
      if (note) {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);

        noteGain.gain.setValueAtTime(0.22, now);
        noteGain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);

        osc.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + 0.22);
      }

      // Play bass note
      if (bassNote) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassNote, now);

        bassGain.gain.setValueAtTime(0.18, now);
        bassGain.gain.exponentialRampToValueAtTime(0.005, now + 0.5);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.5);
      }

      this.currentStep = (this.currentStep + 1) % melody.length;
    }, stepDuration);
  }

  public stopBGM() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
  }
}

export const sound = new SoundManager();

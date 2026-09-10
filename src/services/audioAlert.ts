/**
 * Web Audio API Acoustic Synthesizer for Mine Safety Siren / Buzzer
 * Simulates the ESP32 Gateway piezo buzzer / perimeter warning horn safely without external audio files.
 */
class MineAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isPlaying) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playSiren() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isPlaying) return;

      this.isPlaying = true;
      this.oscillator = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      this.oscillator.type = 'sawtooth';
      this.gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      let high = false;
      this.oscillator.frequency.setValueAtTime(650, this.ctx.currentTime);
      this.oscillator.start();

      this.intervalId = setInterval(() => {
        if (!this.ctx || !this.oscillator) return;
        high = !high;
        const targetFreq = high ? 950 : 650;
        this.oscillator.frequency.exponentialRampToValueAtTime(
          targetFreq,
          this.ctx.currentTime + 0.3
        );
      }, 400);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public playBeep(freq: number = 880, duration: number = 0.15) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore audio restriction
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {
        // already stopped
      }
      this.oscillator = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSynthesizer = new MineAudioSynthesizer();

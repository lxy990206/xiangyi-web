// Web Audio API Synthesizer to generate beautiful melodic ambient previews in the browser
class MelodyAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentInterval: number | null = null;
  private currentSongId: string | null = null;
  private onStateChangeCb: ((isPlaying: boolean, songId: string | null) => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCallback(cb: (isPlaying: boolean, songId: string | null) => void) {
    this.onStateChangeCb = cb;
  }

  public playSongPreview(songId: string, genre: string = '国风') {
    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying && this.currentSongId === songId) {
      this.stop();
      return;
    }

    this.stop();
    this.isPlaying = true;
    this.currentSongId = songId;
    if (this.onStateChangeCb) {
      this.onStateChangeCb(true, songId);
    }

    // Pentatonic & melodic scale notes frequencies
    const scales: Record<string, number[]> = {
      '古风/国风': [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25], // Gong/Shang/Jiao/Zhi/Yu (C pentatonic)
      '流行摇滚': [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25],          // A minor / Rock
      '电子/EDM': [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99],          // Future bass / High sparkle
      '抒情物语': [261.63, 329.63, 392.00, 523.25, 659.25, 783.99],                   // Soft dreamy ballad
      '交响/幻想': [196.00, 246.94, 293.66, 392.00, 493.88, 587.33, 783.99]          // Gothic Fantasy
    };

    const notes = scales[genre] || scales['古风/国风'];
    let step = 0;

    const playTone = () => {
      if (!this.ctx || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const freq = notes[step % notes.length];
      step++;

      // Create warm oscillator (triangle/sine blend)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = genre.includes('电子') ? 'sawtooth' : (genre.includes('摇滚') ? 'square' : 'triangle');
      osc.frequency.setValueAtTime(freq, now);

      // Low pass filter for warm organic tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(genre.includes('电子') ? 2200 : 1200, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    };

    playTone();
    this.currentInterval = window.setInterval(playTone, 320);
  }

  public stop() {
    this.isPlaying = false;
    this.currentSongId = null;
    if (this.currentInterval !== null) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    if (this.onStateChangeCb) {
      this.onStateChangeCb(false, null);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentSongId: this.currentSongId
    };
  }
}

export const audioEngine = new MelodyAudioEngine();

// Web Audio API Synthesizer & Audio Element Player
class MelodyAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentInterval: number | null = null;
  private currentSongId: string | null = null;
  private currentAudioUrl: string | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private volume: number = 0.8;
  private isUsingRealAudio: boolean = false;
  
  private onStateChangeCb: ((isPlaying: boolean, songId: string | null) => void) | null = null;
  private onProgressCb: ((currentTime: number, duration: number, pct: number) => void) | null = null;

  constructor() {
    // Lazy init
  }

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

  public setProgressCallback(cb: ((currentTime: number, duration: number, pct: number) => void) | null) {
    this.onProgressCb = cb;
  }

  public playSongPreview(songId: string, genre: string = '古风/国风', audioUrl?: string) {
    // If clicking same playing song -> pause/toggle off
    if (this.isPlaying && this.currentSongId === songId) {
      this.stop();
      return;
    }

    this.stop();
    this.currentSongId = songId;

    // Check if custom audio URL is provided
    if (audioUrl && audioUrl.trim().length > 0) {
      this.playRealAudio(songId, audioUrl.trim(), genre);
    } else {
      this.playSynthMelody(songId, genre);
    }
  }

  private playRealAudio(songId: string, url: string, fallbackGenre: string) {
    try {
      if (!this.audioElement) {
        this.audioElement = new Audio();
      }

      this.audioElement.src = url;
      this.audioElement.volume = this.volume;
      this.currentAudioUrl = url;
      this.isUsingRealAudio = true;

      this.audioElement.ontimeupdate = () => {
        if (!this.audioElement) return;
        const cur = this.audioElement.currentTime;
        const dur = this.audioElement.duration || 0;
        const pct = dur > 0 ? (cur / dur) * 100 : 0;
        if (this.onProgressCb) {
          this.onProgressCb(cur, dur, pct);
        }
      };

      this.audioElement.onended = () => {
        this.stop();
      };

      this.audioElement.onerror = () => {
        console.warn('Real audio failed to load/play, falling back to melody synthesizer...', url);
        this.isUsingRealAudio = false;
        this.playSynthMelody(songId, fallbackGenre);
      };

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            if (this.onStateChangeCb) {
              this.onStateChangeCb(true, songId);
            }
          })
          .catch((err) => {
            console.warn('Audio play auto-policy warning, trying synth fallback', err);
            this.isUsingRealAudio = false;
            this.playSynthMelody(songId, fallbackGenre);
          });
      }
    } catch {
      this.isUsingRealAudio = false;
      this.playSynthMelody(songId, fallbackGenre);
    }
  }

  private playSynthMelody(songId: string, genre: string = '古风/国风') {
    this.initContext();
    if (!this.ctx) return;

    this.isUsingRealAudio = false;
    this.isPlaying = true;
    this.currentSongId = songId;
    if (this.onStateChangeCb) {
      this.onStateChangeCb(true, songId);
    }

    // Pentatonic & melodic scale notes frequencies
    const scales: Record<string, number[]> = {
      '古风/国风': [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25], // C pentatonic
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
      gain.gain.exponentialRampToValueAtTime(0.15 * this.volume, now + 0.05);
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
    this.isUsingRealAudio = false;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // ignore
      }
    }

    if (this.currentInterval !== null) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }

    if (this.onStateChangeCb) {
      this.onStateChangeCb(false, null);
    }
  }

  public seek(pct: number) {
    if (this.isUsingRealAudio && this.audioElement && this.audioElement.duration) {
      this.audioElement.currentTime = (pct / 100) * this.audioElement.duration;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentSongId: this.currentSongId,
      isRealAudio: this.isUsingRealAudio,
      currentTime: this.audioElement?.currentTime || 0,
      duration: this.audioElement?.duration || 0
    };
  }
}

export const audioEngine = new MelodyAudioEngine();


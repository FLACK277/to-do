/**
 * AudioEngine — Procedural music & SFX via Web Audio API.
 * No external audio files needed.
 */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isPlaying = false;
    this.initialized = false;
    this.musicInterval = null;
    this.isDark = false;
  }

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.4;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.8;
    this.sfxGain.connect(this.masterGain);

    // Reverb for warmth
    this.convolver = this.ctx.createConvolver();
    const rate = this.ctx.sampleRate;
    const length = rate * 2;
    const impulse = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    this.convolver.buffer = impulse;
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.15;
    this.convolver.connect(this.reverbGain);
    this.reverbGain.connect(this.masterGain);

    this.initialized = true;
  }

  /** FM-synthesis piano note */
  playNote(freq, startTime, duration, velocity = 0.3, pan = 0) {
    if (!this.ctx) return;
    const t = startTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const mod = this.ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.value = freq * 2;
    const modGain = this.ctx.createGain();
    modGain.gain.value = freq * 0.5;
    mod.connect(modGain);
    modGain.connect(osc.frequency);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(velocity, t + 0.02);
    env.gain.exponentialRampToValueAtTime(velocity * 0.6, t + 0.1);
    env.gain.exponentialRampToValueAtTime(0.001, t + duration);

    const panner = this.ctx.createStereoPanner();
    panner.pan.value = pan;

    osc.connect(env);
    env.connect(panner);
    panner.connect(this.musicGain);
    panner.connect(this.convolver);

    osc.start(t);
    osc.stop(t + duration + 0.1);
    mod.start(t);
    mod.stop(t + duration + 0.1);
  }

  /** Pentatonic melody loop */
  startMusic() {
    if (!this.initialized) this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.musicGain.gain.value = 0.4;

    const scale = this.isDark
      ? [207.65, 233.08, 246.94, 311.13, 349.23, 415.30, 466.16, 493.88, 622.25, 698.46] // G# Minor Pentatonic
      : [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00]; // C Major/A Minor Pentatonic

    const progressions = this.isDark
      ? [[0, 2, 4], [3, 1, 0], [4, 6, 8], [2, 4, 1]]
      : [[0, 2, 4], [3, 5, 7], [1, 3, 5], [4, 6, 8], [0, 2, 4], [2, 4, 6], [1, 4, 6], [0, 3, 5]];

    const melodies = [
      [4, -1, 5, 4, 3, -1, 2, 0], [2, 3, 4, -1, 5, 4, 3, 2], [0, -1, 2, 4, 5, -1, 4, 3], [5, 4, 3, 2, -1, 0, 2, 3],
      [4, 5, 7, 5, 4, -1, 3, 2], [0, 2, 3, 4, -1, 5, 4, 2], [3, -1, 4, 5, 4, 3, 2, 0], [2, 4, 5, -1, 4, 3, 2, 0],
    ];

    let barIndex = 0;
    const bpm = 72;
    const beatDuration = 60 / bpm;
    const barDuration = beatDuration * 4;

    const playBar = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime + 0.1;
      const chord = progressions[barIndex % progressions.length];
      const melody = melodies[barIndex % melodies.length];

      chord.forEach((noteIdx, i) => {
        this.playNote(scale[noteIdx] * 0.5, now + i * 0.03, barDuration * 0.9, 0.12, (i - 1) * 0.3);
      });

      melody.forEach((noteIdx, i) => {
        if (noteIdx === -1) return;
        const freq = scale[Math.min(noteIdx, scale.length - 1)];
        const time = now + i * (barDuration / melody.length);
        const dur = (barDuration / melody.length) * 0.8;
        this.playNote(freq, time, dur, 0.15 + Math.random() * 0.08, (i / melody.length - 0.5) * 0.4);
      });

      if (Math.random() > 0.6) {
        const sparkleFreq = scale[Math.floor(Math.random() * 5)] * 2;
        this.playNote(sparkleFreq, now + Math.random() * barDuration * 0.5, 0.8, 0.06, Math.random() * 0.6 - 0.3);
      }
      barIndex++;
    };

    playBar();
    this.musicInterval = setInterval(playBar, barDuration * 1000);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.musicInterval) { clearInterval(this.musicInterval); this.musicInterval = null; }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    }
  }

  toggleMusic() {
    if (this.isPlaying) this.stopMusic(); else this.startMusic();
    return this.isPlaying;
  }

  setDark(isDark) {
    this.isDark = isDark;
    if (this.isPlaying) {
      this.stopMusic();
      setTimeout(() => this.startMusic(), 600);
    }
  }

  playChime(time, freq, velocity) {
    const osc = this.ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
    const osc2 = this.ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = freq * 3;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(velocity, time + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
    const env2 = this.ctx.createGain();
    env2.gain.setValueAtTime(0, time);
    env2.gain.linearRampToValueAtTime(velocity * 0.15, time + 0.005);
    env2.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    osc.connect(env); osc2.connect(env2);
    env.connect(this.sfxGain); env2.connect(this.sfxGain);
    env.connect(this.convolver);
    osc.start(time); osc.stop(time + 0.7);
    osc2.start(time); osc2.stop(time + 0.4);
  }

  playNoise(time, velocity, duration) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    const noise = this.ctx.createBufferSource(); noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 2000;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(velocity, time);
    env.gain.exponentialRampToValueAtTime(0.001, time + duration);
    noise.connect(filter); filter.connect(env); env.connect(this.sfxGain);
    noise.start(time); noise.stop(time + duration + 0.1);
  }

  playSfxAdd() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    this.playChime(now, 523.25, 0.15);
    this.playChime(now + 0.1, 659.25, 0.12);
    this.playChime(now + 0.2, 783.99, 0.10);
    this.playNoise(now, 0.08, 0.15);
  }

  playSfxComplete() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => this.playChime(now + i * 0.08, f, 0.2 - i * 0.03));
    setTimeout(() => {
      const n = this.ctx.currentTime;
      for (let i = 0; i < 5; i++) this.playChime(n + i * 0.05, 1200 + Math.random() * 800, 0.04);
    }, 200);
  }

  playSfxDelete() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    this.playChime(now, 440, 0.12);
    this.playChime(now + 0.08, 349.23, 0.10);
    this.playNoise(now, 0.06, 0.1);
  }

  playSfxPop() {
    if (!this.initialized) this.init();
    const now = this.ctx.currentTime;
    this.playChime(now, 600 + Math.random() * 200, 0.08);
  }
}

const audio = new AudioEngine();
export default audio;
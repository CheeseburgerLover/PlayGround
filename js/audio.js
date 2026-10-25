(function (root) {
  class DeepDeckAudio {
    constructor() {
      this.context = null;
      this.master = null;
      this.delay = null;
      this.musicTimer = null;
      this.musicStep = 0;
      this.started = false;
      this.drones = [];
      this.muted = false;
      try { this.muted = localStorage.getItem('deepdeck.muted') === '1'; } catch (error) { this.muted = false; }
    }

    init() {
      if (this.context) {
        if (this.context.state === 'suspended') this.context.resume();
        return;
      }
      const AudioContext = root.AudioContext || root.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : 0.7;
      const compressor = this.context.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 18;
      compressor.ratio.value = 4;
      this.delay = this.context.createDelay();
      this.delay.delayTime.value = 0.26;
      const feedback = this.context.createGain();
      feedback.gain.value = 0.18;
      const delayFilter = this.context.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 1600;
      this.delay.connect(delayFilter);
      delayFilter.connect(feedback);
      feedback.connect(this.delay);
      delayFilter.connect(this.master);
      this.master.connect(compressor);
      compressor.connect(this.context.destination);
    }

    setMuted(value) {
      this.muted = Boolean(value);
      try { localStorage.setItem('deepdeck.muted', this.muted ? '1' : '0'); } catch (error) { }
      if (this.master && this.context) {
        this.master.gain.cancelScheduledValues(this.context.currentTime);
        this.master.gain.linearRampToValueAtTime(this.muted ? 0 : 0.7, this.context.currentTime + 0.12);
      }
      return this.muted;
    }

    tone(frequency, duration, options) {
      if (!this.context || this.muted) return;
      const settings = options || {};
      const now = this.context.currentTime + (settings.delay || 0);
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      const filter = this.context.createBiquadFilter();
      osc.type = settings.type || 'triangle';
      osc.frequency.setValueAtTime(frequency, now);
      if (settings.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, frequency * settings.slide), now + duration);
      filter.type = 'lowpass';
      filter.frequency.value = settings.filter || 5000;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(settings.volume || 0.12, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      if (settings.echo) gain.connect(this.delay);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    }

    noise(duration, options) {
      if (!this.context || this.muted) return;
      const settings = options || {};
      const now = this.context.currentTime;
      const length = Math.max(1, Math.floor(this.context.sampleRate * duration));
      const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < length; index += 1) {
        const envelope = 1 - index / length;
        data[index] = (Math.random() * 2 - 1) * envelope * envelope;
      }
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      const filter = this.context.createBiquadFilter();
      filter.type = settings.type || 'bandpass';
      filter.frequency.value = settings.frequency || 900;
      filter.Q.value = settings.q || 0.8;
      const gain = this.context.createGain();
      gain.gain.value = settings.volume || 0.16;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start(now);
    }

    click() {
      this.init();
      this.tone(420, 0.06, { type: 'square', volume: 0.045, filter: 1800 });
    }

    select() {
      this.init();
      this.tone(560, 0.08, { type: 'triangle', volume: 0.055, echo: true });
    }

    deselect() {
      this.init();
      this.tone(330, 0.07, { type: 'triangle', volume: 0.04 });
    }

    mine() {
      this.init();
      this.noise(0.13, { type: 'bandpass', frequency: 1500, q: 0.6, volume: 0.2 });
      this.tone(95, 0.18, { type: 'sine', volume: 0.14, slide: 0.55 });
      this.tone(840, 0.1, { type: 'triangle', volume: 0.04, echo: true });
    }

    no() {
      this.init();
      this.tone(150, 0.16, { type: 'sawtooth', volume: 0.05, slide: 0.7, filter: 600 });
    }

    discard() {
      this.init();
      this.noise(0.24, { type: 'highpass', frequency: 500, volume: 0.1 });
      this.tone(260, 0.15, { type: 'triangle', volume: 0.035, slide: 0.7 });
    }

    play() {
      this.init();
      this.noise(0.16, { type: 'lowpass', frequency: 1100, volume: 0.12 });
      [392, 523.25, 659.25].forEach((frequency, index) => {
        this.tone(frequency, 0.3, { type: 'triangle', volume: 0.06, delay: index * 0.055, echo: true });
      });
    }

    score(index) {
      this.init();
      const scale = [523.25, 587.33, 659.25, 783.99, 880];
      const frequency = scale[index % scale.length];
      this.tone(frequency, 0.2, { type: 'triangle', volume: 0.05, echo: true });
    }

    hurt() {
      this.init();
      this.noise(0.3, { type: 'lowpass', frequency: 320, volume: 0.18 });
      this.tone(70, 0.4, { type: 'sawtooth', volume: 0.08, slide: 0.45, filter: 400 });
    }

    win() {
      this.init();
      [261.63, 329.63, 392, 523.25, 659.25].forEach((frequency, index) => {
        this.tone(frequency, 0.7, { type: 'triangle', volume: 0.07, delay: index * 0.09, echo: true });
      });
    }

    reward() {
      this.init();
      [880, 1108.73, 1318.51].forEach((frequency, index) => {
        this.tone(frequency, 0.5, { type: 'sine', volume: 0.055, delay: index * 0.08, echo: true });
      });
    }

    lose() {
      this.init();
      [220, 196, 164.81, 110].forEach((frequency, index) => {
        this.tone(frequency, 0.65, { type: 'sawtooth', volume: 0.055, delay: index * 0.12, filter: 900, echo: true });
      });
    }

    heart() {
      this.init();
      this.tone(650, 0.2, { type: 'sine', volume: 0.08, echo: true });
      this.tone(880, 0.35, { type: 'sine', volume: 0.06, delay: 0.09, echo: true });
    }

    startMusic() {
      this.init();
      if (!this.context || this.started) return;
      this.started = true;
      const now = this.context.currentTime;
      const droneGain = this.context.createGain();
      droneGain.gain.value = 0.018;
      droneGain.connect(this.master);
      const droneFilter = this.context.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 320;
      droneFilter.connect(droneGain);
      [55, 82.41, 110].forEach((frequency, index) => {
        const osc = this.context.createOscillator();
        osc.type = index === 1 ? 'sine' : 'triangle';
        osc.frequency.value = frequency;
        osc.detune.value = index === 0 ? -5 : 4;
        osc.connect(droneFilter);
        osc.start(now);
        this.drones.push(osc);
      });
      const pattern = [0, 7, 3, 10, 5, 12, 7, 3, 0, 5, 3, 10];
      const base = 220;
      this.musicTimer = setInterval(() => {
        if (!this.context || this.context.state !== 'running' || this.muted) return;
        const step = this.musicStep % pattern.length;
        const semitone = pattern[step];
        const frequency = base * Math.pow(2, semitone / 12);
        this.tone(frequency, 0.55, { type: 'sine', volume: step % 4 === 0 ? 0.03 : 0.018, echo: true, filter: 1800 });
        if (step === 8) this.noise(0.18, { type: 'lowpass', frequency: 420, volume: 0.012 });
        this.musicStep += 1;
      }, 880);
    }

    stopMusic() {
      if (this.musicTimer) clearInterval(this.musicTimer);
      this.musicTimer = null;
      this.started = false;
      for (const drone of this.drones) {
        try { drone.stop(); } catch (error) { }
        try { drone.disconnect(); } catch (error) { }
      }
      this.drones = [];
    }
  }

  root.DeepDeckAudio = DeepDeckAudio;
})(typeof globalThis !== 'undefined' ? globalThis : this);

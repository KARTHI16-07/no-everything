/**
 * High-Precision Audio Engine for NO EVERYTHING
 * Uses HTML5 Web Audio API to synthesize ambient focus frequencies and chimes
 * Zero external audio file dependencies — 100% offline reliability.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.currentNoiseNode = null;
    this.currentOscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play peaceful meditation bowl chime on timer completion
  playBell() {
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, this.ctx.currentTime); // 528 Hz transformation frequency
      osc.frequency.exponentialRampToValueAtTime(432, this.ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.0);
    } catch (e) {
      console.warn('Audio playback not supported or user has not interacted yet', e);
    }
  }

  // Play soft subtle tick
  playTick() {
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Synthesize 40Hz Binaural Gamma wave / Deep Brown Noise for sustained deep work
  startAmbient(type = 'GAMMA_40HZ') {
    try {
      this.stopAmbient();
      this.initContext();

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      if (type === 'GAMMA_40HZ') {
        // Dual sine wave creating a 40Hz beating rhythm (160Hz and 200Hz)
        const oscLeft = this.ctx.createOscillator();
        const oscRight = this.ctx.createOscillator();

        oscLeft.type = 'sine';
        oscLeft.frequency.setValueAtTime(160, this.ctx.currentTime);

        oscRight.type = 'sine';
        oscRight.frequency.setValueAtTime(200, this.ctx.currentTime);

        oscLeft.connect(this.gainNode);
        oscRight.connect(this.gainNode);

        oscLeft.start();
        oscRight.start();

        this.currentOscillator = [oscLeft, oscRight];
      } else {
        // Brown noise synthesis using white noise filtered integration
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(this.gainNode);
        whiteNoise.start();

        this.currentNoiseNode = whiteNoise;
      }

      this.isPlaying = true;
    } catch (e) {
      console.warn('Ambient sound could not be initialized:', e);
    }
  }

  stopAmbient() {
    try {
      if (this.currentOscillator) {
        if (Array.isArray(this.currentOscillator)) {
          this.currentOscillator.forEach(o => o.stop());
        } else {
          this.currentOscillator.stop();
        }
        this.currentOscillator = null;
      }
      if (this.currentNoiseNode) {
        this.currentNoiseNode.stop();
        this.currentNoiseNode = null;
      }
      this.isPlaying = false;
    } catch (e) {}
  }
}

export const soundManager = new AudioEngine();

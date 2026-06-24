export default class AudioInputSystem {
  constructor(scene) {
    this.scene = scene;
    this.audioContext = null;
    this.mediaStream = null;
    this.analyser = null;
    this.microphone = null;
    this.dataArray = null;
    this.currentLevel = 0;
    this.smoothedLevel = 0;
    this.smoothingFactor = 0.8;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();

      console.log('🎵 AudioContext criado');

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      console.log('🎤 Microfone acessado');

      this.microphone = this.audioContext.createMediaStreamAudioSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();

      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      this.microphone.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.isInitialized = true;
      this.analyzeAudio();

      console.log('✓ AudioInputSystem inicializado');
    } catch (error) {
      console.error('Erro ao inicializar AudioInputSystem:', error);
      throw error;
    }
  }

  analyzeAudio = () => {
    if (!this.isInitialized) return;

    requestAnimationFrame(this.analyzeAudio);

    if (!this.analyser) return;

    this.analyser.getByteFrequencyData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = this.dataArray[i] / 255;
      sum += normalized * normalized;
    }

    const rms = Math.sqrt(sum / this.dataArray.length);
    this.currentLevel = Math.min(rms * 3, 1);

    this.smoothedLevel =
      this.smoothingFactor * this.smoothedLevel +
      (1 - this.smoothingFactor) * this.currentLevel;
  };

  getCurrentLevel() {
    return this.smoothedLevel;
  }

  getRawLevel() {
    return this.currentLevel;
  }

  getFrequencyData() {
    return this.dataArray;
  }

  stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      console.log('🔇 Microfone desativado');
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      console.log('✓ AudioContext fechado');
    }

    this.isInitialized = false;
  }

  destroy() {
    this.stop();
    this.mediaStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.dataArray = null;
  }
}
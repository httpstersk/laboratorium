class MicAnalyser {
  constructor() {
    this.analyser = null;
  }

  async init() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);

    this.analyser = context.createAnalyser();
    const data = new Float32Array(this.analyser.fftSize);
    source.connect(this.analyser);

    const analyze = () => {
      this.analyser.getFloatTimeDomainData(data);
      const samples = [...data].map(Math.abs);
      const power = samples.reduce((x, y) => x + y, 0) / samples.length;
      const { style } = document.body;
      style.setProperty('--scale', 1 + power * 10);
      style.setProperty('--skew', power * 100);
      requestAnimationFrame(analyze);
    };

    requestAnimationFrame(analyze);
  }
}

(async function run() {
  const audio = new MicAnalyser();
  await audio.init();
})();
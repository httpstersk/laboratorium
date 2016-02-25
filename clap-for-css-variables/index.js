(function() {
  'use strict';

  const context = new AudioContext();

  let random = (function() {
    let seed = 0xCBABCDEF;
    return () =>  (seed = (seed * 16807) % 2147483647) / 2147483647.0;
  })();

  const noiseBuffer = (function() {
    let buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    let data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = random() * 2.0 - 1.0;
    }

    return buffer;
  })();

  const noise = (function() {
    let source;
    source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    return source;
  })();

  const bandpass = context.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.Q.value = 4.0;
  bandpass.frequency.value = 1000.0;

  const highpass = context.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.Q.value = 1.0;
  highpass.frequency.value = 1000.0;

  const mainEnvelope = context.createGain();
  const clapEnvelope = context.createGain();
  const clapGain = context.createGain();
  clapGain.gain.value = 15.0;

  noise.start();
  noise.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(clapEnvelope);
  clapEnvelope.connect(mainEnvelope);
  mainEnvelope.connect(clapGain);
  mainEnvelope.gain.value = 0;
  clapGain.connect(context.destination);

  const clap = (time) => {
    let t = time;

    for (let i = 0; i < 3; i++) {
      let r = (Math.random() - Math.random()) * 0.001;
      clapEnvelope.gain.setValueAtTime(1.0, t);
      clapEnvelope.gain.linearRampToValueAtTime(0.0, t += 0.010 + i * 0.001 + r);
    }

    clapEnvelope.gain.setValueAtTime(1.0, t);
    mainEnvelope.gain.setValueAtTime(1.0, t);
    mainEnvelope.gain.setTargetAtTime(0.0, t, 0.075);
  };

  const button = document.querySelector('button');
  button.addEventListener('click', (event) => clap(context.currentTime));
}());

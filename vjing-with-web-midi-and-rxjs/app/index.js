import Rx from 'rx';
import { midimessageAsObservable, statechangeAsObservable } from '../lib/rxjs-web-midi';

function parseEvent(event) {
  return {
    status: event.data[0] & 0xf0,
    data: [
      event.data[1],
      event.data[2]
    ]
  };
}

function msToBpm(ms) {
  return Math.round(60000 / ms);
}

const input$ = Rx.Observable.fromPromise(navigator.requestMIDIAccess())
  .map(midi => midi.inputs.values().next().value)
  .flatMap(input => midimessageAsObservable(input))
  .map(message => parseEvent(message));

input$.subscribe(message => console.log(message));

const scaleEffect = (function() {
  const fps = 100;
  let phase = 0;
  let bpm = 100;

  setInterval(() => {
    const scale = Math.sin(phase) * 0.25 + 1.1;
    document.querySelector('.ball').style.transform = `scale(${scale})`;
    phase += Math.PI * 2 / fps * bpm / 60;
  }, 1000 / fps);

  return {
    setBpm: function(x) {
      bpm = x;
    }
  };
}());

const noteOnEvent = 144;
const firstPadNote = 47;
const controlEvent = 176;
const firstKnobIndex = 28;

const pad$ = input$
  .filter(x => x.status === noteOnEvent)
  .filter(x => x.data[0] === firstPadNote);

const control$ = input$
  .filter(x => x.status === controlEvent)
  .filter(x => x.data[0] === firstKnobIndex);

const tapTempo$ = pad$
  .timeInterval()
  .skip(1)
  .map(x => msToBpm(x.interval))
  .filter(x => x > 40);

const knobTempo$ = control$
  .map(x => x.data[1])
  .map(x => Math.round(x / 127 * 200));

const tempo$ = tapTempo$.merge(knobTempo$);

tempo$.subscribe(bpm => {
  scaleEffect.setBpm(bpm);
});

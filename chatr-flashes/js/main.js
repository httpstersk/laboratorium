import Cycle from '@cycle/core';
import {Observable} from 'rx';
import {div, makeDOMDriver} from '@cycle/dom';
import axios from 'axios';

const url = 'https://chatr.tv/api/flashes/0';
const p = axios.get(url);

const flash$ = Rx.Observable
  .interval(1000)
  .flatMap(() => Rx.Observable.fromPromise(p))
  .map(x => x.data)

function main(sources) {
  const sinks = {
    DOM: flash$
      .map(state =>
        div('.flash', [
          div('.flash-question', JSON.stringify(state.flash.text)),
          div('.flash-results', [
            div({
              style: {
                backgroundColor: '#bada55',
                height: JSON.stringify(state.choice_a_percent) + 'vh'
              }
            }, JSON.stringify(state.choice_a_percent)),
            div({
              style: {
                backgroundColor: '#bebebe',
                height: JSON.stringify(state.choice_b_percent) + 'vh'
              }
            }, JSON.stringify(state.choice_b_percent))
          ])
        ]))
  };

  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers);

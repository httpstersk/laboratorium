import Cycle from '@cycle/core';
import {Observable} from 'rx';
import {div, makeDOMDriver} from '@cycle/dom';
import axios from 'axios';

const url = 'https://chatr.tv/api/flashes/0';
const p = axios.get(url);

function main(sources) {
  const flash$ = Rx.Observable
    .interval(1000)
    .flatMap(() => Rx.Observable.fromPromise(p))
    .filter(response => response.status === 200)
    .map(res => res.data)

  const sinks = {
    DOM: flash$
      .map(state =>
        div('.⚡', [
          div('.🔥', [
            div('.💬', state.flash.text)
          ]),
          div('.↕', [
            div('.👍', {
              style: {
                height: (state.choice_a_percent === 0 && state.choice_b_percent === 0 ? 50 : state.choice_a_percent) + 'vh'
              }
            }, [
              div(state.flash.choice_a),
              div('.🎈', state.choice_a_percent + '%')
            ]),
            div('.👎', {
              style: {
                height: (state.choice_a_percent === 0 && state.choice_b_percent === 0 ? 50 : state.choice_b_percent) + 'vh'
              }
            }, [
              div(state.flash.choice_b),
              div('.🎈', state.choice_b_percent + '%')
            ])
          ])
        ]))
  };

  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers);

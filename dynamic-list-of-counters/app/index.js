import '../../style.css';

import {Observable} from 'rx';
import { run } from '@cycle/core';
import { makeDOMDriver, div, p, hr, button } from '@cycle/dom';
import isolate from '@cycle/isolate';
import combineLatestObj from 'rx-combine-latest-obj';

function internalCounter(sources) {
  let action$ = Observable.merge(
    sources.DOM.select('.decrement').events('click').map(ev => -1),
    sources.DOM.select('.increment').events('click').map(ev => +1)
  );
  let count$ = action$
    .startWith(0)
    .shareReplay()
    .scan((x, y) => x + y);

  return {
    DOM: count$.
      map(count =>
        div('.counter', [
          button('.decrement', '-'),
          button('.increment', '+'),
          p(`Counter: ${count}`)
        ])
      ),
    count$
  };
}

function counter(sources) {
  return isolate(internalCounter)(sources);
}

function intent(sources) {
  return {
    addCounter$: sources.DOM.select('.add').events('click')
      .map(() => counter(sources)),
    removeCounter$: sources.DOM.select('.remove').events('click')
      .map(() => parseInt(event.target.value))
  };
}

function model({addCounter$, removeCounter$}) {
  const counters$ = Observable
    .merge(addCounter$
      .map(ctr$ => ctr$s => [...ctr$s, ctr$])
    )
    .merge(removeCounter$
      .map(index => ctr$s => ctr$s.filter((_, i) => index !== i))
    )
    .startWith([])
    .scan((ctrs$, callback) => callback(ctrs$))
    .share();

    const count$ = counters$
      .flatMapLatest(ctrs => Observable
        .combineLatest(ctrs.map(c => c.count$))
        .map(arr => arr.reduce((p, c) => p + c, 0)))
      .startWith(0);

    return {
      counters$,
      count$
    };
}

function view({counters$, count$}) {
  return counters$
    .combineLatest(count$, (counters, count) => {
      return div('.counter-list', [
        button('.add', '+'),
        div('.counters', [
          counters.map(
            (counter, index) => div('.counter-list-item', [
              counter.DOM,
              button('.remove', {attributes: {value: index}}, '-'),
              hr()
            ])
          )
        ]),
        p(`Total count: ${count}`)
      ])
    });
}

function counterList(sources) {
  const vtree$ = view(model(intent(sources)));

  return {
    DOM: vtree$
  };
}

function main({DOM}) {
  return {
    DOM: view(model(intent({DOM})))
  };
}

const drivers = {
  DOM: makeDOMDriver('#app')
};

run(main, drivers);

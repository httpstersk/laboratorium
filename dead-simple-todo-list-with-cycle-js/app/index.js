import '../../style.css';

import Rx from 'rx';
import { run } from '@cycle/core';
import { makeDOMDriver, div, input, button, span, ul, li } from '@cycle/dom';

function intent({DOM}) {
  return {
    addTodo: DOM.select('.input').events('change')
      .map(event => event.target.value)
      .filter(val => val.trim().length),
    removeTodo: DOM.select('.button').events('click')
      .map(event => event.target.previousElementSibling.innerText.trim())
  };
}

const operations = {
  ADD_ITEM: (newItem) => state => ({
    items: state.items.concat(newItem)
  }),
  REMOVE_ITEM: (itemToRemove) => state => ({
    items: state.items.filter(item => item !== itemToRemove)
  })
};

function model(intents) {
  const addOperations$ = intents.addTodo
    .map(item => operations.ADD_ITEM(item));

  const removeOperations$ = intents.removeTodo
    .map(item => operations.REMOVE_ITEM(item));

  const allOperations$ = Rx.Observable.merge(addOperations$, removeOperations$);

  const state$ = allOperations$
    .scan((state, operation) => operation(state), { items: [] });

  return state$;
}

function view(state$) {
  return state$
    .startWith({ items: [] })
    .map(state => div('.container', [
      div('.form', [
        input('.input', {type: 'text', value: ''}),
      ]),
      ul('.todos', state.items.map(todo =>
        li('.todo', [
          span('.item', todo),
          button('.button', 'x')
        ])
      ))
    ]));
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

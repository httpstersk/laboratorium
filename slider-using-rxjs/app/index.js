import '../../style.css';

import Rx from 'rx';

let images = [...document.querySelectorAll('img')];
const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');
const MAX_LENGTH = images.length - 2;

const rightClickSource = Rx.Observable
    .fromEvent(rightArrow, 'click')
    .map(e => 1);

const leftClickSource = Rx.Observable
    .fromEvent(leftArrow, 'click')
    .map(e => -1);

const arrowKeysSource = Rx.Observable
    .fromEvent(document, 'keyup')
    .filter(e => e.keyCode === 37 || e.keyCode === 39)
    .map(e => (e.keyCode === 39 ? 1 : -1));

const source = Rx.Observable
    .merge(rightClickSource, leftClickSource, arrowKeysSource)
    .scan((acc, curr) => {
            let next = acc + curr;
            next = (next < MAX_LENGTH ? next : MAX_LENGTH - 1)
            next = (next > -1 ? next : 0);
            return next;
        }, 0)
    .startWith(0);

source.subscribe((next) => {
    changeImages(next);
    activateArrows(next);
});

function changeImages(index) {
    images
        .filter(i => !i.classList.contains('hide')).forEach(hide);

    show(images[index]);
    show(images[index + 1]);
    show(images[index + 2]);
}

function activateArrows(index) {
    activate(leftArrow, (index > 0));
    activate(rightArrow, (index < MAX_LENGTH - 1));
}

function activate(arrow, condition) {
    if (condition) {
        arrow.removeAttribute('disabled');
    } else {
        arrow.setAttribute('disabled', true);
    }
}

function hide(element) {
    element.classList.add('hide');
}

function show(element) {
    element.classList.remove('hide');
}

const isObject = object => Object(object) === object;

const duplicate = object => JSON.parse(JSON.stringify(object));

const immutable = object => {
    Object.values(object).filter(isObject).forEach(immutable);
    return Object.freeze(object);
};

const encapsulate = component => component.attachShadow({ mode: 'open' });

const fire = (target = document.body, eventName, eventData = {}) => {
    target.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail: eventData
    }));
};

const countdown = (end) => {
    const deadline = new Date(end).getTime() + 24 * 60 * 60 * 1000;

    function getRemainingTime(deadline) {
        const now = new Date().getTime();
        return deadline - now;
    }

    function tick() {
        const remaining = getRemainingTime(deadline);
        const minutes = Math.floor((remaining / (60 * 1000)));
        console.log(minutes);
        if (remaining >= 0) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
};

export { immutable, encapsulate, fire, countdown };
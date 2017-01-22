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

const countdown = (end, callback) => {
    const deadline = new Date(end).getTime();

    function getRemainingTime(deadline) {
        const now = new Date().getTime();
        return deadline - now;
    }

    function tick() {
        const remaining = getRemainingTime(deadline);
        const minutes = Math.floor((remaining / (60 * 1000)));

        if (remaining < 0) {
            callback();
            return;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
};

export { immutable, encapsulate, fire, countdown };
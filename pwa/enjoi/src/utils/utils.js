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
    return new Promise((resolve, reject) => {
        const deadline = new Date(end).getTime();

        const tick = () => {
            const now = new Date().getTime();
            const remaining = deadline - now;

            if (remaining < 0) return;

            const minutes = Math.floor((remaining / (60 * 1000)));
            console.log('⏰ Minutes →', minutes);

            if (minutes === 0) {
                resolve();
                return;
            }

            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
};

export { immutable, encapsulate, fire, countdown };
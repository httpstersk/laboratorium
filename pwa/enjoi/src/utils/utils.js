const isObject = object => Object(object) === object;

const duplicate = object => JSON.parse(JSON.stringify(object));

const immutable = object => {
    Object.values(object).filter(isObject).forEach(immutable);
    return Object.freeze(object);
};

const encapsulate = component => component.attachShadow({ mode: 'open' });

const fire = (eventName, eventData = {}, target = document.body) => {
    target.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail: eventData
    }));
};

export { immutable, encapsulate, fire };
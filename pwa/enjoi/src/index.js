'use strict';

import 'document-register-element';
import './elements/elements';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('👏 ServiceWorker succesfully registered!'))
        .catch(error => console.warn('💩 ServiceWorker registration failed!', error));
}
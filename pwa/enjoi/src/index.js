'use strict';

import 'document-register-element';
import { EmojiElement } from './elements/emoji-element/emoji-element.js';

customElements.define('enjoi-app', EmojiElement);
document.getElementById('app').appendChild(new EmojiElement());
(function() {
    "use strict";

    class WebComponent extends HTMLElement {
        constructor ({ debug: false, template } = {}) {
            super();

            this._debug = debug;
            this.logDebug('WebComponent: Debug enabled');

            // Bind the component's template to this instance
            if (template) this.bindTemplate(template);

			// -----------------
			// Shorthand Methods
			// -----------------

            this.on = this.addEventListener;
        }

		// --------------
		// Static Methods
		// --------------

		// Finish the setup of a new WC. This includes registering the component with
		// the DOM and setting static properties on the prototype required by the
		// WebComponent constructor.
		//
		// * _doc - The document object that imported this WC
		// * _import - The document that contains the template

        static setup (tag, Component) {
            const proto = Component.prototype;
            proto._doc = document;
            proto._import = proto._doc.currentScript.ownerDocument;

            // Register the element
            customElements.define(tag, Component);
        }

		// -----------------
		// Prototype Methods
		// -----------------

        logDebug (...args) {
            if (this._debug) console.log(...args);
        }

        listen (type, cb) {
            return document.addEventListener(type, cb);
        }

        bindTemplate (id) {
            // Create an open component when in debug mode
            const shadowOpts = {
                mode: this._debug ? 'open' : 'closed'
            };

			// `attachShadow` implicitly creates `this.shadowRoot`, but that's 
			// inaccessible in closed mode.
            this._root = this.attachShadow(shadowOpts);
            const template = this._import.getElementById(id);
            const instance = template.content.cloneNode(true);

            this._root.appendChild(instance);
            this.logDebug(`${this.constructor.name}.bindTemplate: Bound template to shadow root`);
        }

		// -------------------
		// Lifecycle callbacks
		// -------------------

        attributeChangedCallback (attrName, oldVal, newVal) {
            this.logDebug('WebComponent:attributeChangedCallback');
        }

        adoptedCallback (oldDocument, document) {
            this.logDebug('WebComponent:adoptedCallback');
        }

        disconnectedCallback () {
            this.logDebug('WebComponent:disconnectedCallback');
        }

        connectedCallback () {
            this.logDebug('WebComponent:connectedCallback');
        }
    }

    window.WebComponent = WebComponent;
})();
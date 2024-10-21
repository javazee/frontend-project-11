import Model from "./model.js";
import View from "./view.js";
import onChange from 'on-change';

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    initListeners() {
        this.view.bindInputEventListener('submit', this.onInputChanged.bind(this));
        return this;
    }

    initRendering() {
        this.model.setRenderCallback(this.view.render.bind(this.view));
        return this;
    }

    initRssObserving() {
        const observeRss = this.model.observeRss.bind(this.model);
        setTimeout(function repeate() {
            observeRss();
            setTimeout(repeate, 5000)
        } , 5000);
        return this;
    }

    onInputChanged (event) {
        event.preventDefault(event);
        const { value } = event.target[0];
        this.model.handleInput(value);
    }
}

export default Controller;
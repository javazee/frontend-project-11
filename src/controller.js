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
        this.view.bindPostOpenListener(this.onViewPost);
        this.view.bindPostCloseListener(this.onClosePost);
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

    onViewPost = (postId) => (event) => {
        event.preventDefault();
        this.model.handlePostReadEvent(postId)
    }

    onClosePost = (postId) => (event) => {
        event.preventDefault();
        this.model.handlePostCloseEvent(postId)
    }
}

export default Controller;
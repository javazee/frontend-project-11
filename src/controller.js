import Model from "./model.js";
import View from "./view.js";

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    initListeners() {
        this.view.addInputEventListener('submit', this.model.onInputChanged.bind(this.model));
        return this;
    }

    initRendering() {
        this.model.setInputRenderCallback(this.view.renderInput.bind(this.view));
        return this;
    }
}

export default Controller;
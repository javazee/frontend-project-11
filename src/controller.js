

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.bindInputChanged();
    }

    bindInputChanged() {
        this.view.bindOnInputChanged(this.model.onInputChanged);
    }
}
export default class View {
    constructor() {
        this.input = document.querySelector('#url-input');
        this.button = document.querySelector('.col-auto [aria-label=add]');

        this.initListeners();
    }

    bindOnInputChanged(callback) {
        this.onInputChanged = callback;
    }


    initListeners() {
        this.input.addEventListener('change', this.onInputChanged);
    }
}





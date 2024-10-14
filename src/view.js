export default class View {
    constructor() {
        this.input = document.querySelector('#url-input');
        this.button = document.querySelector('.col-auto [aria-label=add]');
        this.textDangerParagraph = document.querySelector('.text-danger');
        this.form = document.querySelector('.rss-form');
    }

    addInputEventListener(action, listener) {
        this.form.addEventListener(action, listener);
    }

    renderInput = (state) => (path, value, prev) =>  {
        if (state.input.isValid) {
            console.log('adding new feeds');
            this.input.classList.remove('is-invalid');
            this.textDangerParagraph.textContent = null;
            this.form.reset();
        } else {
            console.log(`is invalid input: ${state.input.error}`);
            this.input.classList.add('is-invalid');
            this.textDangerParagraph.textContent = state.input.error;
        }
    }
}





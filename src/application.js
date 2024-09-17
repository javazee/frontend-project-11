import * as yup from 'yup';
import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';

const schema = yup.object().shape({
    url: yup.string().url()
});

const render = (path, value) => {

}

const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return keyBy(e.inner, 'path');
    }
  };

 export default () => {
    const elements = {
        input: document.querySelector('#url-input'),
        button: document.querySelector('.col-auto [aria-label=add]')
    }

    const state = {
        inputProcess: {
            state: 'empty',// filling, filled
            error: {}
        },
        input: {
            isValid: true,
            error: {},
            value: ''
        }
     } 

    const watchedState = onChange(state, render);

    elements.input.addEventListener('change', (event) => {
        const { value } = e.target;
        state.input.value = value;
        const error = validate(state.input.value);
        state.input.error = error;
        state.input.isValid = isEmpty(error);
    })
 }
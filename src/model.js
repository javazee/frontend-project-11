import * as yup from 'yup';
import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';

const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return keyBy(e.inner, 'path');
    }
  };

export default class Model {
    constructor() {
        this.state = {

        }

        this.watchedState = onChange(this.state, this.render);
    }

    onInputChanged (event) {
        const { value } = e.target;
        state.input.value = value;
        const error = validate(state.input.value);
        state.input.error = error;
        state.input.isValid = isEmpty(error);
    }
}

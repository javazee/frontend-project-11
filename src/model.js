import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18n from 'i18next';

const schema = yup.string().url();

export default class Model {
    constructor() {
      this.state = {
        input: {
          value: '',
          error: null,
          isValid: true,
          currentFeeds: []
        },
      }
    }

    validate(url) {
      try {
        schema.validateSync(url, { abortEarly: false });
        if (this.state.input.currentFeeds.includes(url)) {
          return i18n.t('input.duplicate');
        };
        return null;
      } catch (e) {
        return i18n.t('input.invalid');
      }
    }

    setInputRenderCallback(renderCallback) {
      console.log(renderCallback);
      this.watchedState = onChange(this.state, renderCallback(this.state));
    }

    onInputChanged (event) {
      event.preventDefault(event);
      const { value } = event.target[0];
      this.watchedState.input.value = value;
      const error = this.validate(value);
      this.watchedState.input.error = error;
      this.watchedState.input.isValid = _.isEmpty(error);
      if (_.isEmpty(error)) {
        this.watchedState.input.currentFeeds.push(value);
      }
    }
}

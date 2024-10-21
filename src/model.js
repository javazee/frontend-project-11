import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18n from 'i18next';
import parseRssDom from './rss-parser.js';
import getFeeds from './rss-loader.js';

const schema = yup.string().url();

export default class Model {
    constructor() {
      this.state = {
        input: {
          value: '',
          error: null,
          isValid: true
        },
        feeds: {}
      }
    }

    observeRss() {
      Object.keys(this.state.feeds).forEach(url => {
        getFeeds(url, this.onRssResponse.bind(this), this.onError.bind(this));
      });
    }

    onError(error) {
      console.log(error);
      this.watchedState.input.error = error
    }

    onRssResponse(response, url) {
      const xmlBody = response.data.contents;
      const recievedRssFeeds = parseRssDom(xmlBody);
      const savedRssFeeds = this.state.feeds[url];
      if (savedRssFeeds === null || savedRssFeeds === undefined) {
        this.watchedState.feeds[url] = recievedRssFeeds;
      } else {
        this.watchedState.feeds[url].posts = { ...recievedRssFeeds.posts, ...savedRssFeeds.posts }
      }
    }

    setRenderCallback(renderCallback) {
      this.watchedState = onChange(this.state, renderCallback(this.state));
    }

    validate(url) {
      try {
        schema.validateSync(url, { abortEarly: false });
        if (_.has(this.state.feeds, url)) {
          return i18n.t('input.duplicate');
        };
        return null;
      } catch (e) {
        return i18n.t('input.invalid');
      }
    }

    handleInput (url) {
      this.watchedState.input.value = url;
      const errorDesc = this.validate(url);
      if (_.isEmpty(errorDesc)) {
        getFeeds(url, this.onRssResponse.bind(this), this.onError.bind(this));
      }
      this.watchedState.input.error = errorDesc;
    }
}

import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18n from 'i18next';
import axios from 'axios';

const schema = yup.string().url();
const parser = new DOMParser();

const parseRssDom = (text) => {
  try {
  const rssDom = parser.parseFromString(text, 'text/xml');
  const posts = [...rssDom.querySelectorAll("item")].map(el => {
    return {
      title: el.querySelector("title").textContent,
      link: el.querySelector("link").textContent,
      pubDate: el.querySelector("pubDate").textContent,
      description: el.querySelector("description").textContent
    }
  });
  return {
    title: rssDom.querySelector("title").textContent,
    description: rssDom.querySelector("description").textContent,
    isShown: false,
    posts
  }
} catch(error) {
  throw new Error(i18n.t('parsingError'));
}

}

const getFeeds = (url, onResponse, onError) => {
  const proxyurl = `https://allorigins.hexlet.app/get?disableCache=true&url=${url}` 
  axios.get(proxyurl)
  .then(response => response.data.contents)
  .then(parseRssDom)
  .then(onResponse)
  .catch(onError);
}

export default class Model {
    constructor() {
      this.state = {
        input: {
          value: '',
          error: null,
          isValid: true
        },
        currentFeeds: [],
        feeds: []
      }
    }

    validate(url) {
      try {
        schema.validateSync(url, { abortEarly: false });
        if (this.state.currentFeeds.includes(url)) {
          return i18n.t('input.duplicate');
        };
        return null;
      } catch (e) {
        return i18n.t('input.invalid');
      }
    }

    setRenderCallback(renderCallback) {
      console.log(renderCallback);
      this.watchedState = onChange(this.state, renderCallback(this.state));
    }

    handleInput (url) {
      this.watchedState.input.value = url;
      const errorDesc = this.validate(url);
      if (_.isEmpty(errorDesc)) {
        this.watchedState.currentFeeds.push(url);
        getFeeds(url, (feeds => this.watchedState.feeds.push(feeds)), (error) => errorDesc = error.message);
      }
      this.watchedState.input.error = errorDesc;
      this.watchedState.input.isValid = _.isEmpty(errorDesc);
    }
}

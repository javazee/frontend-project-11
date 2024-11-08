import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import i18n from 'i18next';
import isNetworkError from 'is-network-error';
import parseRssDom from './rss-parser.js';
import getFeeds from './rss-loader.js';

const schema = yup.string().url();

const validate = (url, addedFeeds) => {
  try {
    schema.validateSync(url, { abortEarly: false });
    if (_.has(addedFeeds, url)) {
      return i18n.t('input.duplicate');
    }
    return null;
  } catch (e) {
    return i18n.t('input.invalid');
  }
};

export default class Model {
  constructor() {
    this.state = {
      currentState: 'stable',
      lastOpenedPost: null,
      input: {
        value: '',
        error: null,
        isValid: true,
      },
      feeds: {},
      posts: [],
    };
  }

  observeRss() {
    Object.keys(this.state.feeds).forEach((url) => {
      getFeeds(url, this.onObserveRssResponse.call(this, url), this.onError.bind(this));
    });
  }

  onError(error) {
    if (error.name === 'NetworkError' || error.message === 'Network Error' || isNetworkError(error)) {
      this.watchedState.input.error = i18n.t('errors.networkError');
    } else {
      this.watchedState.input.error = error.message;
    }
    this.watchedState.currentState = 'input-error';
  }

  onAddFeedResponse = (url) => (response) => {
    const xmlBody = response.data.contents;
    const [feeds, posts] = parseRssDom(xmlBody);
    this.watchedState.feeds[url] = feeds;
    this.watchedState.posts = [...this.state.posts, ...posts];
    this.watchedState.currentState = 'add-feed';
  };

  onObserveRssResponse = (url) => (response) => {
    const xmlBody = response.data.contents;
    const recievedData = parseRssDom(xmlBody);
    const savedRssFeed = this.state.feeds[url];
    const currentTitlePostForFeed = this.state.posts
      .filter((post) => post.feed === savedRssFeed.title)
      .map((post) => post.title);
    const recievedPosts = recievedData[1];
    const newPosts = recievedPosts.filter(({ title }) => !currentTitlePostForFeed.includes(title));
    if (newPosts.length > 0) {
      this.watchedState.posts = [...this.state.posts, ...newPosts];
      this.watchedState.currentState = 'add-posts';
    } else {
      this.watchedState.currentState = 'stable';
    }
  };

  onChangeRender(renderCallback) {
    this.watchedState = onChange(this.state, renderCallback(this.state));
  }

  handleInput(url) {
    this.watchedState.input.value = url;
    const errorDesc = validate(url, this.state.feeds);
    this.watchedState.input.error = errorDesc;
    if (_.isEmpty(errorDesc)) {
      getFeeds(url, this.onAddFeedResponse.call(this, url), this.onError.bind(this));
    } else {
      this.watchedState.currentState = 'input-error';
    }
  }

  handlePostReadEvent(postId) {
    this.watchedState.posts.find((post) => post.id === postId).status = 'read';
    this.watchedState.lastOpenedPost = postId;
    this.watchedState.currentState = 'post-open';
  }

  handlePostClickEvent(postId) {
    this.watchedState.posts.find((post) => post.id === postId).status = 'read';
    this.watchedState.lastOpenedPost = postId;
    this.watchedState.currentState = 'post-click';
  }
}

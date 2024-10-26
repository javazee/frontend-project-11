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
        currentState: 'stable', //new-feed, new-posts, post-open, post-close, stable, input
        lastOpenedPost: null,
        input: {
          value: '',
          error: null,
          isValid: true
        },
        feeds: {},
        posts: []
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
      const recievedData = parseRssDom(xmlBody);
      const savedRssFeed = this.state.feeds[url];
      if (!savedRssFeed) {
        this.watchedState.feeds[url] = recievedData[0];
        this.watchedState.posts = [...this.state.posts, recievedData[1]];
        this.watchedState.currentState = 'new-feed';
      } else {
        const recievedPosts = recievedData[1];
        const currentTitlePostForFeed = this.state.posts.filter(post => post.feed === savedRssFeed.title).map(post => post.title);
        const newPosts = recievedPosts.filter(({ title }) => !currentTitlePostForFeed.includes(title)); 
        if (newPosts.length > 0) {
          this.watchedState.posts = [ ...this.state.posts, ...newPosts ];
          this.watchedState.currentState = 'new-posts';
        } else {
          this.watchedState.currentState = 'stable';
        }
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
      this.watchedState.input.error = errorDesc;
      this.watchedState.currentEvent = 'input';
      if (_.isEmpty(errorDesc)) {
        getFeeds(url, this.onRssResponse.bind(this), this.onError.bind(this));
      }
    }

    handlePostReadEvent (postId) {
      this.watchedState.posts.find(post => post.id === postId).status = 'read';
      this.watchedState.lastOpenedPost = postId;
      this.watchedState.currentState = 'post-open';
    }

    handlePostCloseEvent () {
      this.watchedState.currentState = 'post-close';
    }
}

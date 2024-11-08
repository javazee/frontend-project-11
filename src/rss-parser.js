import i18n from 'i18next';

const parser = new DOMParser();

const parsePost = (el, feedTitle) => {
  return {
    id: _.uniqueId(),
    feed: feedTitle,
    title: el.querySelector("title").textContent,
    link: el.querySelector("link").textContent,
    pubDate: el.querySelector("pubDate").textContent,
    description: el.querySelector("description").textContent,
    status: 'new'
  }
}

const parse = (text) => {
    try {
        const rssDom = parser.parseFromString(text, 'application/xml');
        const feedTitle = rssDom.querySelector("title").textContent;
        const posts = [...rssDom.querySelectorAll("item")].reduce((agg, el) => [...agg, parsePost(el, feedTitle)], []).sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
        const feed = {
          id: _.uniqueId(),
          title: feedTitle,
          description: rssDom.querySelector("description").textContent,
          status: 'new'
        }
        return [feed, posts];
      } catch(error) {
        throw new Error(i18n.t('errors.parsingRssError'));
      }
}

export default parse;
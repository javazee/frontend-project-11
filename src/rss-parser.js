import i18n from 'i18next';

const parser = new DOMParser();

const parse = (text) => {
    try {
        const rssDom = parser.parseFromString(text, 'text/xml');
        const posts = [...rssDom.querySelectorAll("item")].reduce((agg, el) => {
          const key = el.querySelector("title").textContent;
          agg[key] = {
              title: key,
              link: el.querySelector("link").textContent,
              pubDate: el.querySelector("pubDate").textContent,
              description: el.querySelector("description").textContent,
              status: 'new'
            };
            return agg;
        });
        return {
          title: rssDom.querySelector("title").textContent,
          description: rssDom.querySelector("description").textContent,
          status: 'new',
          posts: posts
        }
      } catch(error) {
        throw new Error(i18n.t('parsingRssError'));
      }
}

export default parse;
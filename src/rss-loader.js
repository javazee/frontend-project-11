import axios from 'axios';

const getFeeds = (url, onResponse, onError) => {
  const proxyurl = `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
  axios.get(proxyurl)
    .then(onResponse)
    .catch(onError);
};

export default getFeeds;

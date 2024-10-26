import _ from 'lodash';
import i18n from 'i18next';

export default class View {
    constructor() {
        this.input = document.querySelector('#url-input');
        this.button = document.querySelector('.col-auto [aria-label=add]');
        this.textDangerParagraph = document.querySelector('.text-danger');
        this.form = document.querySelector('.rss-form');
        this.feeds = document.querySelector('.feeds');
        this.posts = document.querySelector('.posts');
        this.modal = document.querySelector('.modal');
    }

    bindInputEventListener(action, listener) {
        this.form.addEventListener(action, listener);
    }

    bindPostOpenListener(listener) {
        this.onViewPost = listener;
    }

    bindPostCloseListener(listener) {
        this.onClosePost = listener;
    }

    renderInput = (state) => {
        if (!state.input.error) {
            this.input.classList.remove('is-invalid');
            this.textDangerParagraph.textContent = i18n.t('input.valid');
            this.form.reset();
        } else {
            this.input.classList.add('is-invalid');
            this.textDangerParagraph.textContent = state.input.error;
        }
    }

    renderFeedColumn = (state) => {
        if (state.feeds.length !== 0) {
            if (!this.feeds.hasChildNodes()) {
                const feedsContainer = document.createElement('div');
                feedsContainer.classList.add('card', 'border-0');
                const feedTitleContainer = document.createElement('div');
                feedTitleContainer.classList.add(['card-body']);
                const feedTitle = document.createElement('h2');
                feedTitle.classList.add('card-title', 'h4');
                feedTitle.textContent = 'Фиды';
                const feedList = document.createElement('ul');
                feedList.classList.add('list-group', 'border-0', 'rounded-0'); 

                feedsContainer.appendChild(feedTitleContainer);
                feedsContainer.appendChild(feedList);
                feedTitleContainer.appendChild(feedTitle);
                this.feeds.appendChild(feedsContainer);
            }
            const feedList = this.feeds.querySelector('.list-group');
            Object.values(state.feeds)
                .filter(feed => feed.status === 'new')
                .forEach(feed => {
                    const feedContainer = document.createElement('li');
                    feedContainer.classList.add('list-group-item', 'border-0', 'border-end-0');
                    const feedTitle = document.createElement('h3');
                    feedTitle.classList.add('h6', 'm-0');
                    feedTitle.textContent = feed.title;
                    const feedDescription = document.createElement('p');
                    feedDescription.classList.add('m-0', 'small', 'text-black-50');
                    feedDescription.textContent = feed.description;

                    feedContainer.appendChild(feedTitle);
                    feedContainer.appendChild(feedDescription);
                    feedList.appendChild(feedContainer);
                    feed.status = 'attached';
                });
        }


    }

    renderPostColumn = (state) => {
        if (state.posts.length !== 0) {
            if (!this.posts.hasChildNodes()) {
                const postsContainer = document.createElement('div');
                postsContainer.classList.add('card', 'border-0');
                const postTitleContainer = document.createElement('div');
                postTitleContainer.classList.add(['card-body']);
                const postTitle = document.createElement('h2');
                postTitle.classList.add('card-title', 'h4');
                postTitle.textContent = 'Посты';
                const postList = document.createElement('ul');
                postList.classList.add('list-group', 'border-0', 'rounded-0'); 

                postsContainer.appendChild(postTitleContainer);
                postsContainer.appendChild(postList);
                postTitleContainer.appendChild(postTitle);
                this.posts.appendChild(postsContainer);
            }
            const postList = this.posts.querySelector('.list-group');
            state.posts.filter(post => post.status === 'new')
                .forEach(post => {
                    const postContainer = document.createElement('li');
                    postContainer.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
                    const postLink = document.createElement('a');
                    postLink.classList.add('fw-bold');
                    postLink.dataset.id = `title-${post.id}`;
                    postLink.target = '_blank';
                    postLink.rel = 'noopener noreferrer';
                    postLink.textContent = post.title;
                    const postButton = document.createElement('button');
                    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
                    postButton.type = this.button;
                    postButton.dataset.id = _.uniqueId();
                    postButton.dataset.bsToggle = 'modal';
                    postButton.dataset.bsTarget = '#modal';
                    postButton.textContent = 'Просмотр';
                    postButton.addEventListener('click', this.onViewPost(post.id));


                    postContainer.appendChild(postLink);
                    postContainer.appendChild(postButton);
                    postList.prepend(postContainer);
                    post.status = 'attached';
            });
        }
    }

    renderOnPostOpen(state) {
        const postTitle = this.posts.querySelector(`[data-id=title-${state.lastOpenedPost}]`);
        postTitle.classList.replace('fw-bold', 'fw-normal');
        this.modal.classList.add('show');
        const post = state.posts.find( ({ id }) => (state.lastOpenedPost === id));
        const modalTitle = this.modal.querySelector('.modal-title');
        modalTitle.textContent = post.title;
        const modalbody = this.modal.querySelector('.modal-body');
        modalbody.textContent = post.description;

    }

    renderOnPostClose(state) {
        const title = this.posts.querySelector(`[data-id=title-${state.lastOpenedPost}]`);
        title.classList.replace('fw-bold', 'fw-normal');
    }

    render = (state) => (path, value, prev) =>  {
        switch (state.currentState) {
            case 'input':
                this.renderInput(state);
            case 'new-feed':
                this.renderInput(state);
                this.renderFeedColumn(state);
                this.renderPostColumn(state);
                break;
            case 'new-posts':
                this.renderPostColumn(state);
                break;
            case 'post-open':
                this.renderOnPostOpen(state);
                break;
            case 'post-close':
                this.renderOnClosePost(state);
                break;
            case 'stable':
                console.log('do nothing');
                break;
            default:
                throw new Error(`unknown state '${state.currentEvent}'`);

        }
    }
}





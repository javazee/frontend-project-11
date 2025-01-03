class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  start() {
    this.initEventListeners();
    this.initRendering();
    this.initRssObserving();
  }

  initEventListeners() {
    this.view.form.addEventListener('submit', this.onInputChanged.bind(this));
    this.view.bindPostOpenListener(this.onViewPost);
    this.view.bindPostClickListener(this.onClickPost);
  }

  initRendering() {
    this.model.onChangeRender(this.view.render.bind(this.view));
  }

  initRssObserving() {
    const observeRss = this.model.observeRss.bind(this.model);
    setTimeout(function repeate() {
      observeRss();
      setTimeout(repeate, 5000);
    }, 5000);
  }

  onInputChanged(event) {
    event.preventDefault(event);
    const { value } = event.target[0];
    this.model.handleInput(value);
  }

  onViewPost = (postId) => (event) => {
    event.preventDefault();
    this.model.handlePostReadEvent(postId);
  };

  onClickPost = (postId) => () => {
    this.model.handlePostClickEvent(postId);
  };
}

export default Controller;

import AbstractView from '../framework/view/abstract-view.js';

const createFilmsLoadingViewTemplate = () => (
  `<h2 class="films-list__title">
    Loading...
  </h2>`
);

export default class FilmsLoadingView extends AbstractView{

  get template() {
    return createFilmsLoadingViewTemplate();
  }
}

import AbstractView from '../framework/view/abstract-view.js';

const createFilmsEmptyListTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class FilmsEmptyListView extends AbstractView {
  get template() {
    return createFilmsEmptyListTemplate();
  }
}

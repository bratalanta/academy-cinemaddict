import { createElement } from '../render.js';

const createFilmsEmptyListTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class FilmsEmptyListView {
  #element = null;

  get template() {
    return createFilmsEmptyListTemplate;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

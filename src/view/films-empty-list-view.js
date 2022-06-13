import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/filter.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.ALREADYWATCHED]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now'
};

const createFilmsEmptyListTemplate = (currentFilterType) => (
  `<h2 class="films-list__title">${NoFilmsTextType[currentFilterType]}</h2>`
);

export default class FilmsEmptyListView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilmsEmptyListTemplate(this.#currentFilterType);
  }
}

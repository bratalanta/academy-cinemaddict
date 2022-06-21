import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/filter.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, hrefName, count} = filter;

  return `<a
    href="#${hrefName}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-value="${type}">
    ${name === FilterType.ALL ?
    `${name} movies` :
    `${name}
      <span class="main-navigation__item-count" data-value="${type}">
        ${count}
      </span>`}
    </a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
            ${filterItemsTemplate}
         </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor (filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (cb) => {
    this._callback.filterTypeChange = cb;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    const {target} = evt;

    if (target.tagName === 'A' || target.tagName === 'SPAN') {
      evt.preventDefault();
      this._callback.filterTypeChange(target.dataset.value);
    }
  };
}

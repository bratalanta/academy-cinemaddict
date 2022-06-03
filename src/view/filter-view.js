import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypes } from '../utils/filter.js';

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;

  return `<a
    href="#${name.charAt(0).toLowerCase() + name.slice(1)}"
    class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">
     ${name === FilterTypes.ALL ?
    `${name} movies` :
    `${name}
      <span class="main-navigation__item-count">
        ${count}
      </span>`}
  </a>`;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
            ${filterItemsTemplate}
          </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}

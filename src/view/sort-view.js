import AbstractView from '../framework/view/abstract-view.js';

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

// const getSortButtonActiveClassName = (sortType) => sortType

const createSortViewTemplate = () => {
  const res = 'date';
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${res}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
   </ul>`;
};

export default class SortView extends AbstractView {
  get template() {
    return createSortViewTemplate;
  }

  setSortTypeChangeHandler = (cb) => {
    this._callback.sortTypeChange = cb;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    const {target} = evt;
    if (target.tagName !== 'A') {
      return;
    }
    console.log(target)
    evt.preventDefault();
    this._callback.sortTypeChange(target.dataset.sortType);
    console.log(target.dataset.sortType)
  };
}

export {SortType};

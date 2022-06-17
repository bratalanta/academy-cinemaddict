import { UpdateType } from '../const';
import { remove, render, RenderPosition, replace } from '../framework/render';
import { FilterType, filter} from '../utils/filter.js';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        hrefName: 'all',
        count: filter[FilterType.ALL](films).length
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        hrefName: 'watchlist',
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.ALREADYWATCHED,
        name: 'History',
        hrefName: 'history',
        count: filter[FilterType.ALREADYWATCHED](films).length
      },
      {
        type: FilterType.FAVORITE,
        name: 'Favorites',
        hrefName: 'favorites',
        count: filter[FilterType.FAVORITE](films).length
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#onFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #onModelEvent = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {

    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { remove, render } from '../framework/render.js';
import FilmsEmptyListView from '../view/films-empty-list-view.js';
import FilmPresenter from './film-presenter.js';
import { updateItem } from '../utils/common.js';
import SortView, { SortType } from '../view/sort-view.js';
import { sortByDate, sortByRating } from '../utils/sort.js';

const MAX_FILMS_AMOUNT_PER_STEP = 5;

export default class FilmsListPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsEmptyListComponent = new FilmsEmptyListView();
  #sortComponent = new SortView();

  #renderedFilmsAmount = MAX_FILMS_AMOUNT_PER_STEP;
  #films = [];
  #originalOrderedFilms = [];
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #filmsContainer = null;
  #filmsModel = null;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    if (!this.#films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#originalOrderedFilms = [...this.#filmsModel.films];
    this.#renderFilmsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #renderFilmsList = () => {
    this.#renderSort();
    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(MAX_FILMS_AMOUNT_PER_STEP, this.#films.length); i++) {
      this.#renderFilm(this.#films[i], this.#filmsModel.comments);
    }

    if (this.#films.length > MAX_FILMS_AMOUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderNoFilms = () => {
    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsEmptyListComponent, this.#filmsListComponent.element);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
  };

  #renderFilm = (film, comments) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#onFilmControlItemChange, this.#onPopupModeChange);
    filmPresenter.init(film, comments);

    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsAmount = MAX_FILMS_AMOUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortByRating);
        break;
      default:
        this.#films = [...this.#originalOrderedFilms];
    }

    this.#currentSortType = sortType;

    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #onShowMoreButtonClick = () => {
    this.#films.slice(this.#renderedFilmsAmount, this.#renderedFilmsAmount + MAX_FILMS_AMOUNT_PER_STEP)
      .forEach((film) => {
        this.#renderFilm(film, this.#filmsModel.comments);
      });

    this.#renderedFilmsAmount += MAX_FILMS_AMOUNT_PER_STEP;

    if (this.#renderedFilmsAmount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #onFilmControlItemChange = (updatedFilm, comments) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#originalOrderedFilms = updateItem(this.#originalOrderedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, comments);
  };

  #onPopupModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetPopup());
  };
}

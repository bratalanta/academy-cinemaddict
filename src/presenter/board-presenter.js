import BoardView from '../view/board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { remove, render } from '../framework/render.js';
import FilmsEmptyListView from '../view/films-empty-list-view.js';
import FilmPresenter from './film-presenter.js';
import SortView, { SortType } from '../view/sort-view.js';
import { sortByDate, sortByRating } from '../utils/sort.js';
import {UserAction, UpdateType} from '../const.js';
import { filter, FilterType } from '../utils/filter.js';

const MAX_FILMS_AMOUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = null;
  #filmsEmptyListComponent = null;
  #sortComponent = null;

  #renderedFilmsAmount = MAX_FILMS_AMOUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  constructor(boardContainer, filmsModel, commentsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#commentsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;

    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    //?
    render(this.#sortComponent, this.#boardContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #renderBoard = () => {
    if (!this.films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    render(this.#boardComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#boardComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    const filmsAmount = this.films.length;
    const films = this.films.slice(0, Math.min(filmsAmount, this.#renderedFilmsAmount));

    this.#renderFilms(films, this.comments);

    if (filmsAmount > this.#renderedFilmsAmount) {
      this.#renderShowMoreButton();
    }
  };

  #renderNoFilms = () => {
    this.#filmsEmptyListComponent = new FilmsEmptyListView(this.#filterType);
    render(this.#boardComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#boardComponent.element);
    render(this.#filmsEmptyListComponent, this.#filmsListComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
  };

  #renderFilm = (film, comments) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#onFilmCardViewAction, this.#onPopupViewAction,this.#onPopupModeChange);
    filmPresenter.init(film, comments);

    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films, comments) => {
    films.forEach((film) => this.#renderFilm(film, comments));
  };

  #clearBoard = ({resetRenderedFilmsAmount = false, resetSortType = false} = {}) => {
    const filmsAmount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#filmsEmptyListComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmsAmount) {
      this.#renderedFilmsAmount = MAX_FILMS_AMOUNT_PER_STEP;
    } else {
      this.#renderedFilmsAmount = Math.min(filmsAmount, this.#renderedFilmsAmount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({resetRenderedFilmsAmount: true});
    this.#renderBoard();
  };

  #onShowMoreButtonClick = () => {
    const filmsAmount = this.films.length;
    const newRenderedFilmsAmount = Math.min(filmsAmount, this.#renderedFilmsAmount + MAX_FILMS_AMOUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsAmount, newRenderedFilmsAmount);

    this.#renderFilms(films, this.comments);
    this.#renderedFilmsAmount = newRenderedFilmsAmount;

    if (this.#renderedFilmsAmount >= filmsAmount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #onFilmCardViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  };

  #onPopupViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        this.#filmsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        this.#filmsModel.deleteComment(updateType, update);
        break;
    }
  };

  #onModelEvent = (updateType, data) => {
    const {id: filmId, popupMode, popupScrollPosition} = data;

    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();

        if (this.#filmPresenter.get(filmId)) {
          this.#filmPresenter.get(filmId).updatePopup(popupMode, popupScrollPosition);
        }

        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsAmount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #onPopupModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetPopup());
  };
}

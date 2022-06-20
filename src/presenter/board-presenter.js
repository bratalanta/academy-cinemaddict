import BoardView from '../view/board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import FilmsEmptyListView from '../view/films-empty-list-view.js';
import FilmPresenter from './film-presenter.js';
import SortView, { SortType } from '../view/sort-view.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/sort.js';
import {UserAction, UpdateType} from '../const.js';
import { filter, FilterType } from '../utils/filter.js';
import FilmsLoadingView from '../view/films-loading-view.js';
import FooterView from '../view/footer-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const FILMS_COUNT_PER_STEP = 5;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = null;
  #filmsEmptyListComponent = null;
  #sortComponent = null;
  #filmsLoadingComponent = new FilmsLoadingView();
  #footerComponent = new FooterView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #renderedFilmsAmount = FILMS_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isFilmsLoading = true;

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

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = [...this.#filmsModel.films];
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderLoading = () => {
    render(this.#filmsLoadingComponent, this.#filmsListComponent.element);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#boardComponent.element);

    if (this.#isFilmsLoading) {
      this.#renderLoading();
      return;
    }

    const filmsAmount = this.films.length;

    if (filmsAmount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    const films = this.films.slice(0, Math.min(filmsAmount, this.#renderedFilmsAmount));

    this.#renderFilms(films);

    if (filmsAmount > this.#renderedFilmsAmount) {
      this.#renderShowMoreButton();
    }

    render(this.#footerComponent, this.#boardContainer, RenderPosition.AFTEREND);
  };

  #renderNoFilms = () => {
    this.#filmsEmptyListComponent = new FilmsEmptyListView(this.#filterType);
    render(this.#filmsEmptyListComponent, this.#filmsListComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#footerComponent.element, this.#onFilmCardViewAction, this.#onPopupViewAction,this.#onPopupModeChange, this.#commentsModel);
    filmPresenter.init(film);

    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #clearBoard = ({resetRenderedFilmsAmount = false, resetSortType = false} = {}) => {
    const filmsAmount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#filmsEmptyListComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmsAmount) {
      this.#renderedFilmsAmount = FILMS_COUNT_PER_STEP;
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
    const newRenderedFilmsAmount = Math.min(filmsAmount, this.#renderedFilmsAmount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsAmount, newRenderedFilmsAmount);

    this.#renderFilms(films);
    this.#renderedFilmsAmount = newRenderedFilmsAmount;

    if (this.#renderedFilmsAmount >= filmsAmount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #onFilmCardViewAction = async (actionType, updateType, update) => {
    const {id: filmId} = update;
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#filmPresenter.get(filmId).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onPopupViewAction = async (actionType, updateType, update) => {
    const {id: filmId, commentId} = update;
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#filmPresenter.get(filmId).setAdding();

        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          this.#filmPresenter.get(filmId).setAborting();
        }

        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPresenter.get(filmId).setDeleting(commentId);

        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch {
          this.#filmPresenter.get(filmId).setAborting();
        }

        this.#filmsModel.deleteComment(update);
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onModelEvent = (updateType, data) => {
    const {id: filmId,
      isPopupOpened = true,
      popupScrollPosition = 0,
      popupComments,
      filmComments,
      prevPopupState
    } = data;

    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(filmId)) {
          this.#filmPresenter.get(filmId).updatePopupComments(isPopupOpened, popupScrollPosition, popupComments);
        }

        break;
      case UpdateType.MINOR:
        this.#clearBoard();

        if (filmComments) {
          this.#filmsModel.addComment(filmComments, filmId);
        }

        this.#renderBoard();

        if (this.#filmPresenter.get(filmId) && isPopupOpened) {
          this.#filmPresenter.get(filmId).updatePopupDetails(isPopupOpened, popupScrollPosition, popupComments, prevPopupState);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsAmount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isFilmsLoading = false;
        remove(this.#filmsLoadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #onPopupModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetPopup());
  };
}

import BoardView from '../view/board-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import FilmsEmptyListView from '../view/films-empty-list-view.js';
import FilmPresenter from './film-presenter.js';
import SortView, { SortType } from '../view/sort-view.js';
import { sortFilmsByDate, sortFilmsByMostComments, sortFilmsByRating } from '../utils/sort.js';
import {UserAction, UpdateType} from '../const.js';
import { filter, FilterType } from '../utils/filter.js';
import FilmsLoadingView from '../view/films-loading-view.js';
import FooterView from '../view/footer-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import UserRankView from '../view/user-rank-view.js';
import FilmsListExtraView from '../view/films-list-extra-view.js';
import { isFilmCommentedZeroTimes, isFilmRatedZero, areFilmRatingsEqual, areFilmCommentsCountEqual } from '../utils/film.js';
import { getRandomInteger } from '../utils/common.js';

const FILMS_COUNT_PER_STEP = 5;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};
const ExtraBlockType = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented'
};
const EXTRA_FILMS_COUNT = 2;

export default class BoardPresenter {
  #boardComponent = new BoardView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #mostCommentedFilmsContainerComponent = new FilmsListContainerView();
  #mostRatedFilmsContainerComponent = new FilmsListContainerView();
  #mostCommentedFilmsListComponent = null;
  #mostRatedFilmsListComponent = null;
  #showMoreButtonComponent = null;
  #filmsEmptyListComponent = null;
  #sortComponent = null;
  #filmsLoadingComponent = new FilmsLoadingView();
  #footerComponent = null;
  #userRankComponent = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #mostCommentedFilmPresenter = new Map();
  #mostRatedFilmPresenter = new Map();
  #filmPresenters = [this.#filmPresenter, this.#mostCommentedFilmPresenter, this.#mostRatedFilmPresenter];
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isFilmsLoading = true;
  #isFooterRenderedOnce = false;
  #areFilmRatingsEqual = false;
  #areFilmCommentsCountEqual = false;

  #boardContainer = null;
  #headerContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  constructor(boardContainer, headerContainer, filmsModel, commentsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#headerContainer = headerContainer;
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

  #renderUserRank = () => {
    const watchedFilmsCount = filter[FilterType.ALREADYWATCHED](this.#filmsModel.films).length;
    this.#userRankComponent = new UserRankView(watchedFilmsCount);
    render(this.#userRankComponent, this.#headerContainer);
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);
    render(this.#filmsListComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);

    if (this.#isFooterRenderedOnce) {
      remove(this.#footerComponent);
      this.#renderFooter();
      this.#isFooterRenderedOnce = false;
    }

    if (this.#isFilmsLoading) {
      this.#renderLoading();
      this.#renderFooter();
      this.#isFooterRenderedOnce = true;
      return;
    }

    this.#renderUserRank();
    const filmsCount = this.films.length;

    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
    const films = this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount));
    this.#renderFilms(films, this.#filmsListContainerComponent.element, this.#filmPresenter);

    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }


    this.#renderMostRatedFilms();
    this.#renderMostCommentedFilms();
  };

  #renderMostRatedFilms = () => {
    const films = this.#filmsModel.films;
    let extraMostRatedFilms = [];

    if (films.every(isFilmRatedZero)) {
      return;
    }

    if (areFilmRatingsEqual(films)) {
      extraMostRatedFilms = [...films].splice(getRandomInteger(0, films.length - EXTRA_FILMS_COUNT), EXTRA_FILMS_COUNT);
      this.#areFilmRatingsEqual = true;
    }

    if (!this.#areFilmRatingsEqual) {
      extraMostRatedFilms = [...films].sort(sortFilmsByRating).slice(0, EXTRA_FILMS_COUNT);
    }

    this.#mostRatedFilmsListComponent = new FilmsListExtraView(ExtraBlockType.TOP_RATED);
    render(this.#mostRatedFilmsListComponent, this.#boardComponent.element);
    render(this.#mostRatedFilmsContainerComponent, this.#mostRatedFilmsListComponent.element);
    this.#renderFilms(extraMostRatedFilms, this.#mostRatedFilmsContainerComponent.element, this.#mostRatedFilmPresenter);
  };

  #renderMostCommentedFilms = () => {
    const films = this.#filmsModel.films;
    let extraMostCommentedFilms = [];

    if (films.every(isFilmCommentedZeroTimes)) {
      return;
    }

    if (areFilmCommentsCountEqual(films)) {
      extraMostCommentedFilms = [...films].splice(getRandomInteger(0, films.length - EXTRA_FILMS_COUNT), EXTRA_FILMS_COUNT);
      this.#areFilmCommentsCountEqual = true;
    }

    if (!this.#areFilmCommentsCountEqual) {
      extraMostCommentedFilms = [...films].sort(sortFilmsByMostComments).slice(0, EXTRA_FILMS_COUNT);
    }

    this.#mostCommentedFilmsListComponent = new FilmsListExtraView(ExtraBlockType.MOST_COMMENTED);
    render(this.#mostCommentedFilmsListComponent, this.#boardComponent.element);
    render(this.#mostCommentedFilmsContainerComponent, this.#mostCommentedFilmsListComponent.element);
    this.#renderFilms(extraMostCommentedFilms, this.#mostCommentedFilmsContainerComponent.element, this.#mostCommentedFilmPresenter);
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

  #renderFooter = () => {
    this.#footerComponent = new FooterView(this.#filmsModel.films.length);
    render(this.#footerComponent, this.#boardContainer, RenderPosition.AFTEREND);
  };

  #renderFilm = (film, containerElement, presenter) => {
    const filmPresenter = new FilmPresenter(containerElement, this.#footerComponent.element, this.#onViewAction,this.#onPopupModeChange, this.#commentsModel, presenter);
    filmPresenter.init(film);

    presenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films, containerElement, presenter) => {
    films.forEach((film) => this.#renderFilm(film, containerElement, presenter));
  };

  #clearBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;

    this.#filmPresenters.forEach((presenter) => presenter.forEach((item) => item.destroy()));
    this.#filmPresenters.forEach((presenter) => presenter.clear());

    remove(this.#sortComponent);
    remove(this.#userRankComponent);
    remove(this.#filmsEmptyListComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#mostCommentedFilmsListComponent);
    remove(this.#mostRatedFilmsListComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
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

    this.#clearBoard({resetRenderedFilmsCount: true});
    this.#renderBoard();
  };

  #onShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films, this.#filmsListContainerComponent.element, this.#filmPresenter);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #onViewAction = async (actionType, updateType, update) => {
    const {filmId, commentId, presenter} = update;
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          presenter.get(filmId).setAborting();
        }

        break;
      case UserAction.ADD_COMMENT:
        presenter.get(filmId).setAdding();

        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          presenter.get(filmId).setAborting();
        }

        break;
      case UserAction.DELETE_COMMENT:
        presenter.get(filmId).setDeleting(commentId);

        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch {
          presenter.get(filmId).setAborting();
        }

        break;
    }

    this.#uiBlocker.unblock();
  };

  #onModelEvent = (updateType, data) => {
    const {filmId,
      isPopupOpened = true,
      popupScrollPosition = 0,
      filmComments,
      prevPopupState,
      commentId,
      isCommentsLoadFailed,
      presenter
    } = data;

    switch (updateType) {
      case UpdateType.PATCH:
        if (presenter.get(filmId)) {
          presenter.get(filmId).updatePopupComments(isPopupOpened, popupScrollPosition, isCommentsLoadFailed);
        }

        break;
      case UpdateType.MINOR:
        this.#clearBoard();

        if (filmComments) {
          this.#filmsModel.addComment(filmComments, filmId);
        }

        if (commentId) {
          this.#filmsModel.deleteComment(data);
        }

        this.#renderBoard();

        if (presenter.get(filmId) && isPopupOpened) {
          presenter.get(filmId).updatePopupDetails(isPopupOpened, popupScrollPosition, prevPopupState);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsCount: true, resetSortType: true});
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
    this.#filmPresenters.forEach((presenter) => presenter.forEach((item) => item.resetPopup()));
  };
}

import FilmPopupView from '../view/film-popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import { remove, render, replace } from '../framework/render.js';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
};

const appBodyElement = document.body;

export default class FilmPresenter {
  #film = null;
  #comments = null;
  #changeData = null;
  #changePopupMode = null;
  #mode = Mode.CLOSED;

  #filmsListContainer = null;

  #filmCardComponent = null;
  #popupComponent = null;

  constructor (filmsListContainer, changeData, changePopupMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changePopupMode = changePopupMode;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmCardComponent = new FilmCardView(film);
    this.#popupComponent = new FilmPopupView(film, comments);

    this.#filmCardComponent.setClickHandler(this.#onFilmCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#onFavoriteClick);

    this.#popupComponent.setCloseButtonClickHandler(() => this.#closePopup());
    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);

    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    replace(this.#filmCardComponent, prevFilmCardComponent);

    if (this.#mode === Mode.OPENED) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      this.#popupComponent.reset();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      appBodyElement.classList.remove('hide-overflow');
      appBodyElement.removeChild(this.#popupComponent.element);
      this.#mode = Mode.CLOSED;
    }
  };

  #renderPopup = () => {
    appBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    render(this.#popupComponent, appBodyElement);
    this.#mode = Mode.OPENED;
  };

  resetPopup = () => {
    if (this.#mode === Mode.OPENED) {
      this.#popupComponent.reset();
      this.#closePopup();
    }
  };

  #closePopup = () => {
    appBodyElement.classList.remove('hide-overflow');
    appBodyElement.removeChild(this.#popupComponent.element);
    this.#mode = Mode.CLOSED;
  };

  #onFilmCardClick = () => {
    this.#changePopupMode();
    this.#renderPopup();
  };

  #onWatchlistClick = () => {
    this.#changeData(
      {
        ...this.#film,
        userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}
      },
      this.#comments);
  };

  #onAlreadyWatchedClick = () => {
    this.#changeData(
      {
        ...this.#film,
        userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}
      },
      this.#comments);
  };

  #onFavoriteClick = () => {
    this.#changeData(
      {
        ...this.#film,
        userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}
      },
      this.#comments);
  };
}

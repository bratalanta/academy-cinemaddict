import FilmPopupView from '../view/film-popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import { remove, render, replace } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED'
};

const appBodyElement = document.body;

export default class FilmPresenter {
  #film = null;
  #comments = null;
  #changeFilmData = null;
  #changeCommentData = null;
  #changePopupMode = null;
  #mode = Mode.CLOSED;

  #filmsListContainer = null;

  #filmCardComponent = null;
  #popupComponent = null;

  constructor (filmsListContainer, changeFilmData, changeCommentData, changePopupMode) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeFilmData = changeFilmData;
    this.#changeCommentData = changeCommentData;
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
    this.#popupComponent.setDeleteButtonClickHandler(this.#onDeleteButtonClick);
    this.#popupComponent.setCommentAddHandler(this.#onCommentAdd);

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

  updatePopup = (popupMode, popupScrollPosition) => {
    if (popupMode === Mode.OPENED) {
      this.#renderPopup();
      this.#popupComponent.element.scrollTop = popupScrollPosition;
    }
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

  #onCommentAdd = (newComment) => {
    this.#changeCommentData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        newComment,
        id: this.#film.id,
        popupMode: this.#mode,
        popupScrollPosition: this.#popupComponent.element.scrollTop
      }
    );
  };

  #onDeleteButtonClick = (commentId) => {
    this.#changeCommentData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        commentId,
        id: this.#film.id,
        popupMode: this.#mode,
        popupScrollPosition: this.#popupComponent.element.scrollTop
      }
    );
  };

  #onFilmCardClick = () => {
    if (this.#mode === Mode.CLOSED) {
      this.#changePopupMode();
      this.#renderPopup();
    }
  };

  #onWatchlistClick = () => {
    this.#changeFilmData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails:
        {
          ...this.#film.userDetails,
          watchlist: !this.#film.userDetails.watchlist
        },
        popupMode: this.#mode,
        popupScrollPosition: this.#popupComponent.element.scrollTop
      }
    );
  };

  #onAlreadyWatchedClick = () => {
    this.#changeFilmData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails:
        {...this.#film.userDetails,
          alreadyWatched: !this.#film.userDetails.alreadyWatched
        },
        popupMode: this.#mode,
        popupScrollPosition: this.#popupComponent.element.scrollTop
      }
    );
  };

  #onFavoriteClick = () => {
    this.#changeFilmData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {
        ...this.#film,
        userDetails:
        {
          ...this.#film.userDetails,
          favorite: !this.#film.userDetails.favorite
        },
        popupMode: this.#mode,
        popupScrollPosition: this.#popupComponent.element.scrollTop
      }
    );
  };
}

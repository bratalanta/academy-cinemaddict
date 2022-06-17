import FilmPopupView from '../view/film-popup-view.js';
import FilmCardView from '../view/film-card-view.js';
import { remove, render, replace } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';

const appBodyElement = document.body;

export default class FilmPresenter {
  #film = null;
  #popupComments = [];
  #changeFilmData = null;
  #changeCommentData = null;
  #changePopupMode = null;
  #isPopupOpened = false;
  #isCommentsLoading = true;

  #filmsListContainer = null;

  #filmCardComponent = null;
  #popupComponent = null;
  #commentsModel = null;

  constructor (filmsListContainer, changeFilmData, changeCommentData, changePopupMode, commentsModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeFilmData = changeFilmData;
    this.#changeCommentData = changeCommentData;
    this.#changePopupMode = changePopupMode;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setClickHandler(this.#onFilmCardClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#onFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    replace(this.#filmCardComponent, prevFilmCardComponent);
    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      document.removeEventListener('keydown', this.#onEscKeyDown);
      appBodyElement.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      this.#isPopupOpened = false;
    }
  };

  #openPopup = async () => {
    appBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#renderPopup();
    this.#isPopupOpened = true;

    if (this.#isCommentsLoading) {
      this.#isCommentsLoading = false;
      await this.#commentsModel.init(this.#film);
    }
  };

  #renderPopup = () => {
    this.#popupComponent = new FilmPopupView(this.#film, this.#popupComments, this.#isCommentsLoading);

    this.#popupComponent.setCloseButtonClickHandler(() => this.#closePopup());
    this.#popupComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupComponent.setDeleteButtonClickHandler(this.#onDeleteButtonClick);
    this.#popupComponent.setCommentAddHandler(this.#onCommentAdd);

    render(this.#popupComponent, appBodyElement);
  };

  updatePopupComments = (isPopupOpened, popupScrollPosition, popupComments) => {
    this.resetPopup();
    if (isPopupOpened) {
      this.#updatePopup(popupComments, popupScrollPosition);
    }
  };

  updatePopupDetails = (isPopupOpened, popupScrollPosition, popupComments) => {
    this.#isCommentsLoading = false;
    if (isPopupOpened) {
      this.#updatePopup(popupComments, popupScrollPosition);
    }
  };

  #updatePopup = (popupComments, popupScrollPosition) => {
    this.#popupComments = popupComments;
    this.#openPopup();
    this.#popupComponent.element.scrollTop = popupScrollPosition;
    this.#isCommentsLoading = true;
  };

  resetPopup = () => {
    if (this.#isPopupOpened) {
      this.#popupComponent.reset();
      this.#closePopup();
    }
  };

  #closePopup = () => {
    appBodyElement.classList.remove('hide-overflow');
    appBodyElement.removeChild(this.#popupComponent.element);
    this.#isPopupOpened = false;
  };

  #onCommentAdd = (newComment) => {
    this.#changeCommentData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        newComment,
        id: this.#film.id,
        isPopupOpened: this.#isPopupOpened,
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
        isPopupOpened: this.#isPopupOpened,
        popupScrollPosition: this.#popupComponent.element.scrollTop
      }
    );
  };

  #onFilmCardClick = () => {
    if (!this.#isPopupOpened) {
      this.#changePopupMode();
      this.#openPopup();
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
        isPopupOpened: this.#isPopupOpened,
        popupScrollPosition: this.#isPopupOpened ? this.#popupComponent.element.scrollTop : '',
        popupComments: this.#popupComments
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
        isPopupOpened: this.#isPopupOpened,
        popupScrollPosition: this.#isPopupOpened ? this.#popupComponent.element.scrollTop : '',
        popupComments: this.#popupComments
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
        isPopupOpened: this.#isPopupOpened,
        popupScrollPosition: this.#isPopupOpened ? this.#popupComponent.element.scrollTop : '',
        popupComments: this.#popupComments
      }
    );
  };
}

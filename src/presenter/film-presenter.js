import PopupFormView from '../view/popup-form-view.js';
import FilmCardView from '../view/film-card-view.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';
import PopupSectionView from '../view/popup-section-view.js';

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
  #popupContainer = null;

  #popupSectionComponent = null;
  #filmCardComponent = null;
  #popupFormComponent = null;
  #commentsModel = null;

  constructor (filmsListContainer, popupContainer, changeFilmData, changeCommentData, changePopupMode, commentsModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeFilmData = changeFilmData;
    this.#changeCommentData = changeCommentData;
    this.#changePopupMode = changePopupMode;
    this.#commentsModel = commentsModel;
    this.#popupContainer = popupContainer;
  }

  setAdding = () => {
    if (this.#isPopupOpened) {
      this.#popupFormComponent.updateElement({
        isCommentAdding: true,
        isDetailsDisabled: true
      });
    }
  };

  setDeleting = (deletingCommentId) => {
    if (this.#isPopupOpened) {
      this.#popupFormComponent.updateElement({
        isCommentDeleting: true,
        isDetailsDisabled: true,
        deletingCommentId
      });
    }
  };

  setAborting = () => {
    if (!this.#isPopupOpened) {
      this.#filmCardComponent.shake();
      return;
    }

    const resetPopupState = () => {
      this.#popupFormComponent.updateElement({
        isCommentDeleting: false,
        isDetailsDisabled: false,
        isCommentAdding: false,
      });
    };

    this.#popupFormComponent.shake(resetPopupState);
  };

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
    remove(this.#popupSectionComponent);
    remove(this.#popupFormComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      document.removeEventListener('keydown', this.#onEscKeyDown);
      appBodyElement.classList.remove('hide-overflow');
      remove(this.#popupSectionComponent);
      remove(this.#popupFormComponent);
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
    this.#popupSectionComponent = new PopupSectionView();
    render(this.#popupSectionComponent, this.#popupContainer, RenderPosition.AFTEREND);

    this.#popupFormComponent = new PopupFormView(this.#film, this.#popupComments, this.#isCommentsLoading);
    render(this.#popupFormComponent, this.#popupSectionComponent.element);

    this.#popupFormComponent.setCloseButtonClickHandler(() => this.#closePopup());
    this.#popupFormComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupFormComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#popupFormComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupFormComponent.setDeleteButtonClickHandler(this.#onDeleteButtonClick);
    this.#popupFormComponent.setCommentAddHandler(this.#onCommentAdd);
  };

  updatePopupComments = (isPopupOpened, popupScrollPosition, popupComments, prevPopupState) => {
    this.resetPopup();
    if (isPopupOpened) {
      this.#updatePopup(popupComments, popupScrollPosition);
      this.#popupFormComponent.updateElement(prevPopupState);
    }
  };

  updatePopupDetails = (isPopupOpened, popupScrollPosition, popupComments, prevPopupState) => {
    this.#isCommentsLoading = false;
    if (isPopupOpened) {
      this.#updatePopup(popupComments, popupScrollPosition);
      this.#popupFormComponent.updateElement(prevPopupState);
    }
  };

  updateFilmCardComments = (updatedComments) => {
    this.#film.comments = updatedComments;
  };

  #updatePopup = (popupComments, popupScrollPosition) => {
    this.#popupComments = this.#commentsModel.comments;
    this.#openPopup();
    this.#popupSectionComponent.element.scrollTop = popupScrollPosition;
    this.#isCommentsLoading = true;
  };

  resetPopup = () => {
    if (this.#isPopupOpened) {
      this.#popupFormComponent.reset();
      this.#closePopup();
    }
  };

  #closePopup = () => {
    appBodyElement.classList.remove('hide-overflow');
    remove(this.#popupFormComponent);
    remove(this.#popupSectionComponent);
    this.#isPopupOpened = false;
  };

  #onCommentAdd = (comment) => {
    this.#changeCommentData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        comment,
        id: this.#film.id,
        isPopupOpened: this.#isPopupOpened,
        popupScrollPosition: this.#popupSectionComponent.element.scrollTop
      }
    );
  };

  #onDeleteButtonClick = (commentId, prevPopupState) => {
    this.#changeCommentData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        commentId,
        id: this.#film.id,
        isPopupOpened: this.#isPopupOpened,
        popupScrollPosition: this.#popupSectionComponent.element.scrollTop,
        prevPopupState
      }
    );
  };

  #onFilmCardClick = () => {
    if (!this.#isPopupOpened) {
      this.#changePopupMode();
      this.#openPopup();
    }
  };

  #onWatchlistClick = (prevPopupState) => {
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
        popupScrollPosition: this.#isPopupOpened ? this.#popupSectionComponent.element.scrollTop : '',
        popupComments: this.#popupComments,
        prevPopupState: prevPopupState ? prevPopupState : ''
      }
    );
  };

  #onAlreadyWatchedClick = (prevPopupState) => {
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
        popupScrollPosition: this.#isPopupOpened ? this.#popupSectionComponent.element.scrollTop : '',
        popupComments: this.#popupComments,
        prevPopupState: prevPopupState ? prevPopupState : ''
      }
    );
  };

  #onFavoriteClick = (prevPopupState) => {
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
        popupScrollPosition: this.#isPopupOpened ? this.#popupSectionComponent.element.scrollTop : '',
        popupComments: this.#popupComments,
        prevPopupState: prevPopupState ? prevPopupState : ''
      }
    );
  };
}

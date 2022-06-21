import PopupFormView from '../view/popup-form-view.js';
import FilmCardView from '../view/film-card-view.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';
import PopupSectionView from '../view/popup-section-view.js';

export default class FilmPresenter {
  #film = null;
  #popupComments = [];
  #changeData = null;
  #changePopupMode = null;
  #isPopupOpened = false;
  #isCommentsLoading = true;
  #isCommentsLoadFailed = false;

  #filmsListContainer = null;
  #popupContainer = null;

  #popupSectionComponent = null;
  #filmCardComponent = null;
  #popupFormComponent = null;
  #commentsModel = null;

  constructor (filmsListContainer, popupContainer, changeData, changePopupMode, commentsModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
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
      document.body.classList.remove('hide-overflow');
      remove(this.#popupSectionComponent);
      remove(this.#popupFormComponent);
      this.#isPopupOpened = false;
    }
  };

  #openPopup = async () => {
    document.body.classList.add('hide-overflow');
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

    this.#popupFormComponent = new PopupFormView(this.#film, this.#popupComments, this.#isCommentsLoading, this.#isCommentsLoadFailed);
    render(this.#popupFormComponent, this.#popupSectionComponent.element);

    this.#popupFormComponent.setCloseButtonClickHandler(() => this.#closePopup());
    this.#popupFormComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#popupFormComponent.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#popupFormComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupFormComponent.setDeleteButtonClickHandler(this.#onDeleteButtonClick);
    this.#popupFormComponent.setCommentAddHandler(this.#onCommentAdd);
  };

  updatePopupComments = (isPopupOpened, popupScrollPosition, isCommentsLoadFailed) => {
    this.#isCommentsLoadFailed = isCommentsLoadFailed;
    this.resetPopup();
    if (isPopupOpened) {
      this.#updatePopup(popupScrollPosition);
    }
  };

  updatePopupDetails = (isPopupOpened, popupScrollPosition, prevPopupState) => {
    this.#isCommentsLoading = false;
    if (isPopupOpened) {
      this.#updatePopup(popupScrollPosition);

      if (prevPopupState) {
        this.#popupFormComponent.updateElement(prevPopupState);
      }
    }
  };

  updateFilmCardComments = (updatedComments) => {
    this.#film.comments = updatedComments;
  };

  #updatePopup = (popupScrollPosition) => {
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
    document.body.classList.remove('hide-overflow');
    remove(this.#popupFormComponent);
    remove(this.#popupSectionComponent);
    this.#isPopupOpened = false;
  };

  #onCommentAdd = (comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        comment,
        filmId: this.#film.id,
        isPopupOpened: this.#isPopupOpened,
        popupScrollPosition: this.#popupSectionComponent.element.scrollTop
      }
    );
  };

  #onDeleteButtonClick = (commentId, prevPopupState) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {
        commentId,
        filmId: this.#film.id,
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
    this.#changeData(
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
        prevPopupState: prevPopupState ? prevPopupState : '',
        filmId: this.#film.id
      }
    );
  };

  #onAlreadyWatchedClick = (prevPopupState) => {
    this.#changeData(
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
        prevPopupState: prevPopupState ? prevPopupState : '',
        filmId: this.#film.id
      }
    );
  };

  #onFavoriteClick = (prevPopupState) => {
    this.#changeData(
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
        prevPopupState: prevPopupState ? prevPopupState : '',
        filmId: this.#film.id
      }
    );
  };
}

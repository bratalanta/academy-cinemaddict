import { humanizeDate, normalizeFilmRuntime } from '../utils/film.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';

const EMOJIS = [
  'smile',
  'sleeping',
  'angry',
  'puke'
];

const createFilmGenresTemplate = (genres) => (
  genres.map((item) => `<span class="film-details__genre">${item}</span>`)
    .join('')
);

const getActiveControlButtonClassName = (userDetail) => userDetail ? 'film-details__control-button--active' : '';

const addEmojiLabelImage = (emojiValue) => emojiValue ? `<img src="images/emoji/${emojiValue}.png" width="55" height="55" alt="emoji-${emojiValue}">` : '';

const createPopupCommentsTemplate = (comments, isCommentDeleting, deletingCommentId) => (
  comments.map((item) => {
    const {author, comment, date: commentDate, emotion, id} = item;

    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
              </span>
              <div>
                <p class="film-details__comment-text">${he.encode(comment)}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${author}</span>
                  <span class="film-details__comment-day">${humanizeDate(commentDate, 'YYYY/MM/DD HH:mm')}</span>
                  <button
                  class="film-details__comment-delete"
                  data-id="${id}"
                  ${isCommentDeleting && deletingCommentId === id ? 'disabled' : ''}>
                  ${isCommentDeleting && deletingCommentId === id ? 'Deleting...' : 'Delete'}
                  </button>
                </p>
              </div>
            </li>`;
  }).join('')
);

const createEmojisTemplate = (selectedEmoji, isCommentAdding) => (
  EMOJIS.map((emojiName) =>
    (
      `<input class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${emojiName}"
        value="${emojiName}"
        ${emojiName === selectedEmoji ? 'checked' : ''}
        ${isCommentAdding ? 'disabled' : ''}
       >
       <label class="film-details__emoji-label" for="emoji-${emojiName}">
         <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
       </label>`
    )).join('\n')
);

const createPopupFormTemplate = (film, popupComments, state, isCommentsLoading, isCommentsLoadFailed) => {
  const {selectedEmoji,
    commentInput,
    isCommentDeleting,
    isCommentAdding,
    isDetailsDisabled,
    deletingCommentId} = state;
  const {filmInfo, userDetails} = film;
  const {title,
    alternativeTitle,
    totalRating,
    release,
    runtime,
    genre,
    poster,
    description,
    ageRating,
    director,
    writers,
    actors} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;
  const {date: releaseDate, releaseCountry} = release;

  return `
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${humanizeDate(releaseDate, 'DD MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${normalizeFilmRuntime(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">${createFilmGenresTemplate(genre)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${getActiveControlButtonClassName(watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist" ${isDetailsDisabled ? 'disabled' : ''}>Add to watchlist</button>
          <button type="button" class="film-details__control-button ${getActiveControlButtonClassName(alreadyWatched)} film-details__control-button--watched" id="watched" name="watched" ${isDetailsDisabled ? 'disabled' : ''}>Already watched</button>
          <button type="button" class="film-details__control-button ${getActiveControlButtonClassName(favorite)} film-details__control-button--favorite" id="favorite" name="favorite" ${isDetailsDisabled ? 'disabled' : ''}>Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${popupComments.length}</span></h3>

    ${isCommentsLoading ? '<h2>Loading comments...</h2>' :
    `<ul class="film-details__comments-list">
      ${createPopupCommentsTemplate(popupComments, isCommentDeleting, deletingCommentId)}
    </ul>`}
    ${isCommentsLoadFailed ? '<h2 style="text-decoration: underline">Failed to load comments</h2>' : ''}
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
            ${addEmojiLabelImage(selectedEmoji)}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" ${isCommentsLoading || isCommentAdding || isCommentsLoadFailed ? 'disabled' : ''} placeholder="Select reaction below and write comment here" name="comment">${commentInput ? commentInput : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${createEmojisTemplate(selectedEmoji, isCommentAdding)}
            </div>
          </div>
        </section>
      </div>
    </form>`;
};

export default class PopupFormView extends AbstractStatefulView {
  #popupScrollPosition = null;
  #film = null;
  #comments = null;
  #isCommentsLoading = true;
  #isCommentsLoadFailed = false;

  constructor(film, comments, isCommentsLoading, isCommentsLoadFailed) {
    super();
    this.#isCommentsLoading = isCommentsLoading;
    this.#isCommentsLoadFailed = isCommentsLoadFailed;
    this.#film = film;
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupFormTemplate(this.#film, this.#comments, this._state, this.#isCommentsLoading, this.#isCommentsLoadFailed);
  }

  get scrollPosition() {
    return this.#popupScrollPosition;
  }

  reset = () => {
    this.updateElement(
      {
        selectedEmoji: '',
        commentInput: ''
      }
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiChooseHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
    this.setCommentAddHandler(this._callback.commentAdd);
  };

  setCommentAddHandler = (cb) => {
    this._callback.commentAdd = cb;
    const commentTextarea = this.element.querySelector('.film-details__comment-input');

    commentTextarea.addEventListener('keydown', this.#commentAddHandler);
  };

  setDeleteButtonClickHandler = (cb) => {
    this._callback.deleteButtonClick = cb;
    const commentsList = this.element.querySelector('.film-details__comments-list');

    if (commentsList) {
      commentsList.addEventListener('click', this.#deleteButtonClickHandler);
    }
  };

  setCloseButtonClickHandler = (cb) => {
    this._callback.click = cb;
    const popupCloseButton = this.element.querySelector('.film-details__close-btn');

    popupCloseButton.addEventListener('click', this.#closeButtonClickHandler);
  };

  setWatchlistClickHandler = (cb) => {
    this._callback.watchlistClick = cb;

    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (cb) => {
    this._callback.alreadyWatchedClick = cb;

    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (cb) => {
    this._callback.favoriteClick = cb;

    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #commentAddHandler = (evt) => {
    const selectedEmoji = this._state.selectedEmoji;
    const {target} = evt;

    if (evt.key === 'Enter' && evt.ctrlKey && selectedEmoji && target.value) {
      evt.preventDefault();

      const newComment = {
        comment: target.value,
        emotion: selectedEmoji
      };

      this._callback.commentAdd(newComment);
    }
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    const {target} = evt;

    if (target.matches('.film-details__comment-delete')) {
      this._callback.deleteButtonClick(target.dataset.id, this._state);
    }
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.click(evt);
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    const {target} = evt;

    this._setState(
      {
        commentInput: target.value
      }
    );
  };

  #emojiChooseHandler = (evt) => {
    evt.preventDefault();
    const {target} = evt;

    if (target.matches('img')) {
      const emojiId = target.closest('label').htmlFor;
      const emojiInput = this.element.querySelector(`input[id=${emojiId}]`);
      this.#popupScrollPosition = this.element.scrollTop;

      this.updateElement(
        {
          selectedEmoji: emojiInput.value
        }
      );

      this.element.scrollTop = this.#popupScrollPosition;
    }
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(this._state);
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.alreadyWatchedClick(this._state);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.favoriteClick(this._state);
  };
}

import { humanizeFilmDate, normalizeFilmRuntime } from '../utils/film.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const EMOJIS = [
  'smile',
  'sleeping',
  'angry',
  'puke'
];

const createFilmGenresTemplate = (genres) => {
  let template = '';

  for (const elem of genres) {
    template += `<span class="film-details__genre">${elem}</span>`;
  }

  return template;
};

const getActiveControlButtonClassName = (userDetail) => userDetail ? 'film-details__control-button--active' : '';

const addEmojiLabelImage = (emojiValue) => emojiValue ? `<img src="images/emoji/${emojiValue}.png" width="55" height="55" alt="emoji-${emojiValue}">` : '';

const createPopupCommentsTemplate = (comments) => {
  let template = '';

  for (const elem of comments) {
    const {author, comment, date: commentDate, emotion} = elem;

    template += `<li class="film-details__comment">
                   <span class="film-details__comment-emoji">
                     <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
                   </span>
                   <div>
                     <p class="film-details__comment-text">${comment}</p>
                     <p class="film-details__comment-info">
                       <span class="film-details__comment-author">${author}</span>
                       <span class="film-details__comment-day">${humanizeFilmDate(commentDate, 'YYYY/MM/DD HH:mm')}</span>
                       <button class="film-details__comment-delete">Delete</button>
                     </p>
                   </div>
                 </li>`;
  }

  return template;
};

const createEmojisTemplate = (selectedEmoji) => (
  EMOJIS.map((emojiName) =>
    (
      `<input class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${emojiName}"
        value="${emojiName}"
        ${emojiName === selectedEmoji ? 'checked' : ''}
       >
       <label class="film-details__emoji-label" for="emoji-${emojiName}">
         <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
       </label>`
    )).join('\n')
);

const createFilmPopupTemplate = (film, popupComments, state) => {
  const {selectedEmoji, commentInput} = state;
  const {filmInfo, userDetails} = film;
  const {title, alternativeTitle, totalRating, release, runtime, genre, poster, description, ageRating, director, writers, actors} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;
  const {date: releaseDate, releaseCountry} = release;

  return `<section class="film-details">
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
                <td class="film-details__cell">${humanizeFilmDate(releaseDate, 'DD MMMM YYYY')}</td>
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
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${createFilmGenresTemplate(genre)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${getActiveControlButtonClassName(watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${getActiveControlButtonClassName(alreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button ${getActiveControlButtonClassName(favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${popupComments.length}</span></h3>

          <ul class="film-details__comments-list">
          ${createPopupCommentsTemplate(popupComments)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
            ${addEmojiLabelImage(selectedEmoji)}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentInput ? commentInput : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${createEmojisTemplate(selectedEmoji)}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopupView extends AbstractStatefulView {
  #popupScrollPosition = null;
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();

    this.#film = film;
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this.#film, this.#comments, this._state);
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

    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();

    this._callback.favoriteClick();
  };
}

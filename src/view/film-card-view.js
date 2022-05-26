import AbstractView from '../framework/view/abstract-view.js';
import {humanizeFilmDate, normalizeFilmRuntime, truncFilmDescription, } from '../utils/film.js';

const createFilmCardTemplate = (film) => {
  const {filmInfo, comments, userDetails} = film;
  const {title, totalRating, release, runtime, genre, poster, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const getActiveControlItemClassName = (userDetail) => userDetail ? 'film-card__controls-item--active' : '';

  return (`<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeFilmDate(release.date, 'YYYY')}</span>
        <span class="film-card__duration">${normalizeFilmRuntime(runtime)}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${truncFilmDescription(description)}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getActiveControlItemClassName(watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getActiveControlItemClassName(alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${getActiveControlItemClassName(favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`
  );
};

export default class FilmCardView extends AbstractView {
  constructor(film) {
    super();
    this.film = film;
  }

  get template() {
    return createFilmCardTemplate(this.film);
  }

  setClickHandler = (cb) => {
    this._callback.click = cb;

    this.element.addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (cb) => {
    this._callback.watchlistClick = cb;

    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (cb) => {
    this._callback.alreadyWatchedClick = cb;

    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (cb) => {
    this._callback.favoriteClick = cb;

    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    const {target} = evt;

    if (target.matches('button')) {
      return;
    }

    this._callback.click(evt);
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

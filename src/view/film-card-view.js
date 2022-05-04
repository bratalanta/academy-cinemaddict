import { createElement } from '../render.js';
import {humanizeDate, normalizeFilmRuntime, truncFilmDescription, } from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {filmInfo, comments, userDetails, id} = film;
  const {title, totalRating, release, runtime, genre, poster, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  const getActiveControlItemClassName = (userDetail) => userDetail ? 'film-card__controls-item--active' : '';

  return (`<article class="film-card" id=${id}>
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeDate(release.date, 'YYYY')}</span>
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

export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
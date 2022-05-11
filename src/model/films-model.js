import { generateComment } from '../mock/comment.js';
import { generateFilm } from '../mock/film.js';

export default class FilmsModel {
  #films = Array.from({length: 0}, (_v, k) => generateFilm(k));
  #comments = Array.from({length: 5}, generateComment);

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}

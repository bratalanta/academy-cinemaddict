import { generateComment } from '../mock/comment.js';
import { generateFilm } from '../mock/film.js';

export default class FilmsModel {
  films = Array.from({length: 5}, (_v, k) => generateFilm(k));
  comments = Array.from({length: 5}, generateComment);

  getFilms = () => this.films;
  getComments = () => this.comments;
}

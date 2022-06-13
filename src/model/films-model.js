import { generateFilm } from '../mock/film.js';
import Observable from '../framework/observable.js';

export default class FilmsModel extends Observable {
  #films = Array.from({length: 1}, generateFilm);

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    const {id: filmUpdateId, newComment} = update;

    this.#films.map((film) => {
      if (film.id === filmUpdateId) {
        film.comments.push(newComment.id);
      }

      return film;
    });

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const {commentId: commentUpdateId} = update;

    this.#films.map((film) => {
      film.comments = film.comments.filter((commentId) => commentId !== commentUpdateId);
      return film;
    });

    this._notify(updateType, update);
  };
}

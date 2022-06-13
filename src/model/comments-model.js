import { generateComment } from '../mock/comment.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: 5}, generateComment);

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    const {newComment} = update;

    this.#comments.unshift(newComment);

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const {commentId: updateId} = update;

    this.#comments = this.#comments.filter((comment) => comment.id !== updateId);

    this._notify(updateType, update);
  };
}

import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';
import { sortCommentsByDate } from '../utils/sort.js';

export default class CommentsModel extends Observable {
  #comments = [];
  #commentsApiService = null;

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (film) => {
    try {
      const comments = await this.#commentsApiService.getComments(film.id);
      this.#comments = comments.sort(sortCommentsByDate);

    } catch(err) {
      this.#comments = [];
    }

    const update = {
      id: film.id,
      popupComments: this.#comments,
      film
    };

    this._notify(UpdateType.PATCH, update);
  };

  addComment = async (updateType, update) => {
    const {comment, id} = update;
    try {
      const response = await this.#commentsApiService.addComment(comment, id);
      this.#comments = response.comments.sort(sortCommentsByDate);
      update.filmComments = response.movie.comments;

      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t add comment');
    }

  };

  deleteComment = async (updateType, update) => {
    const {commentId} = update;

    try {
      await this.#commentsApiService.deleteComment(commentId);
      this.#comments = this.#comments.filter((comment) => comment.id !== commentId);

      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t delete comment');
    }

  };
}

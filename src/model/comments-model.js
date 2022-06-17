import { UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

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
      this.#commentsApiService.setCommentsEndPoint(film.id);
      const comments = await this.#commentsApiService.comments;
      this.#comments = comments;

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

import ApiService from '../framework/api-service.js';
// import {Method} from '../const.js';

export default class CommentsApiService extends ApiService {
  // #filmsModel = null;
  #filmId = null;
  // constructor() {
  //   super();
  //   this.#filmsModel = filmsModel;
  // }

  get comments() {
    return this._load({url: `comments/${this.#filmId}`})
      .then(ApiService.parseResponse);
  }

  setCommentsEndPoint = (filmId) => {
    this.#filmId = filmId;
  };
  // addComment = async (comment) => {
  //   const response = await this._load({
  //     url: `comments/${this.#filmId}`,
  //     method: Method.POST,
  //     body: JSON.stringify(comment),
  //     headers: new Headers({'Content-type': 'application/json'})
  //   });

  //   const parsedResponse = ApiService.parseResponse(response);

  //   return parsedResponse;
  // };

  // deleteComment = async (commentId) => {
  //   await this._load({
  //     url: `comments/${commentId}`,
  //     method: Method.DELETE
  //   });
  // };
}

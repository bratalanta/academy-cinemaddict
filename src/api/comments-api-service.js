import ApiService from '../framework/api-service.js';
import {Method} from '../const.js';

export default class CommentsApiService extends ApiService {
  async getComments(filmId) {
    const response = await this._load({ url: `comments/${filmId}` });
    return ApiService.parseResponse(response);
  }

  addComment = async (comment, filmId) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE
    });

    return response;
  };
}

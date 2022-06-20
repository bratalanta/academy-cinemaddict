import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmsModel extends Observable {
  #films = [];
  #filmsApiService = null;

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT, {});
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      filmInfo: {...film.film_info,
        ageRating: film.film_info
          .age_rating,
        alternativeTitle: film.film_info
          .alternative_title,
        totalRating: film.film_info
          .total_rating,
        release: {...film.film_info
          .release,
        releaseCountry: film.film_info
          .release
          .release_country
        }
      },
      userDetails: {...film.user_details,
        alreadyWatched: film.user_details
          .already_watched,
        watchingDate: film.user_details
          .watching_date
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['filmInfo']['age_rating'];
    delete adaptedFilm['filmInfo']['alternative_title'];
    delete adaptedFilm['filmInfo']['total_rating'];
    delete adaptedFilm['filmInfo']['release']['release_country'];

    delete adaptedFilm['user_details'];
    delete adaptedFilm['userDetails']['already_watched'];
    delete adaptedFilm['userDetails']['watching_date'];

    return adaptedFilm;
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const {id, filmInfo, comments, userDetails} = update;

    try {
      const response = await this.#filmsApiService.updateFilm({id, filmInfo, comments, userDetails});
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1)
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  addComment = (comments, filmId) => {
    this.#films.map((film) => {
      if (film.id === filmId) {
        film.comments = comments;
      }
      return film;
    });
  };

  deleteComment = (update) => {
    const {commentId: commentUpdateId, id: filmUpdateId} = update;

    this.#films.map((film) => {
      if (filmUpdateId === film.id) {
        film.comments = film.comments.filter((commentId) => commentId !== commentUpdateId);
      }

      return film;
    });
  };
}

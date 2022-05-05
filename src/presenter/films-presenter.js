import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { render } from '../render.js';
import FilmPopupView from '../view/film-popup-view.js';

const appBodyElement = document.body;

export default class FilmsPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();

  #filmsContainer = null;
  #filmsModel = null;
  #films = [];

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    this.#renderFilms();
  };

  #renderFilms = () => {
    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    const getFilmComments = (film) => this.#filmsModel.comments
      .filter(({id}) => film.comments.includes(id));

    for (let i = 0; i < this.#films.length; i++) {
      const comments = getFilmComments(this.#films[i]);

      this.#renderFilm(this.#films[i], comments);
    }

    render(new ShowMoreButtonView(), this.#filmsListComponent.element);
  };

  #renderFilm = (film, comments) => {
    const filmCardComponent = new FilmCardView(film);
    const popupComponent = new FilmPopupView(film, comments);
    const popupCloseButton = popupComponent.element.querySelector('.film-details__close-btn');

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        appBodyElement.removeChild(popupComponent.element);

        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const renderPopup = () => {
      appBodyElement.classList.add('hide-overflow');

      document.addEventListener('keydown', onEscKeyDown);

      render(popupComponent, appBodyElement);
    };

    filmCardComponent.element.addEventListener('click', (evt) => {
      const {target} = evt;

      if (!target.matches('button')) {
        const previousPopup = appBodyElement.querySelector('.film-details');

        if (previousPopup) {
          appBodyElement.removeChild(previousPopup);
        }

        renderPopup();
      }
    });

    const onPopupClose = () => {
      appBodyElement.classList.remove('hide-overflow');
      appBodyElement.removeChild(popupComponent.element);
    };

    popupCloseButton.addEventListener('click', onPopupClose);

    render(filmCardComponent, this.#filmsListContainerComponent.element);
  };
}

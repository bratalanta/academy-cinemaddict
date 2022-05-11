import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import { render } from '../render.js';
import FilmPopupView from '../view/film-popup-view.js';
import FilmsEmptyListView from '../view/films-empty-list-view.js';

const appBodyElement = document.body;
const MAX_FILMS_AMOUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsEmptyListComponent = new FilmsEmptyListView();

  #renderedFilmsAmount = MAX_FILMS_AMOUNT_PER_STEP;

  #filmsContainer = null;
  #filmsModel = null;
  #films = [];

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    if (!this.#films.length) {
      render(this.#filmsEmptyListComponent, this.#filmsListComponent.element);
    }

    this.#renderFilms();
  };

  #renderFilms = () => {
    render(this.#filmsComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(MAX_FILMS_AMOUNT_PER_STEP, this.#films.length); i++) {
      this.#renderFilm(this.#films[i], this.#filmsModel.comments);
    }

    const onShowMoreButtonClick = () => {
      this.#films.slice(this.#renderedFilmsAmount, this.#renderedFilmsAmount + MAX_FILMS_AMOUNT_PER_STEP)
        .forEach((film) => {
          this.#renderFilm(film, this.#filmsModel.comments);
        });

      this.#renderedFilmsAmount += MAX_FILMS_AMOUNT_PER_STEP;

      if (this.#renderedFilmsAmount >= this.#films.length) {
        this.#showMoreButtonComponent.element.remove();
        this.#showMoreButtonComponent.removeElement();
      }
    };

    if (this.#films.length > MAX_FILMS_AMOUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsListComponent.element);
      this.#showMoreButtonComponent.element.addEventListener('click', onShowMoreButtonClick);
    }
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

      if (target.matches('button')) {
        return;
      }

      const previousPopup = appBodyElement.querySelector('.film-details');

      if (previousPopup) {
        appBodyElement.removeChild(previousPopup);
      }

      renderPopup();
    });

    const onPopupClose = () => {
      appBodyElement.classList.remove('hide-overflow');
      appBodyElement.removeChild(popupComponent.element);
    };

    popupCloseButton.addEventListener('click', onPopupClose);

    render(filmCardComponent, this.#filmsListContainerComponent.element);
  };
}

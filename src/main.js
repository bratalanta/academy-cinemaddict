import FilmsModel from './model/films-model.js';
import FilmsPresenter from './presenter/films-presenter.js';
import { render } from './render.js';
import FilterView from './view/filter-view.js';
import FilmPopupView from './view/film-popup-view.js';
import UserRankView from './view/user-rank-view.js';

const appBodyElement = document.querySelector('body');
const appMainElement = document.querySelector('.main');
const appHeaderElement = document.querySelector('.header');
const filmsPresenter = new FilmsPresenter();
const filmsModel = new FilmsModel();

render(new UserRankView(), appHeaderElement);
render(new FilterView(), appMainElement);

filmsPresenter.init(appMainElement, filmsModel);

const filmsListContainerElement = document.querySelector('.films-list__container');

filmsListContainerElement.addEventListener('click', (evt) => {
  const {target} = evt;

  if (!target.matches('button')) {
    const filmCardId = target.closest('.film-card').id;

    for (const film of filmsModel.getFilms()) {
      if (film.id === filmCardId) {
        const comments = filmsModel.getComments()
          .filter(({id}) => film.comments.includes(id));

        render(new FilmPopupView(film, comments), appBodyElement);

        break;
      }
    }
  }
});


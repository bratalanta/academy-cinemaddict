import FilmsModel from './model/films-model.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import UserRankView from './view/user-rank-view.js';

const appMainElement = document.querySelector('.main');
const appHeaderElement = document.querySelector('.header');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsListPresenter(appMainElement, filmsModel);

render(new UserRankView(), appHeaderElement);
render(new FilterView(), appMainElement);

filmsPresenter.init();

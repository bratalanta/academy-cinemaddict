import FilmsModel from './model/films-model.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import UserRankView from './view/user-rank-view.js';
import { generateFilter } from './mock/filter.js';

const appMainElement = document.querySelector('.main');
const appHeaderElement = document.querySelector('.header');
const filmsModel = new FilmsModel();
const filmsPresenter = new FilmsListPresenter(appMainElement, filmsModel);

const filters = generateFilter(filmsModel.films);

render(new UserRankView(), appHeaderElement);
render(new FilterView(filters), appMainElement);

filmsPresenter.init();

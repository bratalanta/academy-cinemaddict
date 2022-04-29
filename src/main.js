import FilmsPresenter from './presenter/films-presenter.js';
import { render } from './render.js';
import FilterView from './view/filter-view.js';
import PopupView from './view/popup-view.js';
import UserRankView from './view/user-rank-view.js';

const appBodyElement = document.querySelector('body');
const appMainElement = document.querySelector('.main');
const appHeaderElement = document.querySelector('.header');
const filmPresenter = new FilmsPresenter();

render(new UserRankView(), appHeaderElement);
render(new FilterView(), appMainElement);

filmPresenter.init(appMainElement);

render(new PopupView(), appBodyElement);


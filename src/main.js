import FilmsModel from './model/films-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render } from './framework/render.js';
import UserRankView from './view/user-rank-view.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const appMainElement = document.querySelector('.main');
const appHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(appMainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(appMainElement, filterModel, filmsModel);

render(new UserRankView(), appHeaderElement);

filterPresenter.init();
boardPresenter.init();

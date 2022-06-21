import FilmsModel from './model/films-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsApiService from './api/films-api-service.js';
import CommentsApiService from './api/comments-api-service.js';

const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic matveiServer666';

const appMainElement = document.querySelector('.main');
const appHeaderElement = document.querySelector('.header');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(appMainElement, appHeaderElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(appMainElement, filterModel, filmsModel);

filterPresenter.init();
boardPresenter.init();
filmsModel.init();

import AbstractView from '../framework/view/abstract-view.js';

const UserRank = {
  NOVICE: {
    name: 'Novice',
    count: 1
  },
  FAN: {
    name: 'Fan',
    count: 11
  },
  MOVIE_BUFF: {
    name: 'Movie buff',
    count: 21
  }
};

const getUserRank = (watchedFilmsCount) => {
  const {NOVICE, FAN, MOVIE_BUFF} = UserRank;

  switch (!!watchedFilmsCount) {
    case false:
      return '';
    case watchedFilmsCount >= NOVICE.count && watchedFilmsCount < FAN.count:
      return NOVICE.name;
    case watchedFilmsCount >= FAN.count && watchedFilmsCount < MOVIE_BUFF.count:
      return FAN.name;
    case watchedFilmsCount >= MOVIE_BUFF.count:
      return MOVIE_BUFF.name;
  }
};

const createUserRankTemplate = (watchedFilmsCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(watchedFilmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends AbstractView {
  #watchedFilmsCount = null;

  constructor (watchedFilmsCount) {
    super();
    this.#watchedFilmsCount = watchedFilmsCount;
  }

  get template() {
    return createUserRankTemplate(this.#watchedFilmsCount);
  }
}

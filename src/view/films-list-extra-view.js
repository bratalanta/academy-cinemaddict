import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListExtraTemplate = (extraBlockType) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${extraBlockType}</h2>
  </section>`
);

export default class FilmsListExtraView extends AbstractView{
  #extraBlockType = null;

  constructor (extraBlockType) {
    super();
    this.#extraBlockType = extraBlockType;
  }

  get template() {
    return createFilmsListExtraTemplate(this.#extraBlockType);
  }
}

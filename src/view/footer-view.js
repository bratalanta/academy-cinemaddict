import AbstractView from '../framework/view/abstract-view.js';

const createFooterTemplate = (filmsCount) => (
  `<footer class="footer">
    <section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
      <p>${filmsCount} movies inside</p>
    </section>
  </footer>`
);

export default class FooterView extends AbstractView {
  #filmsCount = null;

  constructor (filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFooterTemplate(this.#filmsCount);
  }
}

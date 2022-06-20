import AbstractView from '../framework/view/abstract-view.js';

const createFooterTemplate = () => (
  `<footer class="footer">
    <section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
      <!-- Количество фильмов -->
    </section>
  </footer>`
);

export default class FooterView extends AbstractView {
  get template() {
    return createFooterTemplate();
  }
}

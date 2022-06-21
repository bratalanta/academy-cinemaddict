import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createPopupSectionTemplate = () => (
  '<section class="film-details"></section>'
);

export default class PopupSectionView extends AbstractStatefulView {
  get template() {
    return createPopupSectionTemplate();
  }
}

import { createElement } from '../render.js';


const createContentTemplate = () => (
  `<ul class="trip-events__list"></ul>
  `
);

export default class TripList {
  getTemplate() {
    return createContentTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

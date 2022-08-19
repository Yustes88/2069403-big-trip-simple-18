import { createElement } from '../render.js';


const createContentTemplate = () => (
  `<p class="trip-events__msg">Click New Event to create your first point</p>
  `
);

export default class PointsListEmptyView {
  #element = null;
  get template() {
    return createContentTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

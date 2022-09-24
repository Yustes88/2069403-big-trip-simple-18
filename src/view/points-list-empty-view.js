import { FILTER_TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const NoTripPointTextType = {
  [FILTER_TYPES.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPES.FUTURE]: 'There are no future events now',
};

const createContentTemplate = (filterType) => {
  const noTripPointTextValue = NoTripPointTextType[filterType];
  return `
  <p class="trip-events__msg">${noTripPointTextValue}</p>
  `;
};

export default class PointsListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createContentTemplate(this.#filterType);
  }
}

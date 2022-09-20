import AbstractView from '../framework/view/abstract-view.js';


const createContentItemTemplate = (filter, currentFilterType) => {
  const {type, name,count} = filter;
  return (`
  <div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>
  `);
};

const createContentTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, currentFilterType) => createContentItemTemplate(filter, currentFilterType))
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      </form>`;

};

export default class FiltersFormView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createContentTemplate(this.#filters);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}

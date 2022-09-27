import { FILTER_TYPES, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import { filter } from '../utile/filter-utile';
import FiltersFormView from '../view/filters-form-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const tripPoints = this.#pointsModel.points;

    return [
      {
        type: FILTER_TYPES.EVERYTHING,
        name: 'everything',
        count: filter[FILTER_TYPES.EVERYTHING](tripPoints).length,
      },
      {
        type: FILTER_TYPES.FUTURE,
        name: 'future',
        count: filter[FILTER_TYPES.FUTURE](tripPoints).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersFormView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

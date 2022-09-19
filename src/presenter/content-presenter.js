import { remove, render, RenderPosition } from '../framework/render.js';
import SortFormView from '../view/sort-form-view.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import TripList from '../view/trip-list.js';
import TripPointPresenter from './trip-point-presenter.js';
import { FILTER_TYPES, SORT_TYPES, UpdateType, UserAction } from '../const.js';
import { sortDate, sortPrice } from '../utile/sort-utile.js';
import { filter } from '../utile/filter-utile.js';
import TripPointNewPresenter from './point-new-presenter.js';


export default class ContentPresenter {
  #mainContainer = null;
  #tripPointModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #sortFormComponent = null;

  #tripPointsPresenter = new Map();
  #tripPointNewPresenter = null;

  #tripListComponent = new TripList();
  #pointsListEmptyComponent = null;

  #currentSortType = SORT_TYPES.DATE;
  #filterType = FILTER_TYPES.EVERYTHING;

  //check
  constructor(mainContainer, tripPointModel, offersModel, destinationsModel, filterModel){
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#tripPointNewPresenter = new TripPointNewPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#offersModel, this.#destinationsModel);

    this.#tripPointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get tripPoints() {
    const tripPoints = this.#tripPointModel.points;
    this.#filterType = this.#filterModel.filter;
    const filteredTripPoint = filter[this.#filterType](tripPoints);

    switch(this.#currentSortType) {
      case SORT_TYPES.PRICE:
        return filteredTripPoint.sort(sortPrice);
      case SORT_TYPES.DATE:
        return filteredTripPoint.sort(sortDate);
    }
    return filteredTripPoint;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init = () => {
    this.#renderContentBoard();
  };

  createPoint = (callback) => {
    this.#currentSortType = SORT_TYPES.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FILTER_TYPES.EVERYTHING);
    this.#tripPointNewPresenter.init(callback);
  };

  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#handleModeChange);
    tripPointPresenter.init(tripPoint, this.offers, this.destinations);
    this.#tripPointsPresenter.set(tripPoint.id, tripPointPresenter);
  };


  #renderPointsListEmpty = () => {
    this.#pointsListEmptyComponent = new PointsListEmptyView(this.#filterType);
    render(this.#pointsListEmptyComponent, this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
  };


  #renderSort = () => {
    this.#sortFormComponent = new SortFormView(this.#currentSortType);
    this.#sortFormComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortFormComponent, this.#mainContainer);
  };

  #renderContentBoard = () => {
    const tripPoints = this.tripPoints;
    const tripPointsCount = tripPoints.length;
    this.#renderSort();

    render(this.#tripListComponent, this.#mainContainer);

    if (tripPointsCount === 0) {
      this.#renderPointsListEmpty();
      return;
    }

    for (let i = 0; i < tripPointsCount; i++) {
      this.#renderPoint(this.tripPoints[i]);
    }
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenter.clear();

    remove(this.#sortFormComponent);
    remove(this.#renderPointsListEmpty);

    if (resetSortType) {
      this.#currentSortType = SORT_TYPES.DATE;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderContentBoard();
  };


  #clearPointList = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenter.clear();
  };

  #handleModeChange = () => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#tripPointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointsPresenter.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderContentBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderContentBoard();
        break;
    }
  };

}

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
  #mainContainer = null; //check
  #tripPointModel = null; //check
  #filterModel = null; //check

  #sortFormComponent = null; //check
  #filterComponent = null; // check

  #tripPointsPresenter = new Map(); //check
  #tripPointNewPresenter = null; // check

  #tripListComponent = new TripList(); //check
  #pointsListEmptyComponent = null; //check

  #currentSortType = SORT_TYPES.DATE; //check
  #filterType = FILTER_TYPES.EVERYTHING; //check

  //check
  constructor(mainContainer, tripPointModel, filterModel){
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;
    this.#filterModel = filterModel;
    this.#tripPointNewPresenter = new TripPointNewPresenter(this.#tripListComponent, this.#handleViewAction);

    this.#tripPointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get tripPoints() {
    const tripPoints = this.#tripPointModel.tripPoint;
    this.#filterType = this.#filterModel.filter;
    const filteredTripPoint = filter[this.#filterType](tripPoints);

    switch(this.#currentSortType) {
      case SORT_TYPES.PRICE:
        return filteredTripPoint.sort(sortPrice);
    }
    return filteredTripPoint.sort(sortDate);
  }

  init = () => {
    this.#renderContentBoard();
  };

  //check
  createPoint = (callback) => {
    this.#currentSortType = SORT_TYPES.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FILTER_TYPES.EVERYTHING);
    this.#tripPointNewPresenter.init(callback);
  };

  //check
  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#handleModeChange);
    tripPointPresenter.init(tripPoint);
    this.#tripPointsPresenter.set(tripPoint.id, tripPointPresenter);
  };

  //check
  #renderTripPoints = () => {
    for(let i = 0; i < this.tripPoints.length; i++) {
      this.#renderPoint(this.tripPoints[i]);
    }
  };

  //check
  #renderPointsListEmpty = () => {
    this.#pointsListEmptyComponent = new PointsListEmptyView(this.#filterType);
    render(this.#pointsListEmptyComponent, this.#mainContainer);
  };

  //check
  #renderSort = () => {
    this.#sortFormComponent = new SortFormView(this.#currentSortType);
    this.#sortFormComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortFormComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
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

    render(this.#tripListComponent, this.#mainContainer);

    this.#renderTripPoints();
  };

  //check
  #clearBoard = ({resetSortType = false} = {}) => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenter.clear();

    remove(this.#sortFormComponent);
    remove(this.#pointsListEmptyComponent);
    remove(this.#filterComponent);

    if(this.#pointsListEmptyComponent) {
      remove(this.#pointsListEmptyComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SORT_TYPES.DATE;
    }
  };

  //check
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderContentBoard();
  };


  //check
  #handleModeChange = () => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  };

  //check
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

  //check
  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointsPresenter.get(data.id).init(data);
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

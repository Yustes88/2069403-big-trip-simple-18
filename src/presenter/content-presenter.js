import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utile/common.js';
import SortFormView from '../view/sort-form-view.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import TripList from '../view/trip-list.js';
import TripPointPresenter from './trip-point-presenter.js';
import { SORT_TYPES } from '../const.js';
import { sortDate, sortPrice } from '../utile/sort-utile.js';


export default class ContentPresenter {
  #mainContainer = null;
  #tripPointModel = null;
  #contentPoints = null;
  #sourcedTripPoints = [];
  #tripPointsPresenter = new Map();
  #currentSortType = SORT_TYPES.DATE;


  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripList();
  #pointsListEmptyComponent = new PointsListEmptyView();


  constructor(mainContainer, tripPointModel){
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;

  }

  init = () => {
    this.#contentPoints = [...this.#tripPointModel.points];
    this.#sourcedTripPoints = [...this.#tripPointModel.points];

    this.#sortTripPoints();
    this.#renderPoints();
  };

  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripListComponent.element, this.#handleTripPointChange, this.#handleModeChange);
    tripPointPresenter.init(tripPoint);
    this.#tripPointsPresenter.set(tripPoint.id, tripPointPresenter);
  };

  #renderPoints = () => {
    if(this.#contentPoints.length) {
      for(let i = 0; i < this.#contentPoints.length; i++) {
        this.#renderPoint(this.#contentPoints[i]);
      }
      this.#renderPointsList();
    }
    else {
      this.#renderPointsListEmpty();
    }
    this.#renderSort();
  };

  #renderPointsListEmpty = () => {
    render(this.#pointsListEmptyComponent, this.#mainContainer);
  };

  #renderPointsList = () => {
    render(this.#tripListComponent, this.#mainContainer);
  };

  #renderSort = () => {
    render(this.#sortFormComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
    this.#sortFormComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #sortTripPoints = (sortType) => {
    switch(sortType) {
      case SORT_TYPES.PRICE:
        this.#contentPoints.sort(sortPrice);
        break;
      default:
        this.#contentPoints.sort(sortDate);
    }
    this.#currentSortType = sortType;
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTripPoints(sortType);
    this.#clearPointList();
    this.#renderPoints();
  };


  #clearPointList = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenter.clear();
  };

  #handleModeChange = () => {
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleTripPointChange = (updatedTripPoint) => {
    this.#contentPoints = updateItem(this.#contentPoints, updatedTripPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedTripPoint);
    this.#tripPointsPresenter.get(updatedTripPoint.id).init(updatedTripPoint);

  };

}

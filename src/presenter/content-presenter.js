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
  #tripPoint = null;
  #contentPoint = [];
  #sourcedTripPoints = [];
  #tripPointPresenter = new Map();
  #currentSortType = SORT_TYPES.DATE;


  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripList();
  #pointsListEmptyComponent = new PointsListEmptyView();


  constructor(mainContainer, tripPointModel){
    this.#mainContainer = mainContainer;
    this.#tripPoint = tripPointModel;

  }

  init = () => {
    this.#contentPoint = [...this.#tripPoint.points];
    this.#sourcedTripPoints = [...this.#tripPoint.points];


    this.#renderContent();
  };

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleTripPointChange = (updatedTripPoint) => {
    this.#contentPoint = updateItem(this.#contentPoint, updatedTripPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedTripPoint);
    this.#tripPointPresenter.get(updatedTripPoint.id).init(updatedTripPoint);

  };

  #sortTripPoints = (sortType) => {
    switch(sortType) {
      case SORT_TYPES.DATE:
        this.#contentPoint.sort(sortDate);
        break;
      case SORT_TYPES.PRICE:
        this.#contentPoint.sort(sortPrice);
        break;
      default:
        this.#contentPoint = [...this.#sourcedTripPoints];
    }
    this.#currentSortType = sortType;
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTripPoints(sortType);
    this.#clearPointList();
    this.#renderPointsList();
  };

  #renderSort = () => {
    render(this.#sortFormComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
    this.#sortFormComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };


  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripListComponent.element, this.#handleTripPointChange, this.#handleModeChange);
    tripPointPresenter.init(tripPoint);
    this.#tripPointPresenter.set(tripPoint.id, tripPointPresenter);
  };

  #renderPoints = () => {
    for(let i = 0; i < this.#contentPoint.length; i++) {
      this.#renderPoint(this.#contentPoint[i]);
    }
  };

  #clearPointList = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();
  };

  #renderPointsList = () => {
    render(this.#tripListComponent, this.#mainContainer);
    this.#renderPoints();
  };

  #renderPointsListEmpty = () => {
    render(this.#pointsListEmptyComponent, this.#mainContainer, RenderPosition.BEFOREEND);
  };


  #renderContent = () => {
    if(this.#contentPoint.length === 0) {
      this.#renderPointsListEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();

  };

}

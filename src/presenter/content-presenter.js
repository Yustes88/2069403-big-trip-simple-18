import { remove, render, RenderPosition } from '../framework/render.js';
import SortFormView from '../view/sort-form-view.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import TripListView from '../view/trip-list-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import { FilterTypes, SortTypes, UpdateType, UserAction } from '../const.js';
import { sortDate, sortPrice } from '../utile/sort-utile.js';
import { filter } from '../utile/filter-utile.js';
import TripPointNewPresenter from './point-new-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};


export default class ContentPresenter {
  #mainContainer = null;
  #tripPointModel = null;
  #filterModel = null;
  #sortFormComponent = null;
  #filterComponent = null;

  #tripPointsPresenter = new Map();
  #tripPointNewPresenter = null;

  #tripListComponent = new TripListView();
  #loadingComponent = new LoadingView();
  #pointsListEmptyComponent = null;

  #currentSortType = SortTypes.DATE;
  #filterType = FilterTypes.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);


  constructor(mainContainer, tripPointModel, filterModel){
    this.#mainContainer = mainContainer;
    this.#tripPointModel = tripPointModel;
    this.#filterModel = filterModel;
    this.#tripPointNewPresenter = new TripPointNewPresenter(this.#tripListComponent, this.#handleViewAction);

    this.#tripPointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const tripPoints = this.#tripPointModel.points;

    const filteredTripPoint = filter[this.#filterType](tripPoints);

    if(this.#currentSortType === SortTypes.PRICE) {
      return filteredTripPoint.sort(sortPrice);
    }
    return filteredTripPoint.sort(sortDate);
  }

  init = () => {
    this.#renderContentBoard();
  };


  createPoint = (callback) => {
    this.#currentSortType = SortTypes.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#tripPointNewPresenter.init(callback, this.#tripPointModel.offers, this.#tripPointModel.destinations);
  };


  #renderPoint = (tripPoint) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#handleModeChange);
    tripPointPresenter.init(tripPoint, this.#tripPointModel.offers, this.#tripPointModel.destinations);
    this.#tripPointsPresenter.set(tripPoint.id, tripPointPresenter);
  };


  #renderTripPoints = () => {
    for(const element of this.points) {
      this.#renderPoint(element);
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };


  #renderPointsListEmpty = () => {
    this.#pointsListEmptyComponent = new PointsListEmptyView(this.#filterType);
    render(this.#pointsListEmptyComponent, this.#mainContainer);
  };


  #renderSort = () => {
    this.#sortFormComponent = new SortFormView(this.#currentSortType);
    this.#sortFormComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortFormComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #renderContentBoard = () => {
    render(this.#tripListComponent, this.#mainContainer);

    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const tripPoints = this.points;
    const tripPointsCount = tripPoints.length;
    this.#renderSort();


    if (tripPointsCount === 0) {
      this.#renderPointsListEmpty();
      return;
    }

    render(this.#tripListComponent, this.#mainContainer);

    this.#renderTripPoints();
  };


  #clearBoard = ({resetSortType = false} = {}) => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointsPresenter.clear();

    remove(this.#sortFormComponent);
    remove(this.#loadingComponent);
    remove(this.#filterComponent);

    if(this.#pointsListEmptyComponent) {
      remove(this.#pointsListEmptyComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortTypes.DATE;
    }
  };


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderContentBoard();
  };


  #handleModeChange = () => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointsPresenter.forEach((presenter) => presenter.resetView());
  };


  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointsPresenter.get(update.id).setSaving();
        try {
          await this.#tripPointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#tripPointsPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#tripPointNewPresenter.setSaving();
        try {
          await this.#tripPointModel.addPoint(updateType, update);
        } catch(arr) {
          this.#tripPointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointsPresenter.get(update.id).setDeleting();
        try {
          await this.#tripPointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#tripPointsPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };


  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointsPresenter.get(data.id).init(data, this.#tripPointModel.offers, this.#tripPointModel.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderContentBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderContentBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderContentBoard();
        break;
    }
  };

}

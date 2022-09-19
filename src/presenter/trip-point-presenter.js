import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import TripsModel from '../model/trip-point-model.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormEditView from '../view/trip-form-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  #tripPointListContainer = null;
  #tripPointComponent = null;
  #tripPointEditComponent = null;
  #changeData = null;
  #changeMode = null;

  #tripPoint = null;
  #offers = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  constructor(tripPointListContainer, changeData, changeMode) {
    this.#tripPointListContainer = tripPointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (tripPoint, offers, destinations) => {
    this.#tripPoint = tripPoint;
    this.#offers = offers;
    this.#destinations = destinations;
    this.tripPointsModel = new TripsModel();
    this.tripPoints = this.tripPointsModel.tripPoint;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#tripPointComponent = new TripEventItemView(this.#tripPoint, this.tripPointsModel, this.#offers, this.#destinations);
    this.#tripPointEditComponent = new TripFormEditView(this.#tripPoint, this.#offers, this.#destinations);

    this.#tripPointComponent.setRollUpClickHandler(this.#handleRollUpClick);

    this.#tripPointEditComponent.setRollDownClickHandler(this.#handleRollDownClick);

    this.#tripPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if(prevTripPointComponent === null || prevTripPointEditComponent === null) {
      render(this.#tripPointComponent, this.#tripPointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#tripPointEditComponent.reset(this.#tripPoint, this.#offers, this.#destinations);
      this.#replaceFormWithPoint();
    }
  };

  #replacePointWithForm = () => {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormWithPoint = () => {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#tripPointEditComponent.reset(this.#tripPoint);
      this.#replaceFormWithPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleRollUpClick = () => {
    this.#replacePointWithForm();
  };

  #handleRollDownClick = () => {
    this.#tripPointEditComponent.reset(this.#tripPoint);
    this.#replaceFormWithPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (tripPoint) => {
    this.#replaceFormWithPoint();
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      tripPoint,
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  };
}

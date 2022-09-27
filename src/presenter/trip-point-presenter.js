import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import { isDatesSame, isPriceSame } from '../utile/trip-point-utile.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormEditView from '../view/trip-form-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  #tripPointListContainer = null;
  #tripPoint = null;
  #offers = null;
  #destinations = null;

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #changeData = null;
  #changeMode = null;
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

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;


    this.#tripPointComponent = new TripEventItemView(tripPoint, this.#offers, this.#destinations );
    this.#tripPointEditComponent = new TripFormEditView(tripPoint, this.#offers, this.#destinations);

    this.#tripPointComponent.setRollUpClickHandler(this.#handleRollUpClick);

    this.#tripPointEditComponent.setRollDownClickHandler(this.#handleRollDownClick);

    this.#tripPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#tripPointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

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

  //check
  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#tripPointEditComponent.reset(this.#tripPoint);
      this.#replaceFormWithPoint();
    }
  };

  //check
  #replacePointWithForm = () => {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  //check
  #replaceFormWithPoint = () => {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  //check
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#tripPointEditComponent.reset(this.#tripPoint);
      this.#replaceFormWithPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };


  //check
  #handleRollUpClick = () => {
    this.#replacePointWithForm();
  };

  //check
  #handleRollDownClick = () => {
    this.#tripPointEditComponent.reset(this.#tripPoint);
    this.#replaceFormWithPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  //check
  #handleFormSubmit = (update) => {
    const isMinorUpdate =
    !isDatesSame(this.#tripPoint, update) ||
    !isPriceSame(this.#tripPoint, update);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormWithPoint();
  };

  //check
  #handleDeleteClick = (tripPoint) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      tripPoint,
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  //check
  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  };
}

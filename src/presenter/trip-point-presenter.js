import { remove, render, replace } from '../framework/render.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormEditView from '../view/trip-form-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  #tripPointListContainer = null;
  #tripPoint = null;

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

  init = (tripPoint) => {
    this.#tripPoint = tripPoint;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#tripPointComponent = new TripEventItemView(tripPoint);
    this.#tripPointEditComponent = new TripFormEditView(tripPoint);

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
      this.#tripPointEditComponent.reset(this.#tripPoint);
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
    this.#changeData(tripPoint);
    this.#replaceFormWithPoint();
  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  };
}

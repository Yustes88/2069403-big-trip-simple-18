import { remove, render, replace } from '../framework/render.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormEditView from '../view/trip-form-edit-view.js';

export default class TripPointPresenter {
  #tripPointListContainer = null;

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #tripPoint = null;

  constructor(tripPointListContainer) {
    this.#tripPointListContainer = tripPointListContainer;
  }

  init = (tripPoint) => {
    this.#tripPoint = tripPoint;

    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#tripPointComponent = new TripEventItemView(tripPoint);
    this.#tripPointEditComponent = new TripFormEditView(tripPoint);

    this.#tripPointComponent.setRollUpClickHandler(this.#handleRollUpClick);

    this.#tripPointEditComponent.setRollUpClickHandler(this.#handleRollDownClick);

    this.#tripPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if(prevTripPointComponent === null || prevTripPointEditComponent === null) {
      render(this.#tripPointComponent, this.#tripPointListContainer);
      return;
    }

    if(this.#tripPointListContainer.contains(prevTripPointComponent.element)) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if(this.#tripPointListContainer.contains(prevTripPointEditComponent.element)) {
      replace(this.#tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  };

  #replacePointWithForm = () => {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormWithPoint = () => {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormWithPoint();
    }
  };

  #handleRollUpClick = () => {
    this.#replacePointWithForm();
  };

  #handleRollDownClick = () => {
    this.#replaceFormWithPoint();
  };

  #handleFormSubmit = () => {
    this.#replaceFormWithPoint();
  };
}

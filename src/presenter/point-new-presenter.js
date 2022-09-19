import { nanoid } from 'nanoid';
import { UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import TripFormEditView from '../view/trip-form-edit-view.js';

export default class TripPointNewPresenter {
  #tripListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destroyCallback = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor(tripListContainer, changeData, offersModel, destinationsModel) {
    this.#tripListContainer = tripListContainer;
    this.#changeData = changeData;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    const offers = this.#offersModel.offers;
    const destinations = this.#destinationsModel.destinations;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new TripFormEditView(undefined, offers, destinations);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setClickHandler(this.#handleClick);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#tripListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#destroyCallback?.();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { id: nanoid(), ...point },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

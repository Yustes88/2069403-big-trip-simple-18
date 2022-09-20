import { nanoid } from 'nanoid';
import { UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import TripFormEditView from '../view/trip-form-edit-view.js';

export default class TripPointNewPresenter {
  #tripListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destroyCallback = null;


  constructor(tripListContainer, changeData) {
    this.#tripListContainer = tripListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new TripFormEditView();
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#tripListContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  //check
  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#destroyCallback?.();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  //check
  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { id: nanoid(), ...point },
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  //check
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

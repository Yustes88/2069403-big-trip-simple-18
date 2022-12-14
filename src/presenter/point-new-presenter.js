import { NEW_POINT, UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { isEscKey } from '../utile/trip-point-utile.js';
import TripFormEditView from '../view/trip-form-edit-view.js';

export default class TripPointNewPresenter {
  #tripListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destroyCallback = null;
  #offers = null;
  #destinations = null;


  constructor(tripListContainer, changeData) {
    this.#tripListContainer = tripListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#destroyCallback = callback;
    this.#offers = offers;
    this.#destinations = destinations;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new TripFormEditView(NEW_POINT, this.#offers, this.#destinations);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#formDeleteClickHandler);
    this.#pointEditComponent.setRollDownClickHandler(this.#handleRollDownClick);

    render(this.#pointEditComponent, this.#tripListContainer.element, RenderPosition.AFTERBEGIN);

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

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };


  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #formDeleteClickHandler = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleRollDownClick = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };


  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}

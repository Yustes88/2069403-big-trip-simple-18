import { TRIP_POINT_ITEMS } from '../const.js';
import Observable from '../framework/observable.js';
import { generateTripPoint } from '../mock/trip-point-mock.js';

export default class TripsModel extends Observable {
  #tripPoint = Array.from({length: TRIP_POINT_ITEMS }, generateTripPoint);

  get tripPoint() {
    return this.#tripPoint;
  }

  updatePoint = (updateType, update) => {
    const index = this.#tripPoint.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#tripPoint = [
      ...this.#tripPoint.slice(0, index),
      update,
      ...this.#tripPoint.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#tripPoint = [
      update,
      ...this.#tripPoint,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#tripPoint.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#tripPoint = [
      ...this.#tripPoint.slice(0, index),
      ...this.#tripPoint.slice(index + 1),
    ];

    this._notify(updateType);
  };
}

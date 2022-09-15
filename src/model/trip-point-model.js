import { TRIP_POINT_ITEMS } from '../const.js';
import Observable from '../framework/observable.js';
import { generateTripPoint } from '../mock/trip-point-mock.js';

export default class TripsModel extends Observable {
  #tripPoint = Array.from({length: TRIP_POINT_ITEMS }, generateTripPoint);

  get points() {
    return this.#tripPoint;
  }
}

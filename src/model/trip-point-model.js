import { TRIP_POINT_ITEMS } from '../const.js';
import { generateTripPoint } from '../mock/trip-point-mock.js';

export default class TripsModel {
  tripPoint = Array.from({length: TRIP_POINT_ITEMS }, generateTripPoint);

  getPoints = () => this.tripPoint;
}

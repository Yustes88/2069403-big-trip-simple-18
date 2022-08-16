import { getDestination } from '../mock/destination-mock';
import { getOffers } from '../mock/offers-mock';
import { generateTripPoint } from '../mock/trip-point-mock.js';

export default class TripsModel {
  tripPoint = Array.from({length: 5}, generateTripPoint);
  tripDestination = getDestination();
  tripOffers = getOffers();

  getTripPoint = () => this.tripPoint;
  getDestination = () => this.tripDestination;
  getTripOffers = () => this.tripOffers;
}

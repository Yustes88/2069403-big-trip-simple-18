import dayjs from 'dayjs';

const OFFER_TYPES = ['taxi','bus','train','ship','drive','flight','check-in', 'sightseeing','restaurant'];

const OFFERS_EXTRA = ['Add luggage', 'Choose seats', 'Add meal', 'Comfort class', 'Business class'];

const DESTINATIONS = ['Chamonix', 'Amsterdam', 'Rome', 'Madrid', 'Geneva'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'
];

const TRIP_POINT_ITEMS = 10;

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const SORT_TYPES = {
  DATE: 'day',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const NewPoint = {
  dateFrom: dayjs(),
  dateTo: dayjs(),
  type: OFFER_TYPES[0],
  basePrice: 0,
  offers: [],
};

export {OFFER_TYPES, DESTINATIONS, DESCRIPTIONS, OFFERS_EXTRA, TRIP_POINT_ITEMS, FILTER_TYPES, SORT_TYPES, UserAction, UpdateType, NewPoint};

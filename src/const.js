import dayjs from 'dayjs';

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
  INIT: 'INIT',
};

const NEW_POINT = {
  dateFrom: dayjs(),
  dateTo: dayjs(),
  type: 'flight',
  basePrice: 50,
  offers: [],
};

export {FILTER_TYPES, SORT_TYPES, UserAction, UpdateType, NEW_POINT};

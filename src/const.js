import dayjs from 'dayjs';

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const SortTypes = {
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

export {FilterTypes, SortTypes, UserAction, UpdateType, NEW_POINT};

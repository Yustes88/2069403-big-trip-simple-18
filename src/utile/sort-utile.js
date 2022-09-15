import dayjs from 'dayjs';

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortDate = (tripPointA, tripPointB) => {
  const weight = getWeightForNullDate(tripPointA.dateFrom, tripPointB.dateFrom);

  return weight ?? dayjs(tripPointA.dateFrom).diff(dayjs(tripPointB.dateFrom));
};

const sortPrice = (tripPointA, tripPointB) => tripPointB.basePrice - tripPointA.basePrice;


export {sortDate, sortPrice};

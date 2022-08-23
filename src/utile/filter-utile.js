import { FILTER_TYPES } from '../const.js';
import { isDateAfter, isDateBefore, isDateSame } from './trip-point-utile.js';

const filter = {
  [FILTER_TYPES.EVERYTHING]: (tripPoints) => tripPoints.map((tripPoint) => tripPoint),
  [FILTER_TYPES.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => isDateAfter(tripPoint.dateFrom) || isDateSame(tripPoint.dateFrom) || isDateBefore(tripPoint.dateFrom) && isDateAfter(tripPoint.dateTo)),
};

export {filter};

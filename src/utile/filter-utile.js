import dayjs from 'dayjs';
import { FILTER_TYPES } from '../const.js';

const filter = {
  [FILTER_TYPES.EVERYTHING]: (tripPoints) => tripPoints,
  [FILTER_TYPES.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => dayjs().isBefore(tripPoint.dateFrom) || dayjs().isBefore(tripPoint.dateTo)),
};

export {filter};

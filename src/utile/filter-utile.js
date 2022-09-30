import dayjs from 'dayjs';
import { FilterTypes } from '../const.js';

const filter = {
  [FilterTypes.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterTypes.FUTURE]: (tripPoints) => tripPoints.filter((tripPoint) => dayjs().isBefore(tripPoint.dateFrom) || dayjs().isBefore(tripPoint.dateTo)),
};

export {filter};

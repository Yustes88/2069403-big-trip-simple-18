import { filter } from '../utile/filter-utile.js';

export const generateFilter = () => Object.entries(filter).map(
  ([filterName]) => ({
    name: filterName,
    count: 0,
  }),
);

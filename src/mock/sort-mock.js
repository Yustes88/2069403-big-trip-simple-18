import { sort } from '../utile/sort-utile.js';

export const generateSort = () => Object.entries(sort).map(
  ([filterName]) => ({
    name: filterName,
    count: 0,
  }),
);

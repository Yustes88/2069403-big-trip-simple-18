import { SORT_TYPES } from '../const.js';


const sort = {
  [SORT_TYPES.DATE]: (tripPoints) => tripPoints.sort((a, b) => a.dateFrom - b.dateFrom),
  [SORT_TYPES.EVENT]: (tripPoints) => tripPoints,
  [SORT_TYPES.TIME]: (tripPoints) => tripPoints,
  [SORT_TYPES.PRICE]: (tripPoints) => tripPoints.sort((a, b) => b.basePrice - a.basePrice),
  [SORT_TYPES.OFFER]: (tripPoints) => tripPoints,
};

export {sort};

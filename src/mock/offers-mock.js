import { OFFERS_EXTRA, OFFER_TYPES } from '../const.js';
import { getRandomElements, getRandomInteger } from '../utile/common.js';

const mockOffers = [];
for (let i = 0; i < OFFERS_EXTRA.length; i++) {
  mockOffers.push({
    id: i,
    title: OFFERS_EXTRA[i],
    price: getRandomInteger(10, 200),
  });
}

const mockOffersByType = [];
for (let i = 0; i < OFFER_TYPES.length; i++) {
  mockOffersByType.push({
    type: OFFER_TYPES[i],
    offers: getRandomElements(mockOffers),
  });
}


export {mockOffers, mockOffersByType};

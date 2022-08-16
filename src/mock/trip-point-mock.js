import { OFFER_TYPES } from '../const.js';
import { getRandomInteger, shuffleElements } from '../utile.js';
import { getDestination } from './destination-mock.js';
import { getOffers } from './offers-mock.js';

const offersList = getOffers();

const getRandomTripType = (tripTypes) => {
  const tripTypeIndex = getRandomInteger(0, tripTypes.length);
  return tripTypes[tripTypeIndex];
};

const getOfferIds = (type) => {
  const offers = offersList.find((offer) => offer.type === type).offers;

  return shuffleElements(offers).slice(0, getRandomInteger(0, offers.length)).map((offer) => offer.id);
};

export const generateTripPoint = () => {
  const type = getRandomTripType(OFFER_TYPES);
  const offers = getOfferIds(type);

  return ({
    'basePrice': `${getRandomInteger(100, 1000)}`,
    'dateFrom': `2019-07-${getRandomInteger(1,5)}T22:55:56.845Z`,
    'dateTo': `2019-07-${getRandomInteger(6, 11)}T11:22:13.375Z`,
    'destination': `${getDestination().id}`,
    'id': `${getRandomInteger(1, 20)}`,
    offers,
    type,
  });
};


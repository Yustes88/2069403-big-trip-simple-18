import { nanoid } from 'nanoid';
import {getRandomElements, getRandomInteger } from '../utile/common.js';
import { mockOffersByType } from './offers-mock.js';


const generateDate = () => {
  const min = getRandomInteger(0, 39);
  const hour = getRandomInteger(0, 17);
  const day = getRandomInteger(1, 30);
  const month = getRandomInteger(0, 11);
  const year = getRandomInteger(2021, 2025);

  const dateFrom = new Date(year, month, day, hour, min);
  const dateTo = new Date(year, month + 1, day + 3, hour + 4, min + 20);

  return { dateFrom, dateTo };
};

export const generateTripPoint = () => {
  const dateMock = generateDate();
  const typeAndOffers = mockOffersByType[getRandomInteger(0, mockOffersByType.length - 1)];
  return {
    'basePrice': getRandomInteger(100, 2000),
    'dateFrom': dateMock.dateFrom,
    'dateTo': dateMock.dateTo,
    'destination': getRandomInteger(0, 4),
    'id': nanoid(),
    'offers': getRandomElements(typeAndOffers.offers),
    'type': typeAndOffers.type,
  };
};


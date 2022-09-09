import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import {getRandomElements, getRandomInteger } from '../utile/common.js';
import { mockOffersByType } from './offers-mock.js';


const generateDate = () => {
  const min = getRandomInteger(1, 60);
  const hour = getRandomInteger(1, 24);
  const day = getRandomInteger(1, 31);

  const dateFrom = dayjs().add(day, 'day').add(hour, 'hour').add(min, 'minute');
  const dateTo = dateFrom.add(hour, 'hour').add(min, 'minute');

  return { dateFrom, dateTo };
};

export const generateTripPoint = () => {
  const dateMock = generateDate();
  const typeAndOffers = mockOffersByType[getRandomInteger(0, mockOffersByType.length - 1)];
  return {
    'basePrice': getRandomInteger(100, 2000),
    'dateFrom': dateMock.dateFrom,
    'dateTo': dateMock.dateTo,
    'destination': getRandomInteger(1, 3),
    'id': nanoid(),
    'offers': getRandomElements(typeAndOffers.offers),
    'type': typeAndOffers.type,
  };
};


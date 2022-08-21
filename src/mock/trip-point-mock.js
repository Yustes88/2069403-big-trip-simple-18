import { OFFERS, OFFER_TYPES} from '../const.js';
import {getRandomInteger } from '../utile/common.js';

const generateType = () => {
  const types = OFFER_TYPES;
  const typesIndex = getRandomInteger(0, types.length - 1);
  return types[typesIndex];
};

const generateOffers = () => {
  const offers = OFFERS;
  const offerIndex = getRandomInteger(0, offers.length - 1);
  return offers[offerIndex];
};

const generatePicture = () => `http://picsum.photos/248/152?r=${getRandomInteger(1, 5)}`;

export const offer = [{
  id: 1,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},
{
  id: 2,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
},
{
  id: 3,
  type: generateType(),
  title: generateOffers(),
  price: getRandomInteger(100,1000)
}];


export const destinations = [{
  id: 1,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  name: 'Chamonix',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'Beautiful Mountains'
  }]
},
{
  id: 2,
  description: 'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  name: 'Rome',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'Italian Alps'
  }]
},
{
  id: 3,
  description: 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  name: 'Amsterdam',
  pictures: [{
    src: Array.from({length: 4}, generatePicture),
    description: 'Mountains'
  }]
}
];

export const generateTripPoint = () => ({
  'basePrice': getRandomInteger(100, 2000),
  'dateFrom': '2019-07-10T22:55:56.845Z',
  'dateTo': '2019-07-11T11:22:13.375Z',
  'destination': getRandomInteger(1, 3),
  'id': getRandomInteger(1, 5),
  'offers': getRandomInteger(1, 3),
  'type': generateType(),
}
);


import { DESCRIPTIONS, DESTINATIONS } from '../const.js';
import { getRandomElements, getRandomInteger } from '../utile/common.js';

const generateDestination = (id) => ({
  id,
  description: getRandomElements(DESCRIPTIONS),
  name: DESTINATIONS[id],
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 50)}`,
      description: `${DESTINATIONS[id]} ${DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)].split().slice(0,1)}`,
    }
  ]
});

const getDestinations = (count) => {
  const tripPointDestinations = [];
  for (let i = 0; i < count; i++) {
    tripPointDestinations.push(generateDestination(i));
  }
  return tripPointDestinations;
};

const destinations = getDestinations(DESTINATIONS.length);

export { destinations };

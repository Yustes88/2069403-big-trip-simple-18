import { getRandomInteger } from '../utile.js';

const destinationDictionary = {
  description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.'],
  name: ['Chamonix', 'Geneva', 'Amsterdam', 'Helsinki', 'Oslo'],
};

const getRandomElement = (dictionary) => {
  const elementIndex = getRandomInteger(0, dictionary.length - 1);
  return dictionary[elementIndex];
};

const destination = {
  'id': `${getRandomInteger(1, 6)}`,
  'description': `${getRandomElement(destinationDictionary.description)}`,
  'name': `${getRandomElement(destinationDictionary.name)}`,
  'pictures': [
    {
      'src': `http://picsum.photos/300/200?r=${getRandomInteger(1, 50)}`,
      'description': `${getRandomElement(destinationDictionary.description)}`,
    }
  ]
};

const getDestination = () => destination;

export {getDestination};

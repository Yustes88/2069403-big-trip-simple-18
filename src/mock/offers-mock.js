const OFFERS = [
  {
    type: 'taxi',
    offers: [
      {id: 1, title: 'Upgrade to a business class', price: 190},
      {id: 2, title: 'Drive slowly', price: 100},
      {id: 3, title: 'Small talk', price: 150},
    ]
  }, {
    type: 'bus',
    offers: [
      {id: 1, title: 'Choose seats', price: 150},
      {id: 2, title: 'Order meal', price: 100},
      {id: 3, title: 'Wake up on time', price: 50},
    ]
  }, {
    type: 'train',
    offers: [
      {id: 1, title: 'Comform cabins', price: 150},
      {id: 2, title: 'Order a meal', price: 80},
      {id: 3, title: 'Wake up on time', price: 140}
    ]
  }, {
    type: 'flight',
    offers: [
      {id: 1, title: 'Choose seats', price: 120},
      {id: 2, title: 'Add baggage', price: 90},
      {id: 3, title: 'Upgrade to comfort class', price: 150},
    ]
  }, {
    type: 'check-in',
    offers: [
      {id: 1, title: 'Early check-in', price: 70},
      {id: 2, title: 'Add breakfast', price: 100},
      {id: 3, title: 'Late check-out', price: 70}
    ]
  }, {
    type: 'sightseeing',
    offers: []
  }, {
    type: 'ship',
    offers: [
      {id: 1, title: 'Choose seats', price: 120},
      {id: 2, title: 'Add baggage', price: 90},
      {id: 3, title: 'Upgrade to comfort class', price: 150},
    ]
  }, {
    type: 'drive',
    offers: [
      {id: 1, title: 'Air conditioning', price: 110},
      {id: 2, title: 'Child-seat', price: 180}
    ]
  }, {
    type: 'restaurant',
    offers: [
      {id: 1, title: 'Book your table in advance', price: 150},
      {id: 2, title: 'Non-smoking area', price: 70}
    ]
  }
];

const getOffers = () => OFFERS;

export {getOffers};

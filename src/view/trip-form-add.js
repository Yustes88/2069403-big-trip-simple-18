import { DESTINATIONS, OFFER_TYPES } from '../const.js';
import { destinations, offer } from '../mock/trip-point-mock.js';
import { createElement } from '../render.js';
import { humanizeDate } from '../utile.js';


const createContentTemplate = (tripPoint) => {
  const {basePrice, destination, dateFrom, dateTo, type, pointOffer} = tripPoint;

  const destinationNameComponent = destinations.find((el) => (el.id === destination)).name;
  const pointOfferType = offer.filter((el) => (el.type === type));
  const descriptionComponent = destinations.find((el) => (el.id === destination)).description;
  const photoComponent = destinations.find((el) => (el.id === destination)).pictures[0].src;
  const photoDescriptionComponent = destinations.find((el) => (el.id === destination)).pictures[0].description;

  const createPhotosTemplate = () => photoComponent.map((picture) =>
    `<img class="event__photo" src= "${picture}" alt="${photoDescriptionComponent}">`);

  const createType = (currentType) => OFFER_TYPES.map((pointType) =>
    `<div class="event__type-item">
   <input id="event-type-${pointType}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${currentType === 'checked'}>
   <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}">${pointType}</label>
   </div>`).join('');

  const createDestinationNamesListTemplate = () => (
    DESTINATIONS.map((name) =>
      `<option value="${name}"></option>`));

  const destinationListComponent = createDestinationNamesListTemplate(destination);

  const tripPointOfferComponent = pointOfferType.map((el) => {
    const checked = (pointOffer === el.id ) ? 'checked' : '';
    return ` <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-1" type="checkbox" ${checked} name="event-offer-luggage">
              <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title"> ${el.title} </span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price"> ${el.price} </span>
              </div>`;
  });

  const typeComponent = createType(type);

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typeComponent}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="${destinationNameComponent}">
        <datalist id="destination-list-1">
        ${destinationListComponent}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom)}">
          &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo)}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          ${basePrice}&euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${tripPointOfferComponent}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${descriptionComponent}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPhotosTemplate()};
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
};

export default class TripFormAddView {
  #element = null;
  #tripPoint = null;

  constructor(tripPoint) {
    this.#tripPoint = tripPoint;
  }

  get template() {
    return createContentTemplate(this.#tripPoint);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

import { DESTINATIONS, OFFER_TYPES } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { destinations, offer } from '../mock/trip-point-mock.js';
import { humanizeDate } from '../utile/trip-point-utile.js';

const createType = (currentType) => OFFER_TYPES.map((pointType) =>
  `<div class="event__type-item">
<input id="event-type-${pointType}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${currentType === 'checked'}>
<label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}">${pointType}</label>
</div>`).join('');

const editDestinationNamesListTemplate = () => (
  DESTINATIONS.map((name) =>
    `<option value="${ name }"></option>`));

const createContentTemplate = (tripPoint) => {
  const {basePrice, destination, dateFrom, dateTo, type, pointOffer, destinationNameTemplate = destinations.find((el) => (el.id === destination)).name} = tripPoint;

  const typeComponent = createType(type);
  const destinationNameListTemplate = editDestinationNamesListTemplate(destination).join('');

  const pointOfferType = offer.filter((el) => (el.type === type));

  const descriptionTemplate = destinations.map((el) => {
    if (destinationNameTemplate === null || destinationNameTemplate !== el.name){
      return null;
    }
    if (el.name === destinationNameTemplate){
      return el.description;
    }
  }).join('');

  const photoDescriptionComponent = destinations.find((el) => (el.id === destination)).pictures[0].description;

  const picturesTemplate = destinations.map((el) => {
    if (destinationNameTemplate === null || destinationNameTemplate !== el.name){
      return null;
    }

    if(el.name === destinationNameTemplate){
      return el.pictures[0].src.map((picture) =>`<img class="event__photo" src= "${ picture }" alt="${ photoDescriptionComponent }">`).join('');
    }
  }).join('');


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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationNameTemplate}" list="destination-list-1">
        ${destinationNameListTemplate}
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
      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>
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
        <p class="event__destination-description">${descriptionTemplate}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesTemplate}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
};

export default class TripFormEditView extends AbstractStatefulView {

  constructor(tripPoint) {
    super();
    this._state = TripFormEditView.parseTripPointToState(tripPoint);
  }

  get template() {
    return createContentTemplate(this._state);
  }

  setRollUpClickHandler = (callback) => {
    this._callback.rollUpClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#handleRollDownClick);
  };

  #handleRollDownClick = (evt) => {
    evt.preventDefault();
    this._callback.rollUpClick(TripFormEditView.parseTripPointToState(this._state));
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripFormEditView.parseStateToTripPoint(this._state));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSave);
    this.setRollUpClickHandler(this._callback.rollupEdit);
  };

  #typeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
    });
  };

  #destinationToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destinationNameTemplate: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.event__type-input').forEach((i) =>
      i.addEventListener('click', this.#typeToggleHandler));

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);
  };

  reset = (point) => {
    this.updateElement(
      TripFormEditView.parsePointToState(point)
    );
  };

  static parseTripPointToState = (tripPoint) => (
    {...tripPoint}
  );

  static parseStateToTripPoint = (state) => {
    const tripPoint = {...state};

    return tripPoint;
  };
}


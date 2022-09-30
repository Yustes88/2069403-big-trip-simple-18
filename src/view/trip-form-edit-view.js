import { NEW_POINT} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate, isPriceNumber } from '../utile/trip-point-utile.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';


const createContentTemplate = (tripPoint, pointOffers, pointDestinations, destinationsCityList) => {
  const {basePrice, destination, dateFrom, dateTo, type, offers, isDisabled, isSaving, isDeleting,} = tripPoint;

  const types = pointOffers ? pointOffers.map((offerByType) => offerByType.type) : '';

  const createDestinationListTemplate = (selectedCity) => {
    const cityName = pointDestinations.find((city) => city.id === selectedCity);

    return `
    <label class="event__label  event__type-output" for="event-destination-${selectedCity}">
    ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${selectedCity}" type="text" name="event-destination" value="${cityName ? cityName.name : ''}" list="destination-list-${selectedCity}" ${isDisabled ? 'disabled' : ''} required>
    <datalist id="destination-list-${selectedCity}">
    ${destinationsCityList.map((destinationCity) => `
    <option value="${destinationCity}" ${cityName && cityName.name === destinationCity ? 'selected' : ''}>`).join(' ')}
    </datalist>`;
  };

  const createType = (currentType) => types.map((pointType) =>
    `<div class="event__type-item">
  <input id="event-type-${pointType}-${destination}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${currentType === pointType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
  <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${destination}">${pointType}</label>
  </div>`).join('');

  const createPictures = (pictures) => {
    const chosenCity = pointDestinations.find((city) => city.id === pictures);
    return chosenCity ? chosenCity.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('') : '';
  };

  const typeTemplate = createType(type);

  const destinationNameListTemplate = createDestinationListTemplate(destination);

  const picturesTemplate = createPictures(destination);


  const isOfferChecked = (offer) => offers.includes(offer.id) ? 'checked' : '';

  const creatTripPointOffers = () => {
    const pointOfferType = pointOffers.find((el) => el.type === type).offers;
    return pointOfferType.map((offer) =>
      ` <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}" data-id="${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isOfferChecked(offer)} ${isDisabled ? 'disabled' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title"> ${offer.title} </span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price"> ${offer.price} </span>
              </div>`).join(' ');
  };

  const offersTemplate = creatTripPointOffers();


  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${destination}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${destination}" type="checkbox" ${isDisabled ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typeTemplate}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        ${destinationNameListTemplate}
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo)}" ${isDisabled ? 'disabled' : ''}>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${destination}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${destination}" type="text" name="event-price" value="${basePrice}" onkeyup="this.value = this.value.replace (/[^0-9]+$/, '')" ${isDisabled ? 'disabled' : ''}>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offersTemplate}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestinations[destination - 1] ? pointDestinations[destination - 1].description : ''}</p>
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
  #datePickerStart = null;
  #datePickerEnd = null;
  #pointOffers = null;
  #pointDestinations = null;
  #destinationsCityList = null;

  constructor(tripPoint = NEW_POINT, pointOffers, pointDestinations) {
    super();
    this.#pointOffers = pointOffers;
    this.#pointDestinations = pointDestinations;
    this.#destinationsCityList = this.#pointDestinations.map((city) => city.name);

    this._state = TripFormEditView.parseTripPointToState(tripPoint);


    this.#setInnerHandlers();
    this.#setDatePicker();
  }

  get template() {
    return createContentTemplate(this._state, this.#pointOffers, this.#pointDestinations, this.#destinationsCityList);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollDownClickHandler(this._callback.rollDownClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datePickerStart) {
      this.#datePickerStart.destroy();
      this.#datePickerStart = null;
    }

    if (this.#datePickerEnd) {
      this.#datePickerEnd.destroy();
      this.#datePickerEnd = null;
    }
  };

  reset = (tripPoint) => {
    this.updateElement(
      TripFormEditView.parseTripPointToState(tripPoint)
    );
  };


  setRollDownClickHandler = (callback) => {
    this._callback.rollDownClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#handleRollDownClick);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };


  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.event__type-input').forEach((evtType) =>
      evtType.addEventListener('click', this.#typeToggleHandler));

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);

    this.element.querySelectorAll('.event__offer-checkbox').forEach((eventType) => eventType.addEventListener('change', this.#eventSelectOffersToggleHandler));

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
  };

  #setDatePicker = () => {
    const eventStartTime = this.element.querySelector('#event-start-time-1');
    this.#datePickerStart = flatpickr(
      eventStartTime,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: eventStartTime.value,
        onChange: this.#startDateChangeHandler,
        enableTime: true,
        'time_24hr': true,
      },
    );
    const eventEndTime = this.element.querySelector('#event-end-time-1');
    this.#datePickerEnd = flatpickr(
      eventEndTime,
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: eventEndTime.value,
        minDate: eventStartTime.value,
        onChange: this.#endDateChangeHandler,
        enableTime: true,
        'time_24hr': true,
      },
    );
  };

  #handleRollDownClick = (evt) => {
    evt.preventDefault();
    this._callback.rollDownClick();
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(TripFormEditView.parseStateToTripPoint(this._state));
  };


  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(TripFormEditView.parseStateToTripPoint(this._state));
  };


  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    if((isPriceNumber(evt.target.value)) > 0) {
      this._setState({
        basePrice: evt.target.value,
      });
    }
    evt.target.value = '';
  };


  #typeToggleHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };


  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };


  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };


  #destinationToggleHandler = (evt) => {
    if(!(this.#destinationsCityList.includes(evt.target.value))) {
      return;
    }
    this.#pointDestinations.forEach((city) => {
      if(evt.target.value && city.name === evt.target.value) {
        this.updateElement({
          destination: city.id,
        });
      }
    });
  };


  #eventSelectOffersToggleHandler = () => {
    const selectOffers = [];
    Array.from(this.element.querySelectorAll('.event__offer-checkbox'))
      .forEach((checkbox) => checkbox.checked ? selectOffers.push(Number(checkbox.dataset.id)) : '');
    this.updateElement({
      offers: selectOffers,
    });
  };


  static parseTripPointToState = (tripPoint) => (
    {...tripPoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    }
  );

  static parseStateToTripPoint = (state) => {
    const tripPoint = {...state};
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return tripPoint;
  };
}

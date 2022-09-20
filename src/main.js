import FilterModel from './model/filter-model.js';
import TripsModel from './model/trip-point-model.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripControlElement = document.querySelector('.trip-main__trip-controls');
const siteContentWrapperElement = document.querySelector('.trip-events');
const newButtonElement = document.querySelector('.trip-main__event-add-btn');

const tripPointModel = new TripsModel();
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(siteContentWrapperElement, tripPointModel, filterModel);
const filterPresenterElement = new FilterPresenter(tripControlElement, filterModel, tripPointModel);

const handleNewTripPointFormClose = () => {
  newButtonElement.element.disabled = false;
};

const handleNewEventButtonClick = () => {
  contentPresenter.createPoint(handleNewTripPointFormClose);
  newButtonElement.element.disabled = true;
};

newButtonElement.addEventListener('click', handleNewEventButtonClick);

contentPresenter.init();
filterPresenterElement.init();

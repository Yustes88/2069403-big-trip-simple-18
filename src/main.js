import { render } from './framework/render.js';
import FilterModel from './model/filter-model.js';
import TripsModel from './model/trip-point-model.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewTripPointButtonView from './view/new-trip-point-button-view.js';

const tripControlElement = document.querySelector('.trip-main__trip-controls');
const siteContentWrapperElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');


const tripPointModel = new TripsModel();
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(siteContentWrapperElement, tripPointModel, filterModel);
const filterPresenterElement = new FilterPresenter(tripControlElement, filterModel, tripPointModel);
const newTripPointButtonComponent = new NewTripPointButtonView();

const handleNewTripPointFormClose = () => {
  newTripPointButtonComponent.element.disabled = false;
};

const handleNewEventButtonClick = () => {
  contentPresenter.createPoint(handleNewTripPointFormClose);
  newTripPointButtonComponent.element.disabled = true;
};

render(newTripPointButtonComponent, tripMainElement);
newTripPointButtonComponent.setClickHandler(handleNewEventButtonClick);

contentPresenter.init();
filterPresenterElement.init();

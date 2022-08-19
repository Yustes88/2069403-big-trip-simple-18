import TripsModel from './model/trip-point-model.js';
import ContentPresenter from './presenter/content-presenter.js';
import { render } from './render.js';
import FiltersFormView from './view/filters-form-view.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContentWrapperElement = document.querySelector('.trip-events');

const tripPointModel = new TripsModel();
const contentPresenter = new ContentPresenter(siteContentWrapperElement, tripPointModel);


render(new FiltersFormView(), siteFilterElement);
contentPresenter.init();

import { render } from './framework/render.js';
import { generateFilter } from './mock/filters-mock.js';
import TripsModel from './model/trip-point-model.js';
import ContentPresenter from './presenter/content-presenter.js';
import FiltersFormView from './view/filters-form-view.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContentWrapperElement = document.querySelector('.trip-events');

const tripPointModel = new TripsModel();
const contentPresenter = new ContentPresenter(siteContentWrapperElement, tripPointModel);

const filters = generateFilter(tripPointModel.points);


render(new FiltersFormView(filters), siteFilterElement);
contentPresenter.init();

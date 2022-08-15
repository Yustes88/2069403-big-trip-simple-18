import ContentPresenter from './presenter/content-presenter.js';
import { render } from './render.js';
import FiltersFormView from './view/filters-form-view.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContentWrapperElement = document.querySelector('.trip-events');

const contentPresenter = new ContentPresenter();


render(new FiltersFormView(), siteFilterElement);
contentPresenter.init(siteContentWrapperElement);

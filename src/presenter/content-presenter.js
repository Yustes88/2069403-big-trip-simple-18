import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormAddView from '../view/trip-form-edit.js';
import TripList from '../view/trip-list.js';


export default class ContentPresenter {
  #mainContainer = null;
  #tripPoint = null;
  #contentPoint = [];

  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripList();

  init = (mainContainer, tripPointModel) => {
    this.#mainContainer = mainContainer;
    this.#tripPoint = tripPointModel;
    this.#contentPoint = [...this.#tripPoint.points];

    render(this.#sortFormComponent, this.#mainContainer);
    render(this.#tripListComponent, this.#mainContainer);


    for(let i = 0; i < this.#contentPoint.length; i++) {
      this.#renderPoint(this.#contentPoint[i]);
    }
  };

  #renderPoint = (tripPoint) => {
    const tripPointComponent = new TripEventItemView(tripPoint);
    const tripFormEditComponent = new TripFormAddView(tripPoint);

    const replacePointWithForm = () => {
      this.#tripListComponent.element.replaceChild(tripFormEditComponent.element, tripPointComponent.element);
    };

    const replaceFormWithPoint = () => {
      this.#tripListComponent.element.replaceChild(tripPointComponent.element, tripFormEditComponent.element);
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () =>
      replacePointWithForm());

    tripFormEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormWithPoint();
    });


    render(tripPointComponent, this.#tripListComponent.element);
  };

}

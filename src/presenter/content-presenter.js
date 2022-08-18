import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
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
    render(tripPointComponent, this.#tripListComponent.element);
  };

}

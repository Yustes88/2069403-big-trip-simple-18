import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripList from '../view/trip-list.js';
import TripFormAddView from '../view/trip-form-add.js';


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
    render(new TripFormAddView(this.#contentPoint[0]), this.#tripListComponent.element);

    for(let i = 0; i < this.#contentPoint.length; i++) {
      render(new TripEventItemView(this.#contentPoint[i]), this.#tripListComponent.element);
    }
  };

}

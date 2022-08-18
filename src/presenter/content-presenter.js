import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripList from '../view/trip-list.js';
import TripFormAddView from '../view/trip-form-add.js';


export default class ContentPresenter {
  sortFormComponent = new SortFormView();
  tripListComponent = new TripList();

  init = (mainContainer, tripPointModel) => {
    this.pointModel = tripPointModel;
    this.contentPoint = [...this.pointModel.getPoints()];

    render(this.sortFormComponent, mainContainer);
    render(this.tripListComponent, mainContainer);
    render(new TripFormAddView(this.contentPoint[0]), this.tripListComponent.getElement());

    for(let i = 0; i < this.contentPoint.length; i++) {
      render(new TripEventItemView(this.contentPoint[i]), this.tripListComponent.getElement());
    }
  };

}

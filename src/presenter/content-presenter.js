import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripList from '../view/trip-list.js';
import TripFormAddView from '../view/trip-form-add.js';


export default class ContentPresenter {
  sortFormComponent = new SortFormView();
  tripFormAddComponent = new TripFormAddView();
  tripListComponent = new TripList();

  init = (mainContainer) => {
    render(this.sortFormComponent, mainContainer);

    render(this.tripListComponent, mainContainer);
    render(this.tripFormAddComponent, this.tripListComponent.getElement());

    for(let i = 0; i < 3; i++) {
      render(new TripEventItemView(), this.tripListComponent.getElement());
    }
  };

}

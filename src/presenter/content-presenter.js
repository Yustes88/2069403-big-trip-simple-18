import { render } from '../render.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripList from '../view/trip-list.js';
import TripFormAddView from '../view/trip-form-add.js';


export default class ContentPresenter {
  sortFormComponent = new SortFormView();
  tripFormAddComponent = new TripFormAddView();
  tripListComponent = new TripList();

  init = (mainContainer, tripModel) => {
    this.tripModel = tripModel;
    this.trips = [...this.tripModel.getTripPoint()];
    // console.log(this.trips)
    // this.destination = [...this.tripModel.getDestination()];
    // this.tripOffer = [...this.tripModel.getTripOffers()];


    render(this.sortFormComponent, mainContainer);
    render(this.tripListComponent, mainContainer);
    render(this.tripFormAddComponent, this.tripListComponent.getElement());

    for(let i = 0; i < this.trips.length; i++) {
      render(new TripEventItemView(this.trips[i]), this.tripListComponent.getElement());
    }
  };

}

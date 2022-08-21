import { render, replace } from '../framework/render.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormEditView from '../view/trip-form-edit-view.js';
import TripList from '../view/trip-list.js';


export default class ContentPresenter {
  #mainContainer = null;
  #tripPoint = null;
  #contentPoint = [];

  #sortFormComponent = new SortFormView();
  #tripListComponent = new TripList();

  constructor(mainContainer, tripPointModel){
    this.#mainContainer = mainContainer;
    this.#tripPoint = tripPointModel;

  }

  init = () => {
    this.#contentPoint = [...this.#tripPoint.points];
    this.#renderContent();
  };


  #renderPoint = (tripPoint) => {
    const tripPointComponent = new TripEventItemView(tripPoint);
    const tripFormEditComponent = new TripFormEditView(tripPoint);

    const replacePointWithForm = () => {
      replace(tripFormEditComponent, tripPointComponent);
    };

    const replaceFormWithPoint = () => {
      replace(tripPointComponent, tripFormEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormWithPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripPointComponent.setRollUpClickHandler(() => {
      replacePointWithForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripFormEditComponent.setFormSubmitHandler(() => {
      replaceFormWithPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    tripFormEditComponent.setRollUpClickHandler(() => {
      replaceFormWithPoint();
    });


    render(tripPointComponent, this.#tripListComponent.element);
  };

  #renderContent = () => {
    if(this.#contentPoint.length === 0) {
      render(new PointsListEmptyView(), this.#mainContainer);
      return;
    }

    render(this.#sortFormComponent, this.#mainContainer);
    render(this.#tripListComponent, this.#mainContainer);


    for(let i = 0; i < this.#contentPoint.length; i++) {
      this.#renderPoint(this.#contentPoint[i]);
    }
  };

}

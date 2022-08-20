import { render } from '../framework/render.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import SortFormView from '../view/sort-form-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormAddView from '../view/trip-form-add-view.js';
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
    const tripFormEditComponent = new TripFormAddView(tripPoint);

    const replacePointWithForm = () => {
      this.#tripListComponent.element.replaceChild(tripFormEditComponent.element, tripPointComponent.element);
    };

    const replaceFormWithPoint = () => {
      this.#tripListComponent.element.replaceChild(tripPointComponent.element, tripFormEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormWithPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointWithForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripFormEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormWithPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    tripFormEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
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

import { render, RenderPosition, replace } from '../framework/render.js';
import PointsListEmptyView from '../view/points-list-empty-view.js';
import TripEventItemView from '../view/trip-event-item-view.js';
import TripFormEditView from '../view/trip-form-edit-view.js';
import TripList from '../view/trip-list.js';


export default class ContentPresenter {
  #mainContainer = null;
  #tripPoint = null;
  #contentPoint = [];

  #tripListComponent = new TripList();
  #pointsListEmptyComponent = new PointsListEmptyView();

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

  #renderPoints = () => {
    for(let i = 0; i < this.#contentPoint.length; i++) {
      this.#renderPoint(this.#contentPoint[i]);
    }
  };

  #renderPointsList = () => {
    render(this.#tripListComponent, this.#mainContainer);
    this.#renderPoints();
  };

  #renderPointsListEmpty = () => {
    render(this.#pointsListEmptyComponent, this.#mainContainer, RenderPosition.BEFOREEND);
  };

  #renderContent = () => {
    if(this.#contentPoint.length === 0) {
      this.#renderPointsListEmpty();
      return;
    }

    this.#renderPointsList();

  };

}

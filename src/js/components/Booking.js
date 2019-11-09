import { templates, select } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(bookingWraper) {
    const thisBooking = this;
    thisBooking.render(bookingWraper);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.element = utils.createDOMFromHTML(generatedHTML);
    thisBooking.dom.wrapper.appendChild(thisBooking.element);

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      '.people-amount'
    );
    console.log(thisBooking.dom.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    console.log(thisBooking.dom.hoursAmount);
  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;

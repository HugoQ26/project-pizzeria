import { templates, select } from '../settings.js';
import utils from '../utils.js';

class LandingPage {
  constructor(landingPageWraper) {
    const thisLandingPage = this;
    thisLandingPage.render(landingPageWraper);
    thisLandingPage.initActions();
  }

  initActions() {
    const thisLandingPage = this;
    thisLandingPage.dom.headerCart.classList.add('none');
    thisLandingPage.dom.Cart.classList.add('none');
    thisLandingPage.dom.header.classList.add('mb-60');
  }

  render(element) {
    const thisLandingPage = this;
    const generatedHTML = templates.landingPage();

    thisLandingPage.dom = {};

    thisLandingPage.dom.wrapper = element;

    thisLandingPage.element = utils.createDOMFromHTML(generatedHTML);
    thisLandingPage.dom.wrapper.appendChild(thisLandingPage.element);

    thisLandingPage.dom.header = document.querySelector(
      select.containerOf.header
    );

    thisLandingPage.dom.headerCart = thisLandingPage.dom.header.querySelector(
      select.containerOf.cart
    );

    thisLandingPage.dom.Cart = thisLandingPage.dom.header.querySelector(
      select.containerOf.navTabs
    );
  }
}

export default LandingPage;

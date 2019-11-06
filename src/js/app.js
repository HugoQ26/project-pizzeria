console.log('welcome app');
import { settings, select } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initMenu: function() {
    const thisApp = this;

    for (const productData in thisApp.data.products) {
      //new Product(productData, thisApp.data.products[productData]);
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },
  initData: function() {
    const thisApp = this;
    const url = settings.db.url + '/' + settings.db.product;
    thisApp.data = {};
    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
  },
  init: function() {
    const thisApp = this;

    thisApp.initData();
    thisApp.initCart();
  },
  initCart: function() {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(e) {
      app.cart.add(e.detail.product);
    });
  }
};

app.init();

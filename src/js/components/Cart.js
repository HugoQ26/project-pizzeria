import { settings, select, templates, classNames } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    thisCart.renderTotalsKeys = [
      'totalNumber',
      'totalPrice',
      'subtotalPrice',
      'deliveryFee'
    ];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(
        select.cart[key]
      );
    }
  }

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function() {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(e) {
      thisCart.remove(e.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(e) {
      e.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;

    /* [DONE] generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* [DONE] create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* [DONE] find products list container */
    const productListContainer = thisCart.dom.productList;

    /* [DONE] add element to products list */
    productListContainer.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }

  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (const product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log(
      'total number: ',
      thisCart.totalNumber,
      'subtotal Price: ',
      thisCart.subtotalPrice,
      'totalPrice: ',
      thisCart.totalPrice
    );
    for (const key of thisCart.renderTotalsKeys) {
      for (const elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    thisCart.phone = thisCart.phone.value;
    thisCart.address = thisCart.address.value;

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      phone: thisCart.phone,
      address: thisCart.address,
      totalPrice: thisCart.totalPrice,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.defaultDeliveryFee,
      products: []
    };

    for (const product of thisCart.products) {
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        console.log('parsed response post', parsedResponse);
      });
  }
}

export default Cart;

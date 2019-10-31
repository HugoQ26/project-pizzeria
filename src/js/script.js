/* eslint-disable no-unused-vars */
/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  ('use strict');

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product'
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart'
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select'
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]'
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]'
      }
    }
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active'
    }
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    )
  };

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element); /* 5 */
      thisWidget.setValue(thisWidget.input.value); /* 7 */
      thisWidget.initActions(); /* 9 */

      console.log('AmountWidget', thisWidget);
      console.log('AmountWidget constructor arguments', element);
    }

    /* 4 */
    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;

      thisWidget.input = thisWidget.element.querySelector(
        select.widgets.amount.input
      );
      thisWidget.linkDecrease = thisWidget.element.querySelector(
        select.widgets.amount.linkDecrease
      );
      thisWidget.linkIncrease = thisWidget.element.querySelector(
        select.widgets.amount.linkIncrease
      );
    }

    /* 6 */
    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);

      /* TODO: Add validation */
      //const condition = newValue != thisWidget.input.value;

      thisWidget.value = newValue;
      this.announce();
      thisWidget.input.value = thisWidget.value;
    }

    /* 8 */
    initActions() {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function() {
        console.log('change', thisWidget.input.value);
        thisWidget.setValue(thisWidget.input.value);
        console.log('change', thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', function(e) {
        e.preventDefault();
        thisWidget.setValue((thisWidget.value -= 1));
        console.log('linkDecrease', thisWidget.value);
      });

      thisWidget.linkIncrease.addEventListener('click', function(e) {
        e.preventDefault();
        thisWidget.setValue((thisWidget.value += 1));

        console.log('linkIncrease', thisWidget.value);
      });
    }

    /* 9 */
    announce() {
      const thisWidget = this;
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget(); /* 3 */
      thisProduct.processOrder();
    }
    renderInMenu() {
      const thisProduct = this;
      /* [DONE] generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /* [DONE] create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* [DONE] find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* [DONE] add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(
        select.menuProduct.clickable
      );
      thisProduct.form = thisProduct.element.querySelector(
        select.menuProduct.form
      );
      thisProduct.formInputs = thisProduct.form.querySelectorAll(
        select.all.formInputs
      );
      thisProduct.cartButton = thisProduct.element.querySelector(
        select.menuProduct.cartButton
      );
      thisProduct.priceElem = thisProduct.element.querySelector(
        select.menuProduct.priceElem
      );
      thisProduct.imageWrapper = thisProduct.element.querySelector(
        select.menuProduct.imageWrapper
      );
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(
        select.menuProduct.amountWidget /*  1 */
      );
    }
    initAmountWidget() {
      /* 2 */
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      /* 9 */
      thisProduct.amountWidgetElem.addEventListener('updated', function() {
        thisProduct.processOrder();
      });
    }

    initAccordion() {
      const thisProduct = this;

      /* [DONE] find the clickable trigger (the element that should react to clicking) */
      const productHeader = thisProduct.accordionTrigger;

      /* [DONE] START: click event listener to trigger */
      productHeader.addEventListener('click', function(event) {
        /* [DONE] prevent default action for event */
        event.preventDefault();
        /* [DONE] toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');
        /* [DONE] find all active products */
        const allActiveProducts = document.querySelectorAll(
          select.all.menuProductsActive
        );
        /* [DONE] START LOOP: for each active product */
        for (const activeProduct of allActiveProducts) {
          /* [DONE] START: if the active product isn't the element of thisProduct */
          if (activeProduct != thisProduct.element) {
            /* [DONE] remove class active for the active product */
            activeProduct.classList.remove('active');
          }
          /* [DONE] END: if the active product isn't the element of thisProduct */
        }
        /* [DONE] END LOOP: for each active product */
      });
      /* [DONE] END: click event listener to trigger */
    }

    initOrderForm() {
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
    processOrder() {
      const thisProduct = this;

      /* [DONE] read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);

      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;
      const productParams = thisProduct.data.params;

      /* START LOOP: for each paramId in thisProduct.data.params */
      for (const paramId in productParams) {
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = productParams[paramId];

        /* START LOOP: for each optionId in param.options */
        for (const optionId in param.options) {
          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];
          //console.log('option', option);

          /* START IF: if option is selected and option is not default */
          const optionSelected =
            formData.hasOwnProperty(paramId) &&
            formData[paramId].indexOf(optionId) > -1;
          if (optionSelected && !option.default) {
            /* add price of option to variable price */
            price += option.price;
            //console.log('price', price);
            /* START ELSE IF: if option is not selected and option is default */
          } else if (!optionSelected && option.default) {
            /* deduct price of option from price */
            price -= option.price;
          }

          const images = thisProduct.imageWrapper.querySelectorAll(
            'img.' + paramId + '-' + optionId
          );
          if (optionSelected) {
            for (const image of images) {
              image.classList.add(classNames.menuProduct.imageVisible);
            }
          } else {
            for (const image of images) {
              image.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      price *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;

      // console.log('thisApp.data', thisApp.data);
      for (const productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function() {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    init: function() {
      const thisApp = this;

      thisApp.initData();
      thisApp.initMenu();
    }
  };

  app.init();
}

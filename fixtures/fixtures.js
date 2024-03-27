const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { Product } = require('../pages/productPage');
const { Cart } = require('../pages/cartPage');
const { UserInformation } = require('../pages/userInformationPage');
const { Checkout } = require('../pages/checkoutPage');
const { CheckoutComplete } = require('../pages/checkoutCompletePage');

exports.test = test.extend({
  loginpage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  product: async ({ page }, use) => {
    await use(new Product(page));
  },
  cart: async ({ page }, use) => {
    await use(new Cart(page));
  },
  userInformation: async ({ page }, use) => {
    await use(new UserInformation(page));
  },
  checkout: async ({ page }, use) => {
    await use(new Checkout(page));
  },
  checkoutComplete: async ({ page }, use) => {
    await use(new CheckoutComplete(page));
  },
});
exports.expect = test.expect;
exports.testData = require('../testData/user.json');

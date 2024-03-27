const { BasePage } = require('./basePage');
const { expect } = require('@playwright/test');

exports.CheckoutComplete = class CheckoutComplete extends BasePage {
  orderHeader = this.page.locator('h2.complete-header');
  constructor(page) {
    super(page);
  }

  async verifyOrderCompletion() {
    await expect(this.orderHeader).toHaveText('Thank you for your order!');
  }

  async backToHome() {
    await this.getLocator('back-to-products').click();
  }
};

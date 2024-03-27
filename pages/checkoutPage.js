const { BasePage } = require('./basePage');

exports.Checkout = class Checkout extends BasePage {
  constructor(page) {
    super(page);
  }

  async clickOnFinish() {
    await this.getLocator('finish').click();
  }
};

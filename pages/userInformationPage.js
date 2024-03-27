const { expect } = require('@playwright/test');
const { BasePage } = require('./basePage');
const { faker } = require('@faker-js/faker');

exports.UserInformation = class UserInformation extends BasePage {
  /**
   * @param {import("playwright-core").Page} page
   */
  constructor(page) {
    super(page);
  }

  async checkUrl() {
    await expect(this.page).toHaveURL(
      'https://www.saucedemo.com/checkout-step-one.html',
    );
  }

  async enterInformationAndClickOnContinue() {
    await this.getLocator('firstName').fill(faker.person.firstName.name);
    await this.getLocator('lastName').fill(faker.person.lastName.name);
    await this.getLocator('postalCode').fill(faker.location.zipCode.name);
    await this.getLocator('continue').click();
  }
};

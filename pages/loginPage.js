//@ts-check
const { expect } = require('@playwright/test');
const { BasePage } = require('./basePage');

exports.LoginPage = class LoginPage extends BasePage {
  loginPageLogo = this.page.locator('div.login_logo');
  getTextField = (/** @type {string} */ field) =>
    this.page.getByPlaceholder(field);
  userName = this.page.getByPlaceholder('Username');
  //password = this.page.getByPlaceholder("Password");
  loginButton = this.page.locator('[data-test="login-button"]');
  /**
   * @param {import("playwright-core").Page} page
   */
  constructor(page) {
    super(page);
  }

  async openApp() {
    await this.page.goto('');
  }

  async loginToApp({ username, password }) {
    await this.getTextField('Username').fill(username);
    await this.getTextField('Password').fill(password);
    await this.loginButton.click();
  }

  async isLogoVisible() {
    await expect.soft(this.loginPageLogo).toBeVisible();
  }

  async isUserNameFieldVisible() {
    expect
      .soft(this.isElementVisible(this.getTextField('Username')))
      .toBeTruthy();
  }

  async isPasswordFieldVisible() {
    await expect.soft(this.getTextField('Password')).toBeVisible();
  }

  async isLoginButtonVisible() {
    await expect.soft(this.loginButton).toBeVisible();
  }

  /**
   * @param {string} text
   */
  async verifyLoginPageHeaderText(text) {
    return this.verifyText(this.loginPageLogo, text);
  }
};

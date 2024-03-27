import exp from "constants";

//@ts-check
const { expect } = require("@playwright/test");
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }
  getLocator = (/** @type {any} */ field) =>
    this.page.locator(`[data-test="${field}"]`);
  async getTitle() {
    return await this.page.title();
  }
  /**
   * @param {string | RegExp} selector
   */
  async getByPlaceholder(selector) {
    return this.page.getByPlaceholder(selector);
  }
  /**
   * @param {string} selector
   */
  async getByText(selector) {
    return this.page.getByText(selector);
  }

  /**
   * @param {string} selector
   */
  async getByLocator(selector) {
    return this.page.locator(selector);
  }

  /**
   * @param {Promise<import("playwright-core").Locator>} locator
   * @param {string} text
   */
  async fill(locator, text) {
    (await locator).fill(text);
  }

  /**
   * @param {Promise<import("playwright-core").Locator>} locator
   */
  async click(locator) {
    (await locator).click();
  }

  /**
   * @param {any} locator
   */
  async isElementVisible(locator) {
    return (await locator).isVisible();
  }

  /**
   * @param {RegExp | string} title
   */
  async verifyTitle(title) {
    expect.soft(await this.getTitle()).toBe(title);
  }

  /**
   * @param {any} selector
   * @param {string} text
   */
  async verifyText(selector, text) {
    expect.soft(await selector).toHaveText(text);
  }
}

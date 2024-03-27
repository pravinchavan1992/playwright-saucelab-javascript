//@ts-check
const { BasePage } = require('./basePage');
const { expect } = require('@playwright/test');

exports.Product = class Product extends BasePage {
  shoppingCart = this.page.locator('#shopping_cart_container a');
  productSort = this.page.locator('[data-test="product_sort_container"]');
  products = this.page.getByText('Products');
  menuLinks = this.page.locator('.bm-menu-wrap a');
  inventory = this.page.locator('div.inventory_container .inventory_item');
  productsort = this.page.locator('[data-test=\'product_sort_container\']');
  activeContainer = this.page.locator('span.active_option');

  menu = (/** @type {string} */ link) =>
    this.page.getByRole('link', { name: link });
  populatemenu = (/** @type {string} */ state) =>
    this.page.getByRole('button', { name: `${state} Menu` });
  getInventory = (/** @type {any} */ inventoryName) =>
    this.inventory.filter({ hasText: inventoryName });
  socialLinks = (/** @type {any} */ linkName) =>
    this.page.getByRole('link', { name: linkName });

  /**
   * @param {import("playwright-core").Page} page
   */
  constructor(page) {
    super(page);
  }

  async isShoppingCartVisible() {
    await expect.soft(this.shoppingCart).toBeVisible();
  }

  async isProductSortVisible() {
    await expect.soft(this.productSort).toBeVisible();
  }

  async isProductLabelVisible() {
    await expect.soft(this.products).toBeVisible();
  }

  async pupulateMenu() {
    await this.populatemenu('Open').click();
  }

  async closeMenu() {
    await this.populatemenu('Close').click();
  }

  async verifyMenuItems() {
    await expect.soft(this.menuLinks).toHaveCount(4);
  }

  /**
   * @param {any} menuItem
   */
  async checkMenu(menuItem) {
    await expect
      .soft(this.menuLinks.filter({ hasText: menuItem }))
      .toBeVisible();
  }

  /**
   * @param {string} link
   */
  async isMenuPresent(link) {
    await expect.soft(this.menu(link)).toBeVisible();
  }

  /**
   * @param {string} product
   */
  async isProductAvailable(product) {
    await expect.soft(this.inventory).toHaveCount(6);
    await this.getInventory(product).isVisible();

    const productDescription = await this.getInventory(product)
      .locator('.inventory_item_desc')
      .allTextContents();

    const productPrice = await this.getInventory(product)
      .locator('.inventory_item_price')
      .allInnerTexts();

    return {
      product,
      productDescription,
      productPrice,
    };
  }

  /**
   * @param {string} product
   */
  async addProductToCart(product) {
    const cartValue = await this.getShoppingCartValue();
    await this.getInventory(product)
      .getByRole('button', { name: 'Add to cart' })
      .click();
    await expect
      .soft(this.getInventory(product).getByRole('button'))
      .toHaveText('Remove');
    const newCartValue = await this.getShoppingCartValue();
    expect.soft(newCartValue).toBe(cartValue + 1);
  }

  async navigateToCart() {
    await this.shoppingCart.click();
  }

  async sortProducts(text) {
    await this.productsort.selectOption({ label: text });
    await expect.soft(this.activeContainer).toHaveText(text);
  }

  async getFirstItem() {
    return await this.inventory
      .locator('div.inventory_item_price')
      .first()
      .allInnerTexts();
  }

  async logout() {
    await this.pupulateMenu();
    await this.menu('Logout').click();
  }

  async verifySocialLinks(link) {
    const links = this.socialLinks(link);
    const pagePromise = this.page.context().waitForEvent('page');
    await links.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState('networkidle');
    expect(await newPage.title()).toContain(link);
  }

  async getShoppingCartValue() {
    const cart = this.shoppingCart.locator('>span');
    if (await cart.isVisible()) {
      return Number.parseInt((await cart.allInnerTexts())[0]);
    }
    return 0;

  }
};

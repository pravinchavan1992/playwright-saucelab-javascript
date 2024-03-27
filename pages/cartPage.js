const { expect } = require('@playwright/test');
const { BasePage } = require('./basePage');

exports.Cart = class Cart extends BasePage {
  cartContainer = this.page.locator('div#cart_contents_container');
  cartDetails = this.page.locator('div.cart_list>div.cart_item');
  checkoutButton = this.page.locator('[data-test="checkout"]');

  cartList = this.cartContainer.locator(this.cartDetails);

  cart = this.page.locator('div#cart_contents_container div.cart_item');

  constructor(page) {
    super(page);
  }

  async isCartLoaded() {
    await expect(this.cartList).toBeVisible();
  }

  async verifyCartDetails({ product, productDescription, productPrice }) {
    const ele = this.cart
      .filter({ has: this.page.locator('.inventory_item_name') })
      .filter({ hasText: product });
    await ele.isVisible();

    await ele
      .filter({ has: this.page.locator('.inventory_item_desc') })
      .filter({ hasText: productDescription })
      .isVisible();

    await ele
      .filter({ has: this.page.locator('.inventory_item_price') })
      .filter({ hasText: productPrice })
      .isVisible();
  }

  async clickOnCheckOut() {
    await this.checkoutButton.click();
  }
};

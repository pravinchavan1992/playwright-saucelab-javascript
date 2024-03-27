// @ts-check
const { test, expect, testData } = require('../fixtures/fixtures');
test.describe
  .parallel('@Smoke: Login as a standard user to verify the products page and logout from the application', async () => {
    test('@Smoke: Login to Application', async ({ loginpage, product }) => {
      await test.step('Open the APP and check logo', async () => {
        await loginpage.openApp();
        await loginpage.verifyTitle('Swag Labs');
        await loginpage.isLogoVisible();
        await loginpage.verifyLoginPageHeaderText('Swag Labs');
      });

      await test.step('Check UserName Password field on login page', async () => {
        await loginpage.isUserNameFieldVisible();
        await loginpage.isPasswordFieldVisible();
        await loginpage.isLoginButtonVisible();
        await loginpage.verifyLoginPageHeaderText('Swag Labs');
      });

      await test.step('Log into Application', async () => {
        await loginpage.loginToApp(testData);
      });

      await test.step('Verify the products page shopping cart icon and product sort container visible', async () => {
        await product.isShoppingCartVisible();
        await product.isProductSortVisible();
      });

      await test.step('Verify productmenu', async () => {
        await product.isProductLabelVisible();
        await product.pupulateMenu();
        await product.verifyMenuItems();

        await product.checkMenu('About');
        await product.isMenuPresent('Reset App State');

        await product.closeMenu();
      });

      await test.step('Verify product', async () => {
        const prodDetails = await product.isProductAvailable('Sauce Labs Onesie');
        console.log(prodDetails[0], prodDetails[1]);
        const prodDetails1 = await product.isProductAvailable(
          'Sauce Labs Backpack',
        );
        console.log(prodDetails1[0], prodDetails[1]);
      });

      await test.step('Verify sorting of product', async () => {
        await product.sortProducts('Price (low to high)');
        expect.soft(await product.getFirstItem()).toContain('$7.99');
        await product.sortProducts('Price (high to low)');
        expect.soft(await product.getFirstItem()).toContain('$49.99');
      });

      await test.step('Log out of application', async () => {
        await product.logout();
        await loginpage.isUserNameFieldVisible();
        await loginpage.isPasswordFieldVisible();
        await loginpage.isLoginButtonVisible();
      });
    });

    test('@Sanity: Login to Application - Re-Login', async ({
      loginpage,
      product,
    }) => {
      await test.step('Log into Application', async () => {
        await loginpage.openApp();
        await loginpage.loginToApp(testData);
      });
      await test.step('Log out of application', async () => {
        await product.logout();
        await loginpage.isUserNameFieldVisible();
        await loginpage.isPasswordFieldVisible();
        await loginpage.isLoginButtonVisible();
      });
    });
  });

test.describe
  .serial('@Smoke: Click on LinkedIn link and check whether user is navigated to LinkedIn page', async () => {
    test('@Smoke: login to app and navigate to linkedin', async ({
      loginpage,
      product,
    }) => {
      await test.step('Login to App', async () => {
        await loginpage.openApp();
        await loginpage.loginToApp(testData);
      });

      await test.step('Navigate to linkedin', async () => {
        await product.verifySocialLinks('LinkedIn');
      });
    });
  });

test.describe
  .serial('@Sanity: Click on Facebook link and check whether user is navigated to Facebook page', async () => {
    test('@Sanity: login to app and navigate to facebook', async ({
      loginpage,
      product,
    }) => {
      await test.step('Login to App', async () => {
        await loginpage.openApp();
        await loginpage.loginToApp(testData);
      });

      await test.step('Navigate to facebook', async () => {
        await product.verifySocialLinks('Facebook');
      });
    });
  });

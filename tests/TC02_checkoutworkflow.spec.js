//@ts-check
const { test, testData } = require('../fixtures/fixtures');
test.describe
  .serial('@Sanity Login as a standard user to complete the checkout workflow', async () => {
    test('Login as a standard user to complete the checkout workflow', async ({
      loginpage,
      product,
      cart,
      userInformation,
      checkout,
      checkoutComplete,
    }) => {
      const productName = 'Sauce Labs Backpack';
      let productDetails;
      await test.step('Log in to Application', async () => {
        await loginpage.openApp();
        await loginpage.loginToApp(testData);
      });

      await test.step('Check is product available', async () => {
        productDetails = await product.isProductAvailable(productName);
      });
      await test.step('Add product (Sauce Labs Bolt T-Shirt) to cart Navigate to shopping cart and verify details', async () => {
        await product.addProductToCart(productName);
        await product.navigateToCart();
        await cart.verifyCartDetails(productDetails);
        await cart.clickOnCheckOut();
      });

      await test.step('Add you information for product checkout', async () => {
        await userInformation.checkUrl();
        await userInformation.enterInformationAndClickOnContinue();
      });

      await test.step('Verify Checkout', async () => {
        await checkout.clickOnFinish();
        await checkoutComplete.verifyOrderCompletion();
        await checkoutComplete.backToHome();
        await product.logout();
      });
    });
  });

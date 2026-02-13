import { test, expect } from '../base.ts';
import { searchData } from '../../testData/searchData.data.ts';
import { ProductPage } from '../../pages/productPage.page.ts';
import { PaymentPage } from '../../pages/paymentPage.page.ts';
import { CartPage } from '../../pages/cartPage.page.ts';


test.describe('Search and filter functionality Test Suite', () => {

    test.beforeEach(async ({homePage}) => {
        await homePage.goto() //Step 1: Navigate to home page
        await expect(homePage.searchBox).toBeVisible()  //Step 2: Validate that seach box is loaded and visible
    })

    searchData.forEach(product => {

        test(`Pick ${product.ITEM_CATEGORY} and add it to the cart`, 
            async ({
                homePage,
                searchPage
                }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY);
                await searchPage.filterForBrand(product.ITEM_BRAND);
                await expect(searchPage.searchResults).toBeVisible(); //Step 6: Validate that search results are loaded
                const targetProduct = await searchPage.selectSearchResultByNumber(0);
                const [newTab] = await Promise.all([
                    searchPage.page.waitForEvent('popup'),
                    searchPage.clickOnTargetProduct(targetProduct)
                ]);
                const productPage = new ProductPage(newTab);
                await productPage.validateProductsActionButtonsVisible();
                await productPage.checkForColorField();
                await productPage.buyProductAsGuest();

                if(await productPage.checkCAPTCHA()){
                    productPage.page.close()
                    }
                    else
                    {
                        const paymentPage = new PaymentPage(productPage.page);
                        expect(paymentPage.shippingForm).toBeVisible();
                    };

                });

        test(`Pick ${product.ITEM_CATEGORY} and add it to cart and remove`, 
            async ({
                homePage,
                searchPage
                }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY);
                await searchPage.filterForBrand(product.ITEM_BRAND);
                await expect(searchPage.searchResults).toBeVisible(); //Step 6: Validate that search results are loaded
                const targetProduct = await searchPage.selectSearchResultByNumber(1);
                const [newTab] = await Promise.all([
                    searchPage.page.waitForEvent('popup'),
                    searchPage.clickOnTargetProduct(targetProduct)
                ]);
                const productPage = new ProductPage(newTab);
                await productPage.validateProductsActionButtonsVisible();
                await productPage.checkForColorField();
                await productPage.clickAddToCart();
                await expect(productPage.seeInCartButton).toBeVisible();
                await productPage.clickSeeInCart();
                if(await productPage.checkCAPTCHA()){
                    productPage.page.close()
                    }
                    else
                    {
                    const cartPage = new CartPage(productPage.page);
                    await cartPage.awaitForCartPage();
                    };
            });
        });
});
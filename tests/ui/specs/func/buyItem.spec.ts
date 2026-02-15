import { test, expect } from '../base.ts';
import { searchData } from '../../testData/searchData.data.ts';
import { ProductPage } from '../../pages/productPage.page.ts';
import { PaymentPage } from '../../pages/paymentPage.page.ts';
import { CartPage } from '../../pages/cartPage.page.ts';


test.describe('Search and filter functionality Test Suite', () => {

    test.beforeEach(async ({homePage}) => {
        await homePage.goto(); //Step 1: Navigate to home page
        await expect(homePage.searchBox).toBeVisible();  //Step 2: Validate that seach box is loaded and visible
    })

    searchData.forEach(product => {

        test(`Pick ${product.ITEM_CATEGORY} and add it to the cart`, 
            async ({
                homePage,
                searchPage
                }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await searchPage.filterForBrand(product.ITEM_BRAND); //Step 4: Filter by Brand
                await expect(searchPage.searchResults).toBeVisible(); //Step 5: Validate that search results are loaded
                const targetProduct = await searchPage.selectSearchResultByNumber(0); //Step 7: Select item by index
                const newTab = await searchPage.openNewProductTab(targetProduct);
                const productPage = new ProductPage(newTab); //Step 8: Wait for new product tab to load
                await productPage.checkForColorField(); //Step 9: Check for color options
                await productPage.validateProductsActionButtonsVisible(); //Step 10: Validate action buttons are present
                await productPage.buyProductAsGuest(); //Step 11: Buy item as guest

                if(await productPage.checkCAPTCHA()){ // Check for CAPTCHA
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
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await searchPage.filterForBrand(product.ITEM_BRAND); //Step 4: Filter by Brand
                await expect(searchPage.searchResults).toBeVisible(); //Step 5: Validate that search results are loaded
                const targetProduct = await searchPage.selectSearchResultByNumber(1); //Step 7: Select item by index
                const newTab = await searchPage.openNewProductTab(targetProduct)
                const productPage = new ProductPage(newTab); //Step 8: Wait for new product tab to load
                await productPage.checkForColorField(); //Step 9: Check for color options
                await productPage.validateProductsActionButtonsVisible(); //Step 10: Validate action buttons are present
                await productPage.clickAddToCart(); //Step 11: Add item to cart
                await expect(productPage.seeInCartButton).toBeVisible(); //Step 12: Validate added to cart dialog
                await productPage.clickSeeInCart(); //Step 13: Close the added to cart dialog
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
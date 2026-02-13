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

        test(`Pick ${product.ITEM_BRAND} ${product.ITEM_CATEGORY} in price range: ${product.MIN_PRICE}-${product.MAX_PRICE}, add it to the cart and remove`, 
            async ({
                homePage,
                searchPage
                }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await searchPage.filterForBrand(product.ITEM_BRAND); //Step 4: Filter by Brand
                await searchPage.submitMinMaxPrice({minPrice: product.MIN_PRICE, 
                                                    maxPrice: product.MAX_PRICE
                                                }); //Step 5: Fill in price range and submit
                await expect(searchPage.searchResults).toBeVisible(); //Step 6: Validate that search results are loaded
                const targetProduct = await searchPage.selectSearchResultByNumber(Number(product.PRODUCT_NUMBER)-1); //Step 7: Select item by index
                const [newTab] = await Promise.all([
                    searchPage.page.waitForEvent('popup'),
                    searchPage.clickOnTargetProduct(targetProduct)
                ]);
                const productPage = new ProductPage(newTab); //Step 7: Wait for new product tab to load
                await productPage.validateProductsActionButtonsVisible(); //Step 8: Validate action buttons are present
                await productPage.checkForColorField(); //Step 9: Check for color options
                await productPage.clickAddToCart(); //Step 10: Add item to cart
                await expect(productPage.seeInCartButton).toBeVisible(); //Step 11: Validate added to cart dialog
                await productPage.clickCloseAddToCartDialog(); //Step 12: Close the added to cart dialog
                await productPage.removeItemFromCart() //Step 13: Remove from cart, in page header cart module
                });

        });
});
import { test, expect } from '../base.ts';
import { searchData } from '../../testData/searchData.data.ts';


test.describe('Search and filter functionality Test Suite', () => {

    test.beforeEach(async ({homePage}) => {
        await homePage.goto() //Step 1: Navigate to home page
        await expect(homePage.searchBox).toBeVisible()  //Step 2: Validate that seach box is loaded and visible
    })

    searchData.forEach(product => {

        test(`Validating search results from homePage, product ${product.ITEM_CATEGORY}`, 
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY);
                await expect(searchPage.searchResults).toBeVisible() //Step 6: Validate that search results are loaded
                const searchResults = await searchPage.collectSearchResults(5, product.ITEM_CATEGORY); //Step 7: Validate that search returned correct category
                searchResults.forEach(result => {
                    expect(result?.toUpperCase()).toContain(product.ITEM_CATEGORY.toUpperCase());
                    });
                }
        );

        test(`Validate search results, using brand filter: ${product.ITEM_BRAND}`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY);
                await searchPage.filterForBrand(product.ITEM_BRAND);
                await expect(searchPage.searchResults).toBeVisible() //Step 8: Validate that search results are loaded
                const searchResults = await searchPage.collectSearchResults(10, product.ITEM_BRAND); //Step 9: Validate that search returned correct category
                searchResults.forEach(result => {
                    expect(result?.toUpperCase()).toContain(product.ITEM_BRAND.toUpperCase());
                    });
                }
        );

        test(`Validate search results, using price range filter min: ${product.MIN_PRICE} price`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY);
                await searchPage.submitMinPrice(product.MIN_PRICE)
                await expect(searchPage.searchResults).toBeVisible() //Step 12: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(10) //Step 13: Validate price values
                searchResultPrices.forEach(price => {
                    expect(price).toBeGreaterThan(Number(product.MIN_PRICE))
                });
            }
        );

        test(`Validate search results, using price range filter max: ${product.MAX_PRICE} price`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY);
                await searchPage.submitMaxPrice(product.MAX_PRICE)
                await expect(searchPage.searchResults).toBeVisible() //Step 12: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(10) //Step 13: Validate price values
                searchResultPrices.forEach(price => {
                    expect(price).toBeLessThan(Number(product.MAX_PRICE))
                });
            }
        );

        test(`Validate search results, using price range filter min: ${product.MIN_PRICE} and max: ${product.MAX_PRICE} price`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY);
                await searchPage.submitMinMaxPrice({minPrice: product.MIN_PRICE, 
                                                    maxPrice: product.MAX_PRICE
                                                });
                await expect(searchPage.searchResults).toBeVisible(); //Step 12: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(10); //Step 13: Validate price values
                searchResultPrices.forEach(price => {
                    expect(price).toBeGreaterThan(Number(product.MIN_PRICE));
                    expect(price).toBeLessThan(Number(product.MAX_PRICE));
                });
            }
        );



    });


})
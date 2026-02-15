import { test, expect } from '../base.ts';
import { searchData } from '../../testData/searchData.data.ts';


test.describe('Search and filter functionality Test Suite', () => {

    test.beforeEach(async ({homePage}) => {
        await homePage.goto(); //Step 1: Navigate to home page
        await expect(homePage.searchBox).toBeVisible();  //Step 2: Validate that seach box is loaded and visible
    })

    searchData.forEach(product => {

        test(`Validating search results from homePage, product ${product.ITEM_CATEGORY}`, 
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await expect(searchPage.searchResults).toBeVisible(); //Step 4: Validate that search results are loaded
                const searchResults = await searchPage.collectSearchResults(5, product.ITEM_CATEGORY); //Step 5: Validate that search returned correct category
                searchResults.forEach(result => {
                    expect(result?.toUpperCase()).toContain(product.ITEM_CATEGORY.toUpperCase()); //Step 6: Validate a set of search results
                    });
                }
        );

        test(`Validate search results, using brand filter: ${product.ITEM_BRAND}`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await searchPage.filterForBrand(product.ITEM_BRAND); //Step 4: Filter by Brand
                await expect(searchPage.searchResults).toBeVisible(); //Step 5: Validate that search results are loaded
                const searchResults = await searchPage.collectSearchResults(10, product.ITEM_BRAND); //Step 6: Validate that search returned correct category
                searchResults.forEach(result => {
                    expect(result?.toUpperCase()).toContain(product.ITEM_BRAND.toUpperCase()); //Step 7: Validate a set of search results
                    });
                }
        );

        test(`Validate search results, using price range filter min: ${product.MIN_PRICE} price`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await searchPage.submitMinPrice(product.MIN_PRICE); //Step 4: Filter by Minimum price
                await expect(searchPage.searchResults).toBeVisible(); //Step 5: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(10); //Step 6: Validate price values
                searchResultPrices.forEach(price => {
                    expect(price).toBeGreaterThanOrEqual(Number(product.MIN_PRICE)); //Step 7: Validate a set of search results
                });
            }
        );

        test(`Validate search results, using price range filter max: ${product.MAX_PRICE} price`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await searchPage.submitMaxPrice(product.MAX_PRICE); //Step 4: Filter by Maximum price
                await expect(searchPage.searchResults).toBeVisible(); //Step 5: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(10); //Step 6: Validate price values
                searchResultPrices.forEach(price => {
                    expect(price).toBeLessThanOrEqual(Number(product.MAX_PRICE)); //Step 7: Validate a set of search results
                });
            }
        );

        test(`Validate search results, using price range filter min: ${product.MIN_PRICE} and max: ${product.MAX_PRICE} price`,
            async ({
                homePage,
                searchPage
            }) => {
                await homePage.searchForCategory(product.ITEM_CATEGORY); //Step 3: Search for item by keyword
                await searchPage.submitMinMaxPrice({minPrice: product.MIN_PRICE, 
                                                    maxPrice: product.MAX_PRICE //Step 4: Filter by Minimum and Maximum price
                                                });
                await expect(searchPage.searchResults).toBeVisible(); //Step 5: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(10); //Step 6: Validate price values
                searchResultPrices.forEach(price => {
                    expect(price).toBeGreaterThanOrEqual(Number(product.MIN_PRICE));
                    expect(price).toBeLessThanOrEqual(Number(product.MAX_PRICE)); //Step 7: Validate a set of search results
                });
            }
        );
    });
});
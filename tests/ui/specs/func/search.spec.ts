import { test, expect } from '../base.ts';
import { searchData } from '../../testData/searchData.data.ts';
import { SearchPage } from '../../pages/searchPage.page.ts';


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
                const pageLoadRequestCategory = searchPage.waitForSearchResults(product.ITEM_CATEGORY)
                await homePage.typeProductToSearchBox(product.ITEM_CATEGORY) //Step 3: Type product category
                await homePage.clickSearchButton() //Step 4: Click search button
                await pageLoadRequestCategory //Step 5: Wait to Navigate to search page URL
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
                const pageLoadRequestCategory = searchPage.waitForSearchResults(product.ITEM_CATEGORY)
                await homePage.typeProductToSearchBox(product.ITEM_CATEGORY) //Step 3: Type product category
                await homePage.clickSearchButton() //Step 4: Click search button
                await pageLoadRequestCategory //Step 5: Wait to Navigate to search page URL
                const checkBox = await searchPage.clickBrandFilterCheckBox(product.ITEM_BRAND) //Step 6: Check Brand checkbox
                await expect(checkBox).toBeChecked() //Step 7: Validate that brand checkbox is checked
                await expect(searchPage.searchResults).toBeVisible() //Step 8: Validate that search results are loaded
                const searchResults = await searchPage.collectSearchResults(5, product.ITEM_BRAND); //Step 9: Validate that search returned correct category
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
                const pageLoadRequestCategory = searchPage.waitForSearchResults(product.ITEM_CATEGORY)
                await homePage.typeProductToSearchBox(product.ITEM_CATEGORY) //Step 3: Type product category
                await homePage.clickSearchButton() //Step 4: Click search button
                await pageLoadRequestCategory //Step 5: Wait to Navigate to search page UR
                const pageLoadRequestMinPrice = searchPage.waitForSearchResults(`_udlo=${product.MIN_PRICE}`)
                await searchPage.waitForGoogleCollect() //Step 6: Wait for google component to load
                await expect(searchPage.minPriceField).toBeVisible() //Step 7: Validate the input field is visible
                await searchPage.fillMinPriceTextField(product.MIN_PRICE) //Step 8: Fill in minimum price
                await expect(searchPage.submitRangeButton).toBeEnabled() //Step 9: Validate submit button to be enabled
                await searchPage.clickSubmitRangeButton(); //Step 10: Submit minimum price
                await pageLoadRequestMinPrice //Step 11: Wait to Navigate to search page URL
                await expect(searchPage.searchResults).toBeVisible() //Step 12: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(5) //Step 13: Validate price values
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
                const pageLoadRequestCategory = searchPage.waitForSearchResults(product.ITEM_CATEGORY)
                await homePage.typeProductToSearchBox(product.ITEM_CATEGORY) //Step 3: Type product category
                await homePage.clickSearchButton() //Step 4: Click search button
                await pageLoadRequestCategory //Step 5: Wait to Navigate to search page URL
                const pageLoadRequestMaxPrice = searchPage.waitForSearchResults(`_udhi=${product.MAX_PRICE}`)
                await searchPage.waitForGoogleCollect() //Step 6: Wait for google component to load
                await expect(searchPage.maxPriceField).toBeVisible() //Step 7: Validate the input field is visible
                await searchPage.fillMaxPriceTextField(product.MAX_PRICE) //Step 8: Fill in maximum price
                await expect(searchPage.submitRangeButton).toBeEnabled() //Step 9: Validate submit button to be enabled
                await searchPage.clickSubmitRangeButton(); //Step 10: Submit maximum price
                await pageLoadRequestMaxPrice //Step 11: Wait to Navigate to search page URL
                await expect(searchPage.searchResults).toBeVisible() //Step 12: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(5) //Step 13: Validate price values
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
                const pageLoadRequestCategory = searchPage.waitForSearchResults(product.ITEM_CATEGORY)
                await homePage.typeProductToSearchBox(product.ITEM_CATEGORY) //Step 3: Type product category
                await homePage.clickSearchButton() //Step 4: Click search button
                await pageLoadRequestCategory //Step 5: Wait to Navigate to search page URL
                const pageLoadRequestMinPrice = searchPage.waitForSearchResults(`_udlo=${product.MIN_PRICE}`)
                const pageLoadRequestMaxPrice = searchPage.waitForSearchResults(`_udhi=${product.MAX_PRICE}`)
                await searchPage.waitForGoogleCollect() //Step 6: Wait for google component to load
                await expect(searchPage.minPriceField).toBeVisible() //Step 7: Validate the input field is visible
                await expect(searchPage.maxPriceField).toBeVisible() //Step 7: Validate the input field is visible
                await searchPage.fillMinPriceTextField(product.MIN_PRICE) //Step 8: Fill in minimum price
                await searchPage.fillMaxPriceTextField(product.MAX_PRICE) //Step 8: Fill in maximum price
                await expect(searchPage.submitRangeButton).toBeEnabled() //Step 9: Validate submit button to be enabled
                await searchPage.clickSubmitRangeButton(); //Step 10: Submit maximum price
                await pageLoadRequestMinPrice
                await pageLoadRequestMaxPrice //Step 11: Wait to Navigate to search page URL
                await expect(searchPage.searchResults).toBeVisible() //Step 12: Validate that search results are loaded
                const searchResultPrices = await searchPage.collectSearchResultPrices(5) //Step 13: Validate price values
                searchResultPrices.forEach(price => {
                    expect(price).toBeGreaterThan(Number(product.MIN_PRICE))
                    expect(price).toBeLessThan(Number(product.MAX_PRICE))
                });
            }
        );



    });


})
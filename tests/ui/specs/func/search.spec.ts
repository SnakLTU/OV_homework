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
                const searchResults = await searchPage.collectSearchResults(1); //Step 7: Validate that search returned correct category
                searchResults.forEach(result => {
                    expect.soft(result).toContain(product.ITEM_CATEGORY);
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
                await expect(checkBox).toBeChecked() //Step 8: Validate that brand checkbox is checked
                await expect(searchPage.searchResults).toBeVisible()
                const searchResults = await searchPage.collectSearchResults(1); //Step 7: Validate that search returned correct category
                searchResults.forEach(result => {
                    expect(result).toContain(product.ITEM_BRAND);
                    });
                }
        );

        test(`Validate search results, using price range filter min:${product.MIN_PRICE} price`,
            async ({
                homePage,
                searchPage
            }) => {
                const imageLoadRequest = searchPage.waitForImagesToLoad()
                await homePage.typeProductToSearchBox(product.ITEM_CATEGORY) //Step 3: Type product category
                await homePage.clickSearchButton() //Step 4: Click search button
                await searchPage.waitForSearchResults(product.ITEM_CATEGORY) //Step 5: Wait to Navigate to search page URL
                await imageLoadRequest
                await searchPage.fillMinPriceTextField(product.MIN_PRICE) //Step 6: Fill in minimum price
                await expect(searchPage.submitRangeButton).toBeEnabled() //Step 7: Validate submit button to be enabled
                await searchPage.clickSubmitRangeButton(); //Step 8: Submit minimum price
                await searchPage.waitForSearchResults(`_udlo=${product.MIN_PRICE}`) //Step 9: Wait to Navigate to search page URL
                await expect(searchPage.searchResults).toBeVisible()
                const searchResultPrices = await searchPage.collectSearchResultPrices(5)
                searchResultPrices.forEach(price => {
                    expect(price).toBeGreaterThan(Number(product.MIN_PRICE))
                })
                await expect(searchPage.submitRangeButton).toBeEnabled() //Step 7: Validate submit button to be enabled
            }
        )

    });


})
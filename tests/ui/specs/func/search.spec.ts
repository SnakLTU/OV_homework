import { test, expect } from '../base.ts';
import { searchData } from '../../testData/searchData.data.ts';


test.describe('Search and filter functionality Test Suite', () => {

    searchData.forEach(product => {

        test(`Validating search results from homePage, product ${product.ITEM_CATEGORY}`, 
            async ({homePage,
                    searchPage
             }) => {
            await homePage.goto() //Step 1: Navigate to home page
            await expect(homePage.searchBox).toBeVisible()  //Step 2: Validate that seach box is loaded and visible
            await homePage.typeProductToSearchBox(product.ITEM_CATEGORY) //Step 3: Type product category
            await homePage.clickSearchButton() //Step 4: Click search button
            await searchPage.waitForSearchResults(product.ITEM_CATEGORY) //Step 5: Wait to Navigate to search page URL
            await expect(searchPage.searchResults).toBeVisible() //Step 6: Validate that search results are loaded
            }
        );
    });


})
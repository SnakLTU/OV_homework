import { type Page, type Locator, expect } from "@playwright/test";
import { waitForPageLoad } from "../utils/waitUtils"


export class SearchPage {
    readonly page: Page;
    readonly searchResults: Locator;
    readonly submitRangeButton: Locator;
    readonly minPriceField: Locator;
    readonly maxPriceField: Locator;


    constructor(page: Page) {
        this.page = page;
        this.searchResults = this.page.locator('ul[class="srp-results srp-list clearfix"]');
        this.minPriceField = this.page.getByRole('textbox', { name: 'Minimum Value in $' });
        this.maxPriceField = this.page.getByRole('textbox', { name: 'Maximum Value in $' });
        this.submitRangeButton = this.page.getByRole('button', { name: 'Submit price range' });
    };

    async clickBrandFilterCheckBox(brand: string){
        const brandCheckbox = this.page.getByRole('link', { name: new RegExp(`${brand}(?:.+)Items`) });
        await brandCheckbox.click();
    };

    async brandFilterCheckBox(brand: string){
        return this.page.getByLabel( brand, { exact: true });
    }

    async fillMinPriceTextField(price: string){
        await this.minPriceField.pressSequentially(price);
    };

    async fillMaxPriceTextField(price: string){
        await this.maxPriceField.pressSequentially(price);
    };

    async clickSubmitRangeButton(){
        await this.submitRangeButton.click();
    };

    async selectSearchResultByNumber(num: number){
        const resultsList = this.searchResults.locator('li');
        return resultsList.nth(num);
    };

    async clickOnTargetProduct(loc: Locator){
        await loc.locator('a[target="_blank"]').first().click();
    };

    async filterForBrand(brand: string){
        const pageLoadRequestBrand = waitForPageLoad(this.page, `&Brand=${brand}&`); //Initiate even wait
        await this.clickBrandFilterCheckBox(brand); //Check Brand checkbox
        await pageLoadRequestBrand; //Wait to Navigate to search page URL
        const checkBox = this.page.getByLabel( brand, { exact: true });
        await expect(checkBox).toBeChecked(); //Validate that brand checkbox is checked
    };

    async submitMinPrice(minPrice: string){
        const pageLoadRequestMinPrice = waitForPageLoad(this.page, `_udlo=${minPrice}`);
        await expect(this.minPriceField).toBeVisible(); //Step 7: Validate the input field is visible
        await this.fillMinPriceTextField(minPrice); //Step 8: Fill in minimum price
        await expect(this.submitRangeButton).toBeEnabled(); //Step 9: Validate submit button to be enabled
        await this.clickSubmitRangeButton(); //Step 10: Submit minimum price
        await pageLoadRequestMinPrice; //Step 11: Wait to Navigate to search page URL
    };

    async submitMaxPrice(maxPrice: string){
        const pageLoadRequestMaxPrice = waitForPageLoad(this.page, `_udhi=${maxPrice}`);
        await expect(this.maxPriceField).toBeVisible(); //Step 7: Validate the input field is visible
        await this.fillMaxPriceTextField(maxPrice); //Step 8: Fill in minimum price
        await expect(this.submitRangeButton).toBeEnabled(); //Step 9: Validate submit button to be enabled
        await this.clickSubmitRangeButton(); //Step 10: Submit minimum price
        await pageLoadRequestMaxPrice; //Step 11: Wait to Navigate to search page URL
    };

    async submitMinMaxPrice(prices:{minPrice: string, maxPrice: string}){
        const pageLoadRequestMinMaxPrice = waitForPageLoad(this.page, `_udlo=${prices.minPrice}&_udhi=${prices.maxPrice}`);
        await expect(this.minPriceField).toBeVisible(); //Step 7: Validate the input field is visible
        await expect(this.maxPriceField).toBeVisible(); //Step 7: Validate the input field is visible
        await this.fillMinPriceTextField(prices.minPrice); //Step 8: Fill in minimum price
        await this.fillMaxPriceTextField(prices.maxPrice); //Step 8: Fill in minimum price
        await expect(this.submitRangeButton).toBeEnabled(); //Step 9: Validate submit button to be enabled
        await this.clickSubmitRangeButton(); //Step 10: Submit minimum price
        await pageLoadRequestMinMaxPrice;
    }

    async collectSearchResults(range: number, text: string){
        const collectedResults: (string | null)[] = Array();
        const resultsList = this.searchResults.locator('li').filter({hasText : text});
        for (let i=0; i<range; i++){
            collectedResults.push(  await resultsList.nth(i)
                                    .locator('span[class="su-styled-text primary default"]')
                                    .textContent()
                                );
        };
        return collectedResults;
    };

    async collectSearchResultPrices(range: number){
        const collectedResults: (number | null)[] = Array();
        const resultsList = this.searchResults.locator('li');
        for (let i=0; i<range; i++){
            let priceText = await resultsList.nth(i).locator('div[class="s-card__attribute-row"]')
                                                  .first()
                                                  .textContent();
            if (priceText) {
                priceText = priceText.replace('$', '');
                const price = parseFloat(priceText);
                collectedResults.push(price);
            }
        };
        return collectedResults;
    };
};

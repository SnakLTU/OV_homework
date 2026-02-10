import { type Page, type Locator } from "@playwright/test";

export class SearchPage {
    readonly page: Page;
    readonly searchResults: Locator
    readonly submitRangeButton: Locator
    readonly minPriceField: Locator
    readonly maxPriceField: Locator


    constructor(page: Page) {
        this.page = page;
        this.searchResults = this.page.locator('ul[class="srp-results srp-list clearfix"]');
        this.minPriceField = this.page.getByRole('textbox', { name: 'Minimum Value in $' });
        this.maxPriceField = this.page.getByRole('textbox', { name: 'Maximum Value in $' })
        this.submitRangeButton = this.page.getByRole('button', { name: 'Submit price range' });
    };

    async waitForSearchResults(productName: string){
        return this.page.waitForURL(new RegExp(`${productName}`));
    };

    async waitForImagesToLoad(){
        return  this.page.waitForResponse(response =>
                response.url().includes('multiple_images_expsvc') && response.status() === 200
        );
    };

    async waitForGoogleCollect(){
        return  this.page.waitForResponse(response =>
                response.url().includes('/ccm/collect') && response.status() === 200
        );
    };

    async clickBrandFilterCheckBox(brand: string){
        const brandCheckbox = this.page.getByLabel( brand, { exact: true });
        await brandCheckbox.click();
        return brandCheckbox;
    };

    async fillMinPriceTextField(price: string){
        await this.minPriceField.pressSequentially(price);
    };

    async fillMaxPriceTextField(price: string){
        await this.maxPriceField.pressSequentially(price);
    };

    async clickSubmitRangeButton(){
        await this.submitRangeButton.click();
    };

    async collectSearchResults(range: number, text: string){
        const collectedResults: (string | null)[] = Array()
        const resultsList = this.searchResults.locator('li').filter({hasText : text});
        for (let i=0; i<range; i++){
            collectedResults.push(  await resultsList.nth(i)
                                    .locator('span[class="su-styled-text primary default"]')
                                    .textContent()
                                )
        };
        return collectedResults;
    };

    async collectSearchResultPrices(range: number){
        const collectedResults: (number | null)[] = Array()
        const resultsList = this.searchResults.locator('li');
        for (let i=0; i<range; i++){
            let priceText = await resultsList.nth(i).locator('div[class="s-card__attribute-row"]')
                                                  .first()
                                                  .textContent()
            if (priceText) {
                priceText = priceText.replace('$', '')
                const price = parseFloat(priceText)
                collectedResults.push(price)
            }
        };
        return collectedResults
    }
};

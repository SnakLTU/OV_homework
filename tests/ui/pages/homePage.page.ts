import { type Page, type Locator } from "@playwright/test";
import { waitForPageLoad } from "../utils/waitUtils"

export class HomePage {
    readonly page: Page;
    readonly searchBox: Locator;
    readonly searchButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.searchBox = page.getByPlaceholder('Search for anything')
        this.searchButton = page.locator('#gh-search-btn')
        
    };

    async goto() {
        await this.page.goto(process.env.WEB_UI_URL || '');
    };

    async typeProductToSearchBox(product: string) {
        await this.searchBox.clear()
        await this.searchBox.fill(product)
    };

    async clickSearchButton() {
        await this.searchButton.click()
    };



    async searchForCategory(category: string){
        const pageLoadRequestCategory = waitForPageLoad(this.page, `_nkw=${category}&`); //Initiate even wait
        await this.typeProductToSearchBox(category); //Type product category
        await this.clickSearchButton(); //Click search button
        await pageLoadRequestCategory; //Wait to Navigate to search page URL

    };

};

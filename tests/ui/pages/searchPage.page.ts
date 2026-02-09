import { type Page, type Locator } from "@playwright/test";

export class SearchPage {
    readonly page: Page;
    readonly searchResults: Locator


    constructor(page: Page) {
        this.page = page;
        this.searchResults = this.page.locator('ul[class="srp-results srp-list clearfix"]')
        
    };

    async waitForSearchResults(productName: string) {
        await this.page.waitForURL(new RegExp(`\\/sch\\/i.html\\?_nkw=${productName}&`)); 
    }
};

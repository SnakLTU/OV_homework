import { type Page, type Locator } from "@playwright/test";

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
    }

};

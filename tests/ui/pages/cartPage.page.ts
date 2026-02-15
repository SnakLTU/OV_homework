import { type Page, type Locator, expect } from "@playwright/test";
import { waitForPageLoad } from "../utils/waitUtils"

export class CartPage {
    readonly page: Page;
    readonly goToCheckoutButton;



    constructor(page: Page) {
        this.page = page;
        this.goToCheckoutButton = this.page.getByRole('button', {name: 'Go to checkout'})
    };

    async awaitForCartPage(){
        const pageLoadRequestBrand = waitForPageLoad(this.page, `\/cart.`) //Initiate even wait
        await pageLoadRequestBrand //Wait to Navigate to search page URL
        await expect(this.goToCheckoutButton).toBeVisible() //Validate that brand checkbox is checked
    };



};
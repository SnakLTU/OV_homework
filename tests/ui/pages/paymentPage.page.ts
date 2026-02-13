import { type Page, type Locator, expect } from "@playwright/test";
import { waitForPageLoad } from "../utils/waitUtils"

export class PaymentPage {
    readonly page: Page;
    readonly shippingForm


    constructor(page: Page) {
        this.page = page;
        this.shippingForm = this.page.locator('div[data-test-id=SHIPPING_ADDRESS_FORM]')
    };

    async awaitForPaymentPage(){
        const pageLoadRequestBrand = waitForPageLoad(this.page, `\/pay.`) //Initiate even wait
        await pageLoadRequestBrand //Wait to Navigate to search page URL
        await expect(this.shippingForm).toBeVisible() //Validate that brand checkbox is checked
    };


};
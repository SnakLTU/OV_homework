import { type Page, type Locator, expect } from "@playwright/test";
import { checkForCAPTCHA } from "../utils/waitUtils"


export class ProductPage {
    readonly page: Page;
    readonly buyItNowButton: Locator;
    readonly addToCartButton: Locator;
    readonly addToWatchlist: Locator
    readonly checkoutAsGuestLink: Locator;
    readonly collorDropDown: Locator;
    readonly chooseCollorDropDown: Locator;
    readonly seeInCartButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.buyItNowButton = this.page.getByText('Buy It Now');
        this.addToCartButton = this.page.getByText('Add to cart');
        this.addToWatchlist = this.page.getByText('Add to Watchlist');
        this.checkoutAsGuestLink = this.page.getByRole('link', { name: 'Check out as guest' });
        this.collorDropDown = this.page.getByRole('button', { name: 'Color: Select' });
        this.chooseCollorDropDown = this.page.getByRole('button', { name: 'Choose Colour: Select' });
        this.seeInCartButton = this.page.getByRole('link', { name: 'See in cart' })
    };

    async clickBuyNow() {
        await this.buyItNowButton.click();
    };

    async clickAddToCart(){
        await this.addToCartButton.click();
    }

    async clickCheckoutAsGuestLink(){
        await this.checkoutAsGuestLink.click();
    };

    async clickSeeInCart(){
        await this.seeInCartButton.click()
    }

    async validateProductsActionButtonsVisible(){
        expect(this.buyItNowButton).toBeVisible();
        expect(this.addToCartButton).toBeVisible();
        expect(this.addToWatchlist).toBeVisible();
    };

    async buyProductAsGuest(){
        await this.clickBuyNow();
        expect(this.checkoutAsGuestLink).toBeVisible();
        await this.clickCheckoutAsGuestLink();
    };

    async checkCAPTCHA(){
        return await checkForCAPTCHA(this.page);
    };

    async checkForColorField(){
        if (await this.collorDropDown.count() >= 1){
            await this.collorDropDown.click();
            await this.page.getByRole('option', { name: 'Black Most popular Most' }).click();
            return true;
        }
        else if (await this.chooseCollorDropDown.count() >= 1){
            await this.chooseCollorDropDown.click();
            await this.page.getByRole('option', { name: 'Black Most popular Most' }).click();
            return true;
        }
        return true;
    };


};
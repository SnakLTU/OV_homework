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
    readonly closeAddToCartDialogButton: Locator;
    readonly dialogHeaderAddedToCart: Locator;
    readonly headerCartWithOneItems: Locator;
    readonly cartRemoveItemButton: Locator;
    readonly headerCartEmpty: Locator;


    constructor(page: Page) {
        this.page = page;
        this.buyItNowButton = this.page.getByText('Buy It Now');
        this.addToCartButton = this.page.getByText('Add to cart');
        this.addToWatchlist = this.page.getByText('Add to Watchlist');
        this.dialogHeaderAddedToCart = this.page.getByText('Added to cart');
        this.checkoutAsGuestLink = this.page.getByRole('link', { name: 'Check out as guest' });
        this.collorDropDown = this.page.getByRole('button', { name: 'Color: Select' });
        this.chooseCollorDropDown = this.page.getByRole('button', { name: 'Choose Colour: Select' });
        this.seeInCartButton = this.page.getByRole('link', { name: 'See in cart' });
        this.closeAddToCartDialogButton = this.page.getByRole('button', { name: 'Close dialog' });
        this.headerCartWithOneItems = page.getByRole('link', { name: 'Your shopping cart contains 1' });
        this.headerCartEmpty = page.getByRole('heading', { name: 'Your cart is empty' })
        this.cartRemoveItemButton = page.locator('button[class="gh_info__delete"]')
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

    async clickCloseAddToCartDialog(){
        await this.closeAddToCartDialogButton.click();
    };

    async hoverOverActiveCart() {
        await this.headerCartWithOneItems.hover()
    };

    async waitForCartToLoad() {
        await expect(this.page.getByText('Loading...')).toBeHidden()
    };

    async clickRemoveItemFromCart(){
        await this.cartRemoveItemButton.click()
    }

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

    async removeItemFromCart(){
        await expect(this.dialogHeaderAddedToCart).toBeHidden();
        await this.hoverOverActiveCart();
        await this.waitForCartToLoad();
        await expect(this.cartRemoveItemButton).toBeVisible();
        await this.clickRemoveItemFromCart();
        await expect(this.headerCartWithOneItems).toBeHidden();
        await expect(this.headerCartEmpty).toBeVisible();
    }


};
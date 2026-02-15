import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage.page';
import { SearchPage } from '../pages/searchPage.page';
import { ProductPage } from '../pages/productPage.page';
import { PaymentPage } from '../pages/paymentPage.page';
import { CartPage } from '../pages/cartPage.page';


type MyFixtures = {
    homePage: HomePage;
    searchPage: SearchPage;
    productPage: ProductPage;
    paymentPage: PaymentPage;
    cartPage: CartPage;
};

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    paymentPage: async ({ page }, use) => {
        await use(new PaymentPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});


export {expect} from '@playwright/test';
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage.page';
import { SearchPage } from '../pages/searchPage.page';

type MyFixtures = {
    homePage: HomePage;
    searchPage: SearchPage;
};

export const test = base.extend<MyFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },

});


export {expect} from '@playwright/test';
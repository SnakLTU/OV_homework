import { type Page, type Locator , expect} from "@playwright/test";

export async function waitForPageLoad(waitPage: Page, urlRegex: string) {
    const checkBrowserMessage: Locator = waitPage.getByAltText('Checking your browser before you access eBay.')
    if(await checkBrowserMessage.isVisible()){
        await waitPage.waitForURL('**/splashui/challenge**');
    }
    await waitPage.waitForURL(new RegExp(urlRegex));
};

export async function checkForCAPTCHA(targetPage: Page){
    if(targetPage.url().includes('captcha')){
        return true
    };
    return false
};

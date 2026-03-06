const playwright = require('playwright');

class SeleniumDocNavigator {
  constructor(options = {}) {
    this.browserType = options.browserType || 'chromium';
    this.headless = options.headless !== undefined ? options.headless : true;
  }

  async captureFooter() {
    const browser = await playwright[this.browserType].launch({ headless: this.headless });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.selenium.dev/', { waitUntil: 'networkidle' });

    const docHref = '/documentation/';
    const navLink = await page.$(`a[href='${docHref}']`);
    if (navLink) {
      await navLink.click();
    } else {
      const locator = page.locator('text=Documentation').first();
      if (await locator.count()) await locator.click();
    }

    await page.waitForLoadState('networkidle');

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const total = document.body.scrollHeight;
        window.scrollTo({ top: total, behavior: 'smooth' });
        setTimeout(resolve, 700);
      });
    });

    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const f = document.querySelector('footer') || document.body;
      return {
        url: location.href,
        title: document.title,
        footerText: (f && f.innerText) ? f.innerText : ''
      };
    });

    await browser.close();
    return result;
  }
}

module.exports = SeleniumDocNavigator;

#!/usr/bin/env node
const path = require('path');
const SeleniumDocNavigator = require(path.join(__dirname, '..', 'src', 'playwright', 'SeleniumDocNavigator'));

(async () => {
  const nav = new SeleniumDocNavigator({ headless: true });
  try {
    const res = await nav.captureFooter();
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error capturing footer:', err);
    process.exitCode = 2;
  }
})();

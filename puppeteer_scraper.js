const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.f-marinos.com/ticket/schedule', { waitUntil: 'networkidle0' });

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    return rows.map(row => {
      const cells = row.querySelectorAll('td, th');
      return {
        matchDate: cells[0]?.innerText.trim(),
        round: cells[1]?.innerText.trim(),
        opponent: cells[2]?.innerText.trim(),
        ichiji: cells[3]?.innerText.trim(),
        niji: cells[4]?.innerText.trim(),
        sanji: cells[5]?.innerText.trim(),
        ippan: cells[6]?.innerText.trim()
      };
    });
  });

  fs.writeFileSync('schedule.json', JSON.stringify(data, null, 2));
  await browser.close();
})();

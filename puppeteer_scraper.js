const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://www.f-marinos.com/ticket/schedule', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));

    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td, th')).map(cell =>
        cell.innerText.trim()
      );

      return {
        // 試合日時
        matchDate: cells[0] || '',

        // 対戦相手・スタジアム・K.O.時間
        round: cells[1] || '',

        // 追加された2列
        personalSeasonTicket: cells[2] || '',
        corporateSeasonTicket: cells[3] || '',

        // チケット発売日
        ichiji: cells[4] || '',
        niji: cells[5] || '',
        sanji: cells[6] || '',
        ippan: cells[7] || '',

        // チケット販売概要
        ticketOverview: cells[8] || ''
      };
    });
  });

  fs.writeFileSync('schedule.json', JSON.stringify(data, null, 2), 'utf-8');

  await browser.close();
})();

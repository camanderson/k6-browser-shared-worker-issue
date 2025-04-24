import { browser } from 'k6/browser';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
				browser: {
					type: 'chromium',
        },
      },
  	},
  },
	thresholds: {
		checks: ['rate==1.0'],
	},
};

export default async function () {
	const context = await browser.newContext();
	const page = await context.newPage();

	try {
		await page.goto('http://localhost:5173/');
		
		// Pausing test to interact with devTools
		await page.waitForTimeout(9999999);
	} finally {
		await page.close();
	}
}
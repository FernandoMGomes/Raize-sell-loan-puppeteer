const puppeteet = require('puppeteer');
const prompt = require('prompt');


let page;
let browser;
const prompt_login = [
	{
		name: 'email',
		hidden: false
	},
	{
		name: 'password',
		hidden: true
	},
];
const prompt_token = [
	{
		name: 'token',
		hidden: true
	},
];


const selectorExist = async page => {
	do {
		try {
			await page.waitFor(1000);
			page.waitForNavigation({ waitUntil: 'networkidle2' });
			page.click('table > tbody > tr:first-child');
			page.waitForNavigation({ waitUntil: 'networkidle2' });
			await page.waitFor(3000);
			await page.waitForSelector('ul[class="list-inline modal-nav-tab"] > li:last-child > a');
			page.click('ul[class="list-inline modal-nav-tab"] > li:last-child > a');
			await page.waitFor(2000);
			await page.waitForSelector('input[name="termsAccepted"]');
			await page.evaluate(() => {
				const checkbox = document.getElementsByName('termsAccepted');
				checkbox[0].style.width = '5px';
				checkbox[0].style.height = '5px';
				return;
			});
			const name = await page.evaluate(() => document.querySelector('.modal-title').innerText);

			page.click('input[name="termsAccepted"]');
			await page.waitFor(1000);
			page.click('button[type="submit"]');
			await page.waitFor(2000);
			await page.waitForSelector('button[type="button"]');
			page.click('button[type="button"]');
			page.waitForNavigation({ waitUntil: 'networkidle2' });
			console.log("\x1b[44m",'Loan Sold')
			console.log("\x1b[43m", name)
			await page.waitFor(3000);
		} catch (error) {
			console.log("\x1b[31m", "Error login");
			console.log(error);
			return;
		}
	} while (page.$('table > tbody > tr:first-child') !== null);
	return;
};

const login = async () => {
	try{
		let email;
		let password;
		let token;

		prompt.start();
		browser = await puppeteet.launch();
		page = await browser.newPage();
		
		await page.setViewport({ width: 1440, height: 1080 });
		await page.goto('https://www.raize.pt');
		
		page.click('a[href="/login"]');
		page.waitForNavigation({ waitUntil: 'networkidle2' });
		await page.waitForSelector('input[name="username"]');
		await new Promise((resolve, reject) => {
			prompt.get(prompt_login, (err, result) => {
					if (err) {
						console.log('EROOR PROMPT LOGIN',err);
						reject(error);
					}else {
						email = result.email;
						password = result.password;
						console.log("\x1b[32m", "Comand-line Done")
						resolve(result)
					}
				});
		})
		await page.type('input[name="username"]', email);
		await page.type('input[name="password"]', password);
		page.click('button[type="submit"]');
		email = null;
		password = null;
		await page.waitForResponse(response => {
			if (response.url() === 'https://api.raize.pt/oauth2/token' && response.status() === 200) {
				return response;
			}
		});


		await new Promise((resolve, reject) => {
			prompt.get(prompt_token, (err, result) => {
			if (err) {
				console.log('EROOR PROMPT TOKEN',err);
				reject(error);
			}else {
				token = result.token;
				console.log("\x1b[32m", "Comand-line Done")
				resolve()
			}
			});
		});
		console.log(token)
		await page.type('input[name="code"]', token);
		token = null;
		await page.click('button[type="submit"]');
		page.waitForNavigation({ waitUntil: 'networkidle2' });

		await page.waitForResponse(response => {
			if (response.url() === 'https://api.raize.pt/oauth2/token' && response.status() === 200) {
				return response;
			}
		});
		console.log("\x1b[31m", "Login DONE!")

	}catch (error) {
		console.log("\x1b[31m", "Error login")
		console.log(error)
	}
}

const gotToLoan = async () => {
	try{
		await page.waitFor(1000);
		await page.waitForSelector('ul[class="nav navbar-nav"]');
		page.click('ul[class="nav navbar-nav"] > li:nth-child(2)');

		await page.waitForSelector('a[title="lista"]');
		page.click('a[title="lista"]');

		await page.waitForSelector('div[class="loan-filter"] > div > div > div:nth-child(2) > div');
		page.click('div[class="loan-filter"] > div > div > div:nth-child(2) > div');

		await page.waitForSelector('div[class="loan-filter"] > div > div > div:nth-child(2) > ul > li:nth-child(2)');
		page.click('div[class="loan-filter"] > div > div > div:nth-child(2) > ul > li:nth-child(2)');

		await page.waitForSelector('div[class="loan-filter"] > div > div > div:nth-child(3) > div');
		page.click('div[class="loan-filter"] > div > div > div:nth-child(3) > div');

		await page.waitForSelector('div[class="loan-filter"] > div > div > div:nth-child(3) > ul > li:nth-child(2)');
		page.click('div[class="loan-filter"] > div > div > div:nth-child(3) > ul > li:nth-child(2)');

		await page.waitForSelector('table > tbody > tr:first-child');
		

	}catch (error) {
		console.log("\x1b[31m", "Error Go To Loan")
		console.log(error)
	}
}

(async () => {
	try {
		await login();
		await gotToLoan();
		await selectorExist(page);

		console.log("\x1b[31m", "DONE!!!!")
		browser.close();
		
	} catch (error) {
		console.log(error);
	}
	await browser.close();
})();

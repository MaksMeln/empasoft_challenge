const { defineConfig } = require('cypress');

module.exports = defineConfig({
	reporter: 'mocha-allure-reporter',
	viewportWidth: 1536,
	viewportHeight: 980,
	chromeWebSecurity: false,
	waitForAnimations: true,
	requestTimeout: 10000,
	responseTimeout: 10000,
	pageLoadTimeout: 40000,
	elementLoadTimeout: 10000,
	defaultCommandTimeout: 10000,
	video: false,
	numTestsKeptInMemory: 10,
	env: {
		testEnv: 'desktop',
		name: 'admin',
		password: 'password',
		mobile: process.env.MOBILE || false,
		device: process.env.DEVICE,
		surface: process.env.SURFACE || false,
	},
	e2e: {
		setupNodeEvents(on, config) {
			return config;
		},
		baseUrl: 'https://automationintesting.online/',
	},
});

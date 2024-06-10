import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
	// Ignore specific AxiosError related to postMessage
	if (err.message.includes('Request failed with status code 403')) {
		return false;
	}

	// Ignore other specific errors
	if (err.message.includes('Minified React error #403')) {
		return false;
	}

	// Let Cypress handle all other errors
	return true;
});

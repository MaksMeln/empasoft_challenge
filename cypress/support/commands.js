Cypress.Commands.add('viewportSetup', () => {
	if (Cypress.env('mobile')) {
		cy.viewport(Cypress.env('device'));
	} else if (Cypress.env('surface')) {
		cy.viewport(912, 1936);
	}
});

Cypress.Commands.add('visitHomePage', () => {
	cy.intercept('GET', '').as('homePage');
	cy.intercept('GET', '/branding/').as('branding');
	cy.intercept('GET', '/room/').as('room');

	cy.visit('/');

	cy.wait('@homePage');
	cy.wait('@branding');
	cy.wait('@room');
});

Cypress.Commands.add('visitAdminPanelPage', () => {
	cy.visitHomePage();
	cy.intercept('POST', '/auth/validate').as('adminPage');
	cy.contains('Admin panel').click();
	cy.wait('@adminPage');
});

Cypress.Commands.add('loginAdmin', () => {
	cy.get('[data-testid="username"]').type('admin');
	cy.get('[data-testid="password"]').type('password');
	cy.get('[data-testid="submit"]').click();
	cy.get('button').contains('Let me hack!').click();
});

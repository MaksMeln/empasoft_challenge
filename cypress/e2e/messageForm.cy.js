import {
	personData,
	errorMessages,
	invalidName,
	invalidEmail,
	invalidPhone,
} from '../support/constans';
import { faker } from '@faker-js/faker';

describe('1. Contact Form Submission', () => {
	beforeEach(() => {
		cy.viewportSetup();
		cy.visitHomePage();
		cy.intercept('POST', '/message/').as('postMessage');
	});

	it('Positive scrnario: should submit the form successfully', () => {
		// Fill in the form
		cy.get('[data-testid="ContactName"]').type(personData.name);
		cy.get('[data-testid="ContactEmail"]').type(personData.email);
		cy.get('[data-testid="ContactPhone"]').type(personData.phone);
		cy.get('[data-testid="ContactSubject"]').type(personData.subject);
		cy.get('[data-testid="ContactDescription"]').type(personData.message);
		cy.get('#submitContact').click();

		// Verify the response
		cy.wait('@postMessage').its('response.statusCode').should('eql', 201);

		// Verify the success message on the page
		cy.get('.contact').within(() => {
			cy.contains(`Thanks for getting in touch ${personData.name}`).should(
				'be.visible'
			);
			cy.contains(`We'll get back to you about`).should('be.visible');
			cy.contains(personData.subject).should('be.visible');
			cy.contains(`as soon as possible.`).should('be.visible');
		});

		// Open the user inbox and select the message
		cy.visitAdminPanelPage();
		cy.loginAdmin();
		if (Cypress.env('mobile')) {
			cy.get('.navbar-toggler').click();
		}
		cy.get('.fa-inbox').click();
		cy.get('.messages').contains(personData.name).click();

		// Verify the details of the message
		cy.get('[data-testid="message"]').within(() => {
			cy.contains(`From: ${personData.name}`).should('be.visible');
			cy.contains(`Phone: ${personData.phone}`).should('be.visible');
			cy.contains(`Email: ${personData.email}`).should('be.visible');
			cy.contains(personData.subject).should('be.visible');
			cy.contains(personData.message).should('be.visible');
		});
	});

	it('Negative scenario: Displaying error message when entering incorrect number of characters', () => {
		// Submitting an empty form
		cy.get('#submitContact').click();
		cy.wait('@postMessage').its('response.statusCode').should('eql', 400);
		cy.get('.alert-danger').within(() => {
			Object.values(errorMessages.contactForm).forEach((element) => {
				cy.contains(element).should('be.visible');
			});
		});

		//: Phone number length constraints
		[faker.string.numeric(10), faker.string.numeric(22)].forEach((phone) => {
			cy.get('[data-testid="ContactPhone"]').clear().type(phone);
			cy.get('#submitContact').click();
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.contactForm.phoneCount).should('be.visible');
			});
		});

		//: Subject length constraints
		[faker.string.alpha(4), faker.string.alpha(105)].forEach((text) => {
			cy.get('[data-testid="ContactSubject"]').clear().type(text);
			cy.get('#submitContact').click();
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.contactForm.subjectCount).should(
					'be.visible'
				);
			});
		});

		//: Message length constraints
		[faker.string.alpha(19), faker.string.alpha(2001)].forEach((message) => {
			cy.get('[data-testid="ContactDescription"]').clear().type(message);
			cy.get('#submitContact').click();
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.contactForm.messageCount).should(
					'be.visible'
				);
			});
		});
	});

	// FAIL TESTING - BUGS
	it('Negative scenario: Displaying error message when entering invalid characters in the fields', () => {
		//: Invalid name formats
		invalidName.forEach((name) => {
			cy.get('[data-testid="ContactName"]').clear().type(name);
			cy.get('#submitContact').click();
			cy.wait('@postMessage').its('response.statusCode').should('eql', 400);
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.invalidContactForm.invalidName).should(
					'be.visible'
				);
			});
		});

		//: Invalid phone formats
		invalidPhone.forEach((phone) => {
			cy.get('[data-testid="ContactPhone"]').clear().type(phone);
			cy.get('#submitContact').click();
			cy.wait('@postMessage').its('response.statusCode').should('eql', 400);
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.invalidContactForm.invalidPhone).should(
					'be.visible'
				);
			});
		});

		//: Invalid email formats
		invalidEmail.forEach((email) => {
			cy.get('[data-testid="ContactEmail"]').clear().type(email);
			cy.get('#submitContact').click();
			cy.wait('@postMessage').its('response.statusCode').should('eql', 400);
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.invalidContactForm.invalidEmail).should(
					'be.visible'
				);
			});
		});
	});
});

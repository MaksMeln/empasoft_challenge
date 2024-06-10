import { roomData, errorMessages } from '../support/constans';

describe('2. Room Creation and Verification', () => {
	beforeEach(() => {
		cy.viewportSetup();
		cy.visitAdminPanelPage();
		cy.loginAdmin();
		cy.intercept('POST', '/room/').as('postRoom');
	});

	// Create a new room
	it('Positive scenario: should create a room and verify its details', () => {
		// Create a new room
		cy.get('[data-testid="roomName"]').type(roomData.name);
		cy.get('#type').select(roomData.type);
		cy.get('#accessible').select(roomData.accessible);
		cy.get('#roomPrice').type(roomData.price);

		// Select room details
		roomData.roomDetails.forEach((detail) => {
			cy.get('.form-check').contains(detail).click();
		});

		// Submit the form to create the room
		cy.get('#createRoom').click();

		// Verify the response
		cy.wait('@postRoom').its('response.statusCode').should('eql', 201);

		// Verify the room details in the room listing
		cy.get('[data-testid="roomlisting"]')
			.last()
			.within(() => {
				cy.contains(roomData.name).should('be.visible');
				cy.contains(roomData.type).should('be.visible');
				cy.contains(roomData.price).should('be.visible');
				roomData.roomDetails.forEach((detail) => {
					cy.contains(detail).should('be.visible');
				});
			});

		// Verify the room details on the homepage
		cy.visitHomePage();
		cy.get('.hotel-room-info')
			.last()
			.within(() => {
				cy.contains('h3', roomData.type).should('be.visible');
				roomData.roomDetails.forEach((detail) => {
					cy.contains('li', detail).should('be.visible');
				});
			});
	});

	it('Negative scenario:should display error messages when submitting an empty form and invalid price', () => {
		// Submitting an empty form
		cy.get('#createRoom').click();

		// Verify error messages for empty fields
		cy.wait('@postRoom').its('response.statusCode').should('eql', 400);
		cy.get('.alert').within(() => {
			cy.contains(errorMessages.roomForm.roomNameEmpty).should('be.visible');
			cy.contains(errorMessages.roomForm.roomPriceEmpty).should('be.visible');
		});

		// Entering an over-the-limit price
		cy.get('#roomPrice').type(roomData.overPrice);
		cy.get('#createRoom').click();

		// Verify error message for over-the-limit price
		cy.get('.alert').within(() => {
			cy.contains(errorMessages.roomForm.roomOverPrice).should('be.visible');
		});
	});

	// Update the room
	it('Positive Scenario: should update room details and verify the changes', () => {
		// Select the first room in the listing and click edit
		cy.get('[data-testid="roomlisting"]').first().click();
		cy.get('button').contains('Edit').click();

		// Uncheck all selected features
		cy.get('.form-check-input').each((el) => {
			cy.wait(400);
			cy.wrap(el).uncheck();
		});

		// Update room details
		cy.get('#roomName').clear().type(roomData.name);
		cy.get('#type').select(roomData.type);
		cy.get('#accessible').select(roomData.accessible);
		cy.get('#roomPrice').clear().type(roomData.price);

		// Select new room details
		roomData.roomDetails.forEach((detail) => {
			cy.get('.form-check').contains(detail).click();
		});

		// Update room description
		cy.get('#description').clear().type(roomData.description);

		// Submit the updated form
		cy.get('#update').click();

		// Verify the updated room details in the room listing
		cy.get('.room-details').within(() => {
			cy.contains(`Room: ${roomData.name}`).should('be.visible');
			cy.contains(`Type: ${roomData.type}`).should('be.visible');
			cy.contains(`Accessible: ${roomData.accessible}`).should('be.visible');
			cy.contains(`Features:`).should('be.visible');
			roomData.roomDetails.forEach((detail) => {
				cy.contains(detail).should('be.visible');
			});
			cy.contains(`Room price: ${roomData.price}`).should('be.visible');
		});

		// Verify the room details on the homepage
		cy.visitHomePage();
		cy.contains('h3', roomData.type)
			.parents('.hotel-room-info')
			.within(() => {
				cy.contains('h3', roomData.type).should('be.visible');
				cy.contains(roomData.description).should('be.visible');
				roomData.roomDetails.forEach((detail) => {
					cy.contains('li', detail).should('be.visible');
				});
			});
	});
});

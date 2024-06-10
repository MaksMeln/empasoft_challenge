import { faker } from '@faker-js/faker';

// Function to visit the home page and intercept necessary requests
const visitHomePage = () => {
	cy.intercept('GET', '').as('homePage');
	cy.intercept('GET', '/branding/').as('branding');
	cy.intercept('GET', '/room/').as('room');

	cy.visit('/');
	cy.wait(['@homePage', '@branding', '@room']);
};

// Function to visit the admin panel
const visitAdminPanelPage = () => {
	visitHomePage();
	cy.intercept('POST', '/auth/validate').as('adminPage');
	cy.contains('Admin panel').click();
	cy.wait('@adminPage');
};

// Function to log in as admin
const loginAdmin = () => {
	cy.get('[data-testid="username"]').type('admin');
	cy.get('[data-testid="password"]').type('password');
	cy.get('[data-testid="submit"]').click();
	cy.get('button').contains('Let me hack!').click();
};

// Function to viewport settings
const viewportSetup = () => {
	if (Cypress.env('mobile')) {
		cy.viewport(Cypress.env('device'));
	} else if (Cypress.env('surface')) {
		cy.viewport(912, 1936);
	}
};

// Function to get random elements from an array
const getRandomElements = (array, count = 1) => {
	const result = [];
	while (result.length < count) {
		const randomElement = array[Math.floor(Math.random() * array.length)];
		if (!result.includes(randomElement)) {
			result.push(randomElement);
		}
	}
	return result;
};

// Test data
const personData = {
	name: faker.person.firstName(),
	email: faker.internet.email({ provider: 'maildrop.cc' }),
	phone: faker.string.numeric({ length: { min: 11, max: 21 } }),
	subject: faker.string.alpha({ length: { min: 5, max: 100 } }),
	message: faker.string.alpha({ length: { min: 20, max: 2000 } }),
};

const roomData = {
	name: faker.number.int({ min: 10, max: 999 }),
	type: getRandomElements(['Single', 'Twin', 'Double', 'Family', 'Suite'])[0],
	accessible: getRandomElements(['true', 'false'])[0],
	price: faker.number.int({ min: 10, max: 999 }),
	roomDetails: getRandomElements(
		['WiFi', 'TV', 'Radio', 'Refreshments', 'Safe', 'Views'],
		3
	),
	description: faker.lorem.sentence(),
	overPrice: faker.number.int({ min: 1000, max: 10000 }),
};

const errorMessages = {
	contactForm: {
		emailBlank: 'Email may not be blank',
		subjectBlank: 'Subject may not be blank',
		messageBlank: 'Message may not be blank',
		nameBlank: 'Name may not be blank',
		phoneBlank: 'Phone may not be blank',
		subjectCount: 'Subject must be between 5 and 100 characters.',
		messageCount: 'Message must be between 20 and 2000 characters.',
		phoneCount: 'Phone must be between 11 and 21 characters.',
	},
	invalidContactForm: {
		invalidEmail: 'must be a well-formed email address',
		invalidName: 'must be a well-formed name',
		invalidPhone: 'must be a well-formed phone number',
	},
	roomForm: {
		roomNameEmpty: 'Room name must be set',
		roomPriceEmpty: 'must be greater than or equal to 1',
		roomOverPrice: 'must be less than or equal to 999',
	},
};

const invalidName = ['😊😊😊😊😊', '1234', '!@#$%^&*', 'test.', '.test', '___'];
const invalidEmail = [
	' ',
	'username',
	'@',
	'username@',
	' username@example.com',
	'user name@example.com',
	'user@name@example.com',
	'user.name@example..com',
	'@example.com',
	'username@.com',
	'username@',
	'user😊name@example.com',
	'mailto:username@example.com',
	'username@example',
	'user!name@example.com',
	'юзернейм@экзампл.ком',
	'username@[192.0.2.1]',
];
const invalidPhone = [' ', 'username', '😊😊😊😊😊', '!@#$%^&*'];

// 1
describe('1. Contact Form Submission', () => {
	beforeEach(() => {
		viewportSetup();

		visitHomePage();
		cy.intercept('POST', '/message/').as('postMessage');
	});

	it('Positive scenario: should submit the form successfully', () => {
		cy.get('[data-testid="ContactName"]').type(personData.name);
		cy.get('[data-testid="ContactEmail"]').type(personData.email);
		cy.get('[data-testid="ContactPhone"]').type(personData.phone);
		cy.get('[data-testid="ContactSubject"]').type(personData.subject);
		cy.get('[data-testid="ContactDescription"]').type(personData.message);
		cy.get('#submitContact').click();

		cy.wait('@postMessage').its('response.statusCode').should('eql', 201);

		cy.get('.contact').within(() => {
			cy.contains(`Thanks for getting in touch ${personData.name}`).should(
				'be.visible'
			);
			cy.contains(`We'll get back to you about`).should('be.visible');
			cy.contains(personData.subject).should('be.visible');
			cy.contains('as soon as possible.').should('be.visible');
		});
		visitAdminPanelPage();
		loginAdmin();
		if (Cypress.env('mobile')) {
			cy.get('.navbar-toggler').click();
		}
		cy.get('.fa-inbox').click();
		cy.get('.messages').contains(personData.name).click();

		cy.get('[data-testid="message"]').within(() => {
			cy.contains(`From: ${personData.name}`).should('be.visible');
			cy.contains(`Phone: ${personData.phone}`).should('be.visible');
			cy.contains(`Email: ${personData.email}`).should('be.visible');
			cy.contains(personData.subject).should('be.visible');
			cy.contains(personData.message).should('be.visible');
		});
	});

	it('Negative scenario: should display error messages when entering incorrect number of characters', () => {
		cy.get('#submitContact').click();
		cy.wait('@postMessage').its('response.statusCode').should('eql', 400);
		cy.get('.alert-danger').within(() => {
			Object.values(errorMessages.contactForm).forEach((element) => {
				cy.contains(element).should('be.visible');
			});
		});

		[faker.string.numeric(10), faker.string.numeric(22)].forEach((phone) => {
			cy.get('[data-testid="ContactPhone"]').clear().type(phone);
			cy.get('#submitContact').click();
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.contactForm.phoneCount).should('be.visible');
			});
		});

		[faker.string.alpha(4), faker.string.alpha(105)].forEach((text) => {
			cy.get('[data-testid="ContactSubject"]').clear().type(text);
			cy.get('#submitContact').click();
			cy.get('.alert-danger').within(() => {
				cy.contains(errorMessages.contactForm.subjectCount).should(
					'be.visible'
				);
			});
		});

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

	it('Negative scenario: should display error messages when entering invalid characters in the fields', () => {
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

// 2
describe('2. Room Creation and Verification', () => {
	beforeEach(() => {
		viewportSetup();

		visitAdminPanelPage();
		loginAdmin();
		cy.intercept('POST', '/room/').as('postRoom');
	});

	it('Positive scenario: should create a room and verify its details', () => {
		cy.get('[data-testid="roomName"]').type(roomData.name);
		cy.get('#type').select(roomData.type);
		cy.get('#accessible').select(roomData.accessible);
		cy.get('#roomPrice').type(roomData.price);

		roomData.roomDetails.forEach((detail) => {
			cy.get('.form-check').contains(detail).click();
		});

		cy.get('#createRoom').click();
		cy.wait('@postRoom').its('response.statusCode').should('eql', 201);

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

		visitHomePage();
		cy.get('.hotel-room-info')
			.last()
			.within(() => {
				cy.contains('h3', roomData.type).should('be.visible');
				roomData.roomDetails.forEach((detail) => {
					cy.contains('li', detail).should('be.visible');
				});
			});
	});

	it('Negative scenario: should display error messages when submitting an empty form and invalid price', () => {
		cy.get('#createRoom').click();
		cy.wait('@postRoom').its('response.statusCode').should('eql', 400);
		cy.get('.alert').within(() => {
			cy.contains(errorMessages.roomForm.roomNameEmpty).should('be.visible');
			cy.contains(errorMessages.roomForm.roomPriceEmpty).should('be.visible');
		});

		cy.get('#roomPrice').type(roomData.overPrice);
		cy.get('#createRoom').click();
		cy.get('.alert').within(() => {
			cy.contains(errorMessages.roomForm.roomOverPrice).should('be.visible');
		});
	});

	it('Positive Scenario: should update room details and verify the changes', () => {
		cy.get('[data-testid="roomlisting"]').first().click();
		cy.get('button').contains('Edit').click();

		cy.get('.form-check-input').each((el) => {
			cy.wait(400);
			cy.wrap(el).uncheck();
		});

		cy.get('#roomName').clear().type(roomData.name);
		cy.get('#type').select(roomData.type);
		cy.get('#accessible').select(roomData.accessible);
		cy.get('#roomPrice').clear().type(roomData.price);

		roomData.roomDetails.forEach((detail) => {
			cy.get('.form-check').contains(detail).click();
		});

		cy.get('#description').clear().type(roomData.description);
		cy.get('#update').click();

		cy.get('.room-details').within(() => {
			cy.contains(`Room: ${roomData.name}`).should('be.visible');
			cy.contains(`Type: ${roomData.type}`).should('be.visible');
			cy.contains(`Accessible: ${roomData.accessible}`).should('be.visible');
			cy.contains('Features:').should('be.visible');
			roomData.roomDetails.forEach((detail) => {
				cy.contains(detail).should('be.visible');
			});
			cy.contains(`Room price: ${roomData.price}`).should('be.visible');
		});

		visitHomePage();
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

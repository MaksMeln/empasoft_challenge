import { faker } from '@faker-js/faker';

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

// DATA
export const personData = {
	name: faker.person.firstName(),
	email: faker.internet.email({ provider: 'maildrop.cc' }),
	phone: faker.string.numeric({ length: { min: 11, max: 21 } }),
	subject: faker.string.alpha({ length: { min: 5, max: 100 } }),
	message: faker.string.alpha({ length: { min: 20, max: 2000 } }),
};

export const roomData = {
	name: faker.number.int({ min: 10, max: 999 }),
	type: String(
		getRandomElements(['Single', 'Twin', 'Double', 'Family', 'Suite'])
	),
	accessible: String(getRandomElements(['true', 'false'])),
	price: faker.number.int({ min: 10, max: 999 }),
	roomDetails: getRandomElements(
		['WiFi', 'TV', 'Radio', 'Refreshments', 'Safe', 'Views'],
		3
	),
	description: faker.lorem.sentence(),
	overPrice: faker.number.int({ min: 1000, max: 10000 }),
};

// error messages
export const errorMessages = {
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

// invalid DATA
export const invalidName = [
	'😊😊😊😊😊',
	'1234',
	'!@#$%^&*',
	'test.',
	'.test',
	'___',
];

export const invalidEmail = [
	'   ',
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

export const invalidPhone = [' ', 'username', '😊😊😊😊😊', '!@#$%^&*'];

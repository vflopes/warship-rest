'use strict';
const Warship = require('@warshipjs/core');
const uuidv4 = require('uuid/v4');

const methodProcessor = new Warship({namespace:'test-rest'}, {port:6379, host:'127.0.0.1'});

const people = new Map();

methodProcessor.methods.createPerson.prepare().then(() => {

	methodProcessor.methods.createPerson.onAwait('message.pending', async (message) => {
		message = await message.load();
		const personId = uuidv4();
		message.payload.data.id = personId;
		people.set(
			personId,
			Object.assign(
				{id:personId},
				message.payload.data.attributes
			)
		);
		message.payload = {data:message.payload.data};
		setTimeout(async () => {
			await message.ack();
			await message.resolve();
		}, 120000);
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

}).catch((error) => console.log(error));

methodProcessor.methods.viewPerson.prepare().then(() => {

	methodProcessor.methods.viewPerson.onAwait('message.pending', async (message) => {
		message = await message.load();
		const personId = message.payload.params.personId;
		if (people.has(personId)) {
			const person = people.get(personId);
			message.payload = {data:{
				id:personId,
				type:'person',
				attributes:person
			}};
			delete message.payload.data.attributes.id;
			message.numeric_code = 200;
			setTimeout(async () => {
				await message.ack();
				await message.resolve();
			}, 3000)
			return void 0;

		}
		message.error = 'this resource does not exist';
		message.numeric_code = 404;
		message.alpha_code = 'ENOTFOUND';
		await message.ack();
		await message.reject();
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

}).catch((error) => console.log(error));
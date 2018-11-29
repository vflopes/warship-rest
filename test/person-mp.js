'use strict';
const Warship = require('@warshipjs/core');
const uuidv4 = require('uuid/v4');

const startPersonMP = async () => {

	const methodProcessor = new Warship({namespace:'test-rest'}, {port:6379, host:'127.0.0.1'});
	const people = new Map();

	await methodProcessor.methods.createPerson.prepare();

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
		await message.ack();
		await message.resolve();
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

	await methodProcessor.methods.createPersonAsync.prepare();

	methodProcessor.methods.createPersonAsync.onAwait('message.pending', async (message) => {
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
			await message.resolve(5000);
		}, 5000);
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

	await methodProcessor.methods.viewPerson.prepare();

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
			await message.ack();
			await message.resolve();
			return void 0;

		}
		message.error = 'this resource does not exist';
		message.numeric_code = 404;
		message.alpha_code = 'ENOTFOUND';
		await message.ack();
		await message.reject();
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

	await methodProcessor.methods.listPerson.prepare();

	methodProcessor.methods.listPerson.onAwait('message.pending', async (message) => {
		message = await message.load();
		message.payload = {data:Array.from(people).map(([personId, person]) => {
			const data = {
				id:personId,
				type:'person',
				attributes:Object.assign({}, person)
			};
			delete data.attributes.id;
			return data;
		})};
		message.numeric_code = 200;
		await message.ack();
		await message.resolve();
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

	await methodProcessor.methods.updatePerson.prepare();

	methodProcessor.methods.updatePerson.onAwait('message.pending', async (message) => {
		message = await message.load();
		const personId = message.payload.params.personId;
		if (people.has(personId)) {
			message.payload.data.id = personId;
			people.set(
				personId,
				Object.assign(
					people.get(personId),
					message.payload.data.attributes,
					{id:personId}
				)
			);
			message.numeric_code = 200;
			message.payload = {data:message.payload.data};
			await message.ack();
			await message.resolve();
			return void 0;

		}
		message.error = 'this resource does not exist';
		message.numeric_code = 404;
		message.alpha_code = 'ENOTFOUND';
		await message.ack();
		await message.reject();
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

	await methodProcessor.methods.deletePerson.prepare();

	methodProcessor.methods.deletePerson.onAwait('message.pending', async (message) => {
		message = await message.load();
		const personId = message.payload.params.personId;
		if (people.has(personId)) {
			const person = people.get(personId);
			people.delete(personId);
			message.payload = {data:{
				id:personId,
				type:'person',
				attributes:person
			}};
			delete message.payload.data.attributes.id;
			message.numeric_code = 200;
			await message.ack();
			await message.resolve();
			return void 0;

		}
		message.error = 'this resource does not exist';
		message.numeric_code = 404;
		message.alpha_code = 'ENOTFOUND';
		await message.ack();
		await message.reject();
	}).on('error.async', (event, error, message) => console.log(event, error, message.unique_id)).run();

	return {methodProcessor};

};

module.exports = startPersonMP;
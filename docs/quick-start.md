# Quick start

In this page we're going to create a REST API responding POST and GET methods for using [polka](https://www.npmjs.com/package/polka).

--------------------

#### 1 - Let's create a Method Processor

This MP will store and provide entities.

```javascript
const Warship = require('@warshipjs/core');
const uuidv4 = require('uuid/v4');

const startPersonMP = async () => {

	const methodProcessor = new Warship({
		namespace:'test-rest'
	}, {
		port:6379, host:'127.0.0.1'
	});
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
	}).run();

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
	}).run();

});

startPersonMP().then(() => {
	console.log('MP started');
}).catch((error) => console.log(error));

```

--------------------

#### 2 - The REST Endpoint (Payload Issuer)

```javascript
const polka = require('polka');
const Warship = require('@warshipjs/core');
const REST = require('@warshipjs/rest');

const viewPerson = {
	urlPath:'/person/:personId',
	messageMethod:'viewPerson',
	verbMethod:'GET',
	use:[
		({request}) => request.params.cacheKey = request.params.personId,
		'cacheResponder',
		'messageForwarder',
		'rejectionResponder',
		({message,response}) => {
			response.rest.status(message.numeric_code);
			response.rest.setData(message.payload.data);
			response.rest.setSelfLink(response.rest.url(true));
		},
		'cacheHandler',
		({response}) => response.rest.end()
	]
};

const createPerson = {
	urlPath:'/person',
	messageMethod:'createPerson',
	verbMethod:'POST',
	use:[
		'messageForwarder',
		'rejectionResponder',
		'dataResponder'
	]
};

const startRESTEndpoint = async () => {

	const payloadIssuer = new Warship({
		namespace:'test-rest'
	}, {
		port:6379, host:'127.0.0.1'
	});
	const rest = new REST(payloadIssuer);
	const app = polka();

	await payloadIssuer.receivers.apiReceiver.fromOut(
		'createPerson',
		'viewPerson'
	).listen();

	rest
		.register(
			'dataResponder',
			({message,response}) => {
				// response.rest is an instance of RESTResponse class
				response.rest.status(message.numeric_code || REST.STATUS_CODES.CREATED);
				response.rest.setData(message.payload.data);
				response.rest.setSelfLink(
					response.rest.url(
						true,
						(selfLink) => selfLink.pathname += '/'+message.payload.data.id
					)
				);
				response.rest.end();
			}
		)
		.attach(viewPerson)
		.attach(createPerson)
		.apply(app)
		.on('error', (error) => console.log(error));

	return new Promise((resolve, reject) => {
		app.listen(3060, (error) => {
			if (error)
				return reject(error);
			resolve({
				payloadIssuer,
				app
			});
		});
	});

};

startRESTEndpoint().then(() => {
	console.log('REST Endpoint started');
}).catch((error) => console.log(error));

```
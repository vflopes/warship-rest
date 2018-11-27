'use strict';
const polka = require('polka');
const Warship = require('@warshipjs/core');
const REST = require('../');

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

const listPerson = {
	urlPath:'/person',
	messageMethod:'listPerson',
	verbMethod:'GET',
	use:[
		'messageForwarder',
		'rejectionResponder',
		({message,response}) => {
			response.rest.status(message.numeric_code);
			response.rest.setData(message.payload.data.map((person) => {
				person.selfLink = response.rest.url(true);
				person.selfLink.pathname += '/'+person.id;
				return person;
			}));
			response.rest.setSelfLink(response.rest.url(false));
			response.rest.end();
		}
	]
};

const createPerson = {
	urlPath:'/person',
	messageMethod:'createPerson',
	verbMethod:'POST',
	use:[
		'messageForwarder',
		'rejectionResponder',
		({message,response}) => {
			response.rest.status(message.numeric_code || REST.STATUS_CODES.CREATED);
			response.rest.setData(message.payload.data);
			response.rest.setSelfLink(response.rest.url(true, (selfLink) => {
				selfLink.pathname += '/'+message.payload.data.id
				return selfLink;
			}));
			response.rest.end();
		}
	]
};

const deletePerson = {
	urlPath:'/person/:personId',
	messageMethod:'deletePerson',
	verbMethod:'DELETE',
	use:[
		'messageForwarder',
		'rejectionResponder',
		'dataResponder'
	]
};

const updatePerson = {
	urlPath:'/person/:personId',
	messageMethod:'updatePerson',
	verbMethod:'PUT',
	use:[
		'messageForwarder',
		'rejectionResponder',
		'dataResponder'
	]
};

const createPersonAsync = {
	urlPath:'/async-person',
	messageMethod:'createPersonAsync',
	verbMethod:'POST',
	use:[
		'asyncMessageForwarder',
		'asyncResponder'
	]
};

const personQueueJobs = {
	urlPath:'/async-person/queue-jobs/:trackerId',
	verbMethod:'GET',
	use:[
		'queueJobsResponder'
	]
};

const startRESTCRUD = async () => {

	const payloadIssuer = new Warship({namespace:'test-rest'}, {port:6379, host:'127.0.0.1'});
	const rest = new REST(payloadIssuer);
	const app = polka();

	await payloadIssuer.receivers.apiReceiver.fromOut(
		'createPerson',
		'updatePerson',
		'deletePerson',
		'viewPerson',
		'listPerson'
	).listen();

	rest
		.attach(viewPerson)
		.attach(listPerson)
		.attach(createPerson)
		.attach(updatePerson)
		.attach(deletePerson)
		.attach(createPersonAsync)
		.attach(personQueueJobs)
		.apply(app)
		.register(
			'dataResponder',
			({message,response}) => {
				response.rest.status(message.numeric_code || REST.STATUS_CODES.CREATED);
				response.rest.setData(message.payload.data);
				response.rest.setSelfLink(response.rest.url(true, (selfLink) => {
					selfLink.pathname += '/'+message.payload.data.id
					return selfLink;
				}));
				response.rest.end();
			}
		)
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

module.exports = startRESTCRUD;
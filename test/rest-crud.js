'use strict';
const polka = require('polka');
const Warship = require('@warshipjs/core');
const REST = require('../');

const payloadIssuer = new Warship({namespace:'test-rest'}, {port:6379, host:'127.0.0.1'});

payloadIssuer.receivers.apiReceiver.fromOut(
	'createPerson',
	'updatePerson',
	'deletePerson',
	'viewPerson',
	'listPerson'
).listen().then(() => console.log('Listening for messages')).catch((error) => console.log(error));

const rest = new REST(payloadIssuer);

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
		'asyncMessageForwarder',
		'asyncResponder'
		/*({message,response}) => {
			response.rest.status(message.numeric_code || REST.STATUS_CODES.CREATED);
			response.rest.setData(message.payload.data);
			response.rest.setSelfLink(response.rest.url(true, (selfLink) => {
				selfLink.pathname += '/'+message.payload.data.id
				return selfLink;
			}));
			response.rest.end();
		}*/
	]
};

const personQueueJobs = {
	urlPath:'/person/queue-jobs/:trackerId',
	verbMethod:'GET',
	use:[
		'queueJobsResponder'
	]
};

const app = polka();

rest
	.attach(viewPerson)
	.attach(createPerson)
	.attach(personQueueJobs)
	.apply(app)
	.on('error', (error) => console.log(error));

app.listen(3060, (error) => {
	if (error)
		throw error;
	console.log(`> Running on localhost:3060`);
});

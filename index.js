'use strict';
const MethodAggregator = require('./lib/method-aggregator.js');
const polka = require('polka');
const shortid = require('shortid');
const aggregator = new MethodAggregator();
const {shortKeys} = require('@warshipjs/core');

aggregator.method('POST').verb('/healthz').step('provide-health-information').out(({request,response}) => {
	response.rest
		.status(200)
		.setMeta({date:Date.now()});
	try {
	response.rest.setSelfLink(response.rest.url(false));

	const myUrl = response.rest.url();

	myUrl.pathname = '/healthz/author';

	const author = response.rest.setData({
		type:'person',
		attributes:{
			value:123
		}
	}).setSelfLink(response.rest.url(false)).addRelationship({
		name:'author'
	});

	author.setSelfLink(myUrl).addData({id:555,type:'person'}).addData({id:533,type:'person'});

	response.rest.end();
	} catch (error) {
		console.log(error);
	}
});

const app = polka();

aggregator.apply(app);

app.listen(3000, err => {
    if (err) throw err;
    console.log(`> Running on localhost:3000`);
  });

class WarshipREST extends MethodAggregator {

	constructor (payloadIssuer, options = {}) {

		super(Object.assign({
			asyncPath:'queue',
			asyncType:'queue'
		}, options));

		this._payloadIssuer = payloadIssuer
		this._payloadIssuer.on('out.resolved', (message) => this.emit(`out:${message.tracker_id}`, message));
		this._payloadIssuer.on('out.rejected', (message) => this.emit(`out:${message.tracker_id}`, message));

	}

	attachIn ({urlPath,messageMethod,verbMethod}) {

		const step = this.method(verbMethod).verb(urlPath).step(messageMethod);

		step.in(async ({request}) => {
			const message = this._payloadIssuer.message[messageMethod](request.body);
			message.tracker_id = shortid.generate();
			return new Promise((resolve, reject) => {
				message.forward().then(() => {
					this.once(`out:${message.tracker_id}`, (message) => resolve({message}));
				}).catch((error) => {
					error.id = message.tracker_id;
					reject(error);
				});
			});
		});

		return this;

	}

	attachOutAsync ({urlPath,asyncPath,messageMethod,verbMethod}) {

		const step = this.method(verbMethod).verb(urlPath).step(messageMethod);

		asyncPath = asyncPath || urlPath;
		asyncPath = asyncPath+'/'+this._options.asyncPath+'/'+message.tracker_id;

		if (this.method('GET').verbs.has())

		step.out(({response,message}) => {

			response.rest.status(STATUS_CODES.ACCEPTED);
			response.rest.setData({
				id:message.tracker_id,
				type:this._options.queue
			});

			const selfLink = response.rest.url();
			selfLink.pathname += '/'+this._options.asyncPath+'/'+message.tracker_id;
			response.rest.setSelfLink(selfLink);
			response.rest.end();

		});

		return this;

	}

	attachOut ({urlPath,messageMethod,verbMethod}) {

		const step = this.method(verbMethod).verb(urlPath).step(messageMethod);

		step.out(({response,message}) => {
			switch (message.state) {
				case shortKeys.encoding.rejected;
					const status = message.numeric_code || STATUS_CODES.BAD_REQUEST;
					response.rest.status(status);
					response.addError({
						id:message.unique_id,
						status,
						title:status in STATUS_CODES_MESSAGES ? STATUS_CODES_MESSAGES[status].toLowerCase() : null,
						code:message.alpha_code,
						detail:message.error,
						meta:{
							retries:message.retries
						}
					});
					response.end();
				break;
				default:
					response.rest.status(STATUS_CODES.INTERNAL_SERVER_ERROR);
					response.addError({
						id:message.tracker_id,
						status:STATUS_CODES.INTERNAL_SERVER_ERROR,
						title:STATUS_CODES_MESSAGES[STATUS_CODES.INTERNAL_SERVER_ERROR]
					});
					response.end();
				break;
			}
		});

		return this;

	}

}
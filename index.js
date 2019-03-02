'use strict';
const MethodAggregator = require('./lib/method-aggregator.js');
const {STATUS_CODES, STATUS_CODES_MESSAGES, DEFAULT_CACHE_TTL} = require('./lib/constants.js');
const {shortKeys} = require('@warshipjs/core');
const crypto = require('crypto');

class REST extends MethodAggregator {

	constructor (payloadIssuer, options = {}) {

		if (!options.redisClient)
			options.redisClient = payloadIssuer.redis.clients.rest;

		super(Object.assign({
			asyncPath:'queue-jobs',
			asyncType:'queue-jobs',
			receiver:'apiReceiver',
			cachePrefix:'resource:cache',
			redisClient:null
		}, options));

		this._middlewares = new Map();
		this._payloadIssuer = payloadIssuer;

	}

	attach (routeOptions = {}) {

		for (let middleware of routeOptions.use) {
			if (typeof middleware === 'string') {
				if (this._middlewares.has(middleware)) {
					this.method(routeOptions.verbMethod).verb(routeOptions.urlPath).step(
						this._middlewares.get(middleware)
					);
					continue;
				}
				middleware = 'attach'+middleware.charAt(0).toUpperCase()+middleware.substring(1);
				if (!Reflect.has(this, middleware))
					throw new Error(`Unknown pre-built middleware: "${middleware}"`);
				this[middleware](routeOptions);
				continue;
			}
			this.method(routeOptions.verbMethod).verb(routeOptions.urlPath).step(middleware);
		}

		return this;

	}

	register (name, middleware) {
		this._middlewares.set(name, middleware);
		return this;
	}

	_getCacheKey ({verbMethod, response, request}) {

		let cacheKey = request.params.cacheKey || null;

		if (cacheKey === null)
			cacheKey = crypto
				.createHash('sha1')
				.update(verbMethod)
				.update(response.rest.url(false).pathname)
				.digest('hex');

		return this._options.cachePrefix+':'+cacheKey;

	}

	attachCacheResponder ({urlPath, verbMethod, cacheTtl}) {

		cacheTtl = cacheTtl || DEFAULT_CACHE_TTL;

		const verb = this.method(verbMethod).verb(urlPath);

		verb.step(async ({request, response}) => {

			const cacheKey = this._getCacheKey({verbMethod, response, request});
			const cache = await this._options.redisClient.hgetall(cacheKey);

			request.params.cacheKey = cacheKey;

			if (Object.keys(cache).length === 0)
				return void 0;

			await this._options.redisClient.pexpire(cacheKey, cacheTtl);

			response.rest.status(Number(cache.status));
			response.rest.end(JSON.parse(cache.value));

		});

		return this;

	}

	attachCacheHandler ({urlPath, verbMethod, cacheTtl}) {

		cacheTtl = cacheTtl || DEFAULT_CACHE_TTL;

		const verb = this.method(verbMethod).verb(urlPath);

		verb.step(async ({request, response}) => {

			if (!request.params.cacheKey)
				return void 0;

			await this._options.redisClient.hmset(
				request.params.cacheKey,
				'status', response.statusCode,
				'value', JSON.stringify(response.rest.toREST())
			);

			await this._options.redisClient.pexpire(
				request.params.cacheKey,
				cacheTtl
			);

		});

		return this;

	}

	attachAsyncMessageForwarder (middlewareOptions) {
		middlewareOptions.isAsync = true;
		return this.attachMessageForwarder(middlewareOptions);
	}

	attachMessageForwarder ({urlPath, messageMethod, verbMethod, isAsync, addQuery, addParams, addHeaders, outMethod}) {

		if (!addQuery && addQuery !== false)
			addQuery = true;
		if (!addParams && addParams !== false)
			addParams = true;
		if (!addHeaders && addHeaders !== false)
			addHeaders = true;
		if (!outMethod && outMethod !== null)
			outMethod = null;

		const verb = this.method(verbMethod).verb(urlPath);

		verb.step(async ({request}) => {
			const message = this._payloadIssuer.message[messageMethod](Object.assign(
				{},
				request.body,
				{
					query:(addQuery ? request.query : {}),
					params:(addParams ? request.params : {}),
					headers:(addHeaders ? request.headers : {})
				}
			));

			message.generateTrackerId();

			try {

				if (isAsync) {
					await message.forward();
					return {message};
				}

				return {
					message:await message.commit(
						this._payloadIssuer.receivers[this._options.receiver]
					)
				};
			} catch (error) {
				if (error.tracker_id === message.tracker_id)
					return {message:error};
				error.id = message.tracker_id;
				throw error;
			}
		});

		return this;

	}

	attachAsyncResponder ({urlPath, verbMethod}) {

		const verb = this.method(verbMethod).verb(urlPath);

		verb.step(({response, message}) => {

			response.rest.status(STATUS_CODES.ACCEPTED);
			response.rest.setData({
				id:message.tracker_id,
				type:this._options.asyncType
			});

			const selfLink = response.rest.url();
			selfLink.pathname += '/'+this._options.asyncPath+'/'+message.tracker_id;
			response.rest.setSelfLink(selfLink);
			response.rest.end();

		});

		return this;

	}

	attachQueueJobsResponder ({urlPath, verbMethod, continueOnNotFound}) {

		const verb = this.method(verbMethod).verb(urlPath);

		verb.step(async ({request, response}) => {

			const message = this._payloadIssuer.message.queueJobs();
			message.tracker_id = request.params.trackerId;
			await message.load(
				'method',
				'state',
				'creation_timestamp',
				'update_timestamp',
				'retries'
			);

			if (!message.message_id) {
				if (continueOnNotFound)
					return {message};
				response.rest.status(STATUS_CODES.NOT_FOUND);
				response.rest.addError({
					id:message.tracker_id,
					status:STATUS_CODES.NOT_FOUND,
					code:'NOT_FOUND',
					title:STATUS_CODES_MESSAGES[STATUS_CODES.NOT_FOUND].toLowerCase()
				});
				response.rest.end();
				return void 0;
			}

			response.rest.status(STATUS_CODES.OK);
			response.rest.setData({
				id:message.unique_id,
				type:this._options.asyncType,
				attributes:{
					method:message.method,
					trackerId:message.tracker_id,
					messageId:message.message_id,
					state:shortKeys.decoding[message.state],
					createdAt:new Date(message.creation_timestamp).toISOString(),
					updatedAt:message.update_timestamp ? new Date(message.update_timestamp).toISOString() : null,
					retries:message.retries
				}
			});
			response.rest.setSelfLink(response.rest.url());
			response.rest.end();

		});

		return this;

	}

	attachRejectionResponder ({urlPath, verbMethod}) {

		const verb = this.method(verbMethod).verb(urlPath);

		verb.step(({response, message}) => {
			switch (message.state) {
			case shortKeys.encoding.rejected: {
				const status = (message.numeric_code || STATUS_CODES.BAD_REQUEST);
				response.rest.status(status);
				response.rest.addError({
					id:message.unique_id,
					status,
					title:status in STATUS_CODES_MESSAGES ? STATUS_CODES_MESSAGES[status].toLowerCase() : null,
					code:message.alpha_code,
					detail:message.error,
					meta:{
						retries:message.retries
					}
				});
				response.rest.end();
				break;
			}
			case shortKeys.encoding.resolved:
				break;
			default:
				response.rest.status(STATUS_CODES.INTERNAL_SERVER_ERROR);
				response.rest.addError({
					id:message.tracker_id,
					status:STATUS_CODES.INTERNAL_SERVER_ERROR,
					title:STATUS_CODES_MESSAGES[STATUS_CODES.INTERNAL_SERVER_ERROR].toLowerCase()
				});
				response.rest.end();
				break;
			}
		});

		return this;

	}

}

REST.STATUS_CODES = STATUS_CODES;
REST.STATUS_CODES_MESSAGES = STATUS_CODES_MESSAGES;
REST.MethodAggregator = MethodAggregator;

module.exports = REST;
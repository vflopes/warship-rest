'use strict';
const {STATUS_CODES, STATUS_CODES_MESSAGES} = require('./constants.js');
const CollectionVerb = require('./collection-verb.js');
const RESTResponse = require('./rest-response.js');
const qs = require('qs');
const url = require('url');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const yaml = require('js-yaml');
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events');

class MethodAggregator extends EventEmitter {

	constructor (options = {}) {

		super();

		this._methods = new Map();
		this._options = options;

	}

	_buildVerb (method, name) {

		const verb = new CollectionVerb();

		if (method !== 'OPTIONS' && !this.method('OPTIONS').verbs.has(name))
			this
				.method('OPTIONS')
				.verb(name)
				.step(() => {
					return {
						allowedMethods:this.listMethodsByVerbName(name)
					};
				})
				.step(({allowedMethods, response}) => {
					response.rest.status(STATUS_CODES.OK);
					response.setHeader('Allow', allowedMethods.join(', '));
					response.end();
				});

		return verb;

	}

	method (method) {

		method = method.toUpperCase();

		if (!this._methods.has(method)) {
			const verbs = new Map();
			this._methods.set(
				method,
				{
					verbs,
					verb:(name) => {

						if (!verbs.has(name))
							verbs.set(
								name,
								this._buildVerb(method, name)
							);

						return verbs.get(name);

					},
					method:(...args) => this.method(...args)
				}
			);
		}

		return this._methods.get(method);

	}

	listMethodsByVerbName (name) {

		return Array.from(this._methods.keys()).filter(
			(method) => this.method(method).verbs.has(name)
		);

	}

	apply (app) {

		app.use((request, response, next) => {

			response.rest = new RESTResponse(request, response, this._options);

			if (!request.headers.accept) {
				request.headers.accept = 'application/json';
				return next();
			}

			request.headers.accept = request.headers.accept.trim().toLowerCase().split(/[,\s]+/ig).filter((accept) => {
				return [
					'application/xml',
					'text/xml',
					'text/yaml',
					'application/yaml',
					'text/json',
					'application/json',
					'application/vnd.api+json',
					'*/*'
				].includes(accept);
			});

			if (request.headers.accept.length === 0) {
				response.rest.status(STATUS_CODES.NOT_ACCEPTABLE);
				response.end();
				return void 0;
			}

			request.headers.accept = request.headers.accept.shift();

			next();

		})
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({extended:true}))
		.use(bodyParser.text({
			type:['application/xml', 'text/xml'],
			verify:(request) => {
				request.isXML = true;
			}
		}))
		.use(bodyParser.text({
			type:['application/yaml', 'text/yaml'],
			verify:(request) => {
				request.isYAML = true;
			}
		}))
		.use((request, response, next) => {

			request.parsedUrl = url.parse(request.url);
			request.query = qs.parse(
				request.parsedUrl.query,
				{
					ignoreQueryPrefix:true,
					allowDots:true
				}
			);

			switch (request.headers.accept) {
			case 'text/yaml':
			case 'application/yaml':
				response.setHeader('Content-Type', 'application/yaml');
				break;
			case '*/*':
			case 'application/json':
			case 'text/json':
			case 'application/vnd.api+json':
				response.setHeader('Content-Type', 'application/json');
				break;
			case 'application/xml':
			case 'text/xml':
				response.setHeader('Content-Type', 'application/xml');
				break;
			}

			if (request.isXML) {
				xml2js.parseString(request.body, {explicitArray:false}, (error, result) => {
					if (error || !Reflect.has(result, 'request')) {
						response.rest.status(STATUS_CODES.BAD_REQUEST);
						response.end(error.message || 'Invalid XML request');
						return void 0;
					}
					request.body = result.request;
					next();
				});
				return void 0;
			}
			else if (request.isYAML) {
				try {
					request.body = yaml.safeLoad(request.body);
				} catch (error) {
					response.rest.status(STATUS_CODES.BAD_REQUEST);
					response.end(error.message);
					return void 0;
				}
			}

			next();

		});

		for (const [method, {verbs}] of this._methods) {

			for (const [name, verb] of verbs) {

				app[method.toLowerCase()](
					name,
					async (request, response) => {

						try {
							await verb.execute(request, response);
						} catch (error) {
							error.id = error.id || uuidv4();
							response.rest
								.reset()
								.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
								.addError({
									id:error.id,
									title:STATUS_CODES_MESSAGES[STATUS_CODES.INTERNAL_SERVER_ERROR].toLowerCase()
								});
							response.rest.end();
							this.emit('error', error);
						}

					}
				);

			}

		}

		return this;

	}

}

MethodAggregator.RESTResponse = RESTResponse;

module.exports = MethodAggregator;
'use strict';
const {STATUS_CODES_MESSAGES} = require('./constants.js');
const RESTResourceObject = require('./rest-resource-object.js');
const RESTError = require('./rest-error.js');
const RESTLink = require('./rest-link.js');
const js2xmlparser = require('js2xmlparser');
const yaml = require('js-yaml');
const {URL} = require('url');

class RESTResponse {

	constructor (request = null, response = null, options = {}) {

		this._request = request;
		this._response = response;
		this._options = Object.assign({
			protocol:'http://',
			jsonApiVersion:'1.0'
		}, options);
		this.reset();

	}

	reset () {

		this._links = null;
		this._result = {
			jsonapi:{
				version:this._options.jsonApiVersion
			}
		};
		return this;

	}

	setRequest (request) {
		this._request = request;
		return this;
	}

	get request () {
		return this._request;
	}

	setResponse (response) {
		this._response = response;
		return this;
	}

	get response () {
		return this._response;
	}

	get errors () {
		return this._result.errors;
	}

	get data () {
		return this._result.data;
	}

	get meta () {
		return this._result.meta;
	}

	get included () {
		return this._result.included;
	}

	get links () {
		return this._links;
	}

	url (reset = true, transformFunction = null) {

		const requestUrl = new URL(this._options.protocol+this._request.headers.host+this._request.url);

		if (reset) {
			requestUrl.hash = '';
			requestUrl.search = '';
		}

		requestUrl.pathname = requestUrl.pathname.replace(/[/?#]+$/ig, '');

		if (transformFunction)
			transformFunction(requestUrl);

		return requestUrl;

	}

	status (statusCode, statusMessage = null) {
		this._response.statusCode = statusCode;
		this._response.statusMessage = statusMessage || STATUS_CODES_MESSAGES[statusCode];
		return this;
	}

	fromObject ({
		meta,
		data,
		included,
		selfLink,
		relatedLink,
		firstLink,
		prevLink,
		nextLink,
		lastLink,
		errors
	} = {}) {

		if (meta)
			this._result.meta = meta;
		if (data) {
			if (Array.isArray(data))
				data.forEach((dataItem) => this.addData(dataItem));
			else
				this.setData(data);
		}
		if (included)
			included.forEach((includedItem) => this.addIncluded(includedItem));
		if (selfLink)
			this.setSelfLink(selfLink);
		if (relatedLink)
			this.setRelatedLink(relatedLink);
		if (firstLink)
			this.setFirstLink(firstLink);
		if (prevLink)
			this.setPrevLink(prevLink);
		if (nextLink)
			this.setNextLink(nextLink);
		if (lastLink)
			this.setLastLink(lastLink);
		if (errors)
			errors.forEach((error) => this.addError(error));

		return this;

	}

	setMeta (meta) {

		this._result.meta = meta;
		return this;

	}

	setData (representation) {

		if (Array.isArray(representation)) {
			this._result.data = representation.map((item) => new RESTResourceObject(item));
			return this;
		}

		this._result.data = new RESTResourceObject(representation);
		return this._result.data;

	}

	addData (representation) {

		if (!Reflect.has(this._result, 'data'))
			this._result.data = [];

		const resourceObject = new RESTResourceObject(representation);

		this._result.data.push(resourceObject);
		return resourceObject;

	}

	setIncluded (representations) {

		for (const representation of representations)
			this.addIncluded(representation);
		return this;

	}

	addIncluded (representation) {

		if (!Reflect.has(this._result, 'included'))
			this._result.included = [];

		const resourceObject = new RESTResourceObject(representation);

		this._result.included.push(resourceObject);
		return resourceObject;

	}

	setSelfLink (representation) {

		if (this._links === null)
			this._links = {};

		this._links.self = new RESTLink(representation);
		return this;

	}

	setRelatedLink (representation) {

		if (this._links === null)
			this._links = {};

		this._links.related = new RESTLink(representation);
		return this;

	}

	setFirstLink (representation) {

		if (this._links === null)
			this._links = {};

		this._links.first = new RESTLink(representation);
		return this;

	}

	setPrevLink (representation) {

		if (this._links === null)
			this._links = {};

		this._links.prev = new RESTLink(representation);
		return this;

	}

	setNextLink (representation) {

		if (this._links === null)
			this._links = {};

		this._links.next = new RESTLink(representation);
		return this;

	}

	setLastLink (representation) {

		if (this._links === null)
			this._links = {};

		this._links.last = new RESTLink(representation);
		return this;

	}

	addError (representation) {

		if (!Reflect.has(this._result, 'errors'))
			this._result.errors = [];

		const error = new RESTError(representation);

		this._result.errors.push(error);
		return error;

	}

	toREST () {

		const result = {
			jsonapi:this._result.jsonapi
		};

		if (Reflect.has(this._result, 'meta'))
			result.meta = this._result.meta;

		if (Reflect.has(this._result, 'errors'))
			result.errors = this._result.errors.map((error) => error.toREST());

		if (Reflect.has(this._result, 'included'))
			result.included = this._result.included.map((resourceObject) => resourceObject.toREST());

		if (Reflect.has(this._result, 'data')) {
			if (Array.isArray(this._result.data))
				result.data = this._result.data.map((resourceObject) => resourceObject.toREST());
			else
				result.data = this._result.data.toREST();
		}

		if (this._links !== null) {
			result.links = {};
			for (const linkKey in this._links)
				result.links[linkKey] = this._links[linkKey].toREST();
		}

		return result;

	}

	end (data = null) {

		data = data || this.toREST();

		const contentType = this._response.getHeader('Content-Type');

		switch (contentType) {
		case 'application/xml':
			this._response.end(js2xmlparser.parse('response', data, {format:{pretty:false}}));
			break;
		case 'application/json':
			this._response.end(JSON.stringify(data));
			break;
		case 'application/yaml':
			this._response.end(yaml.safeDump(data, {skipInvalid:true, condenseFlow:true, noRefs:false}));
			break;
		default:
			throw new Error(`Unknown response Content-Type: ${contentType}`);
		}

		return this;

	}

}

RESTResponse.RESTResourceObject = RESTResourceObject;
RESTResponse.RESTError = RESTError;
RESTResponse.RESTLink = RESTLink;

module.exports = RESTResponse;
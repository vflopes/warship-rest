'use strict';
const uuidv4 = require('uuid/v4');
const RESTLink = require('./rest-link.js');
const {STATUS_CODES} = require('./constants.js');

class RESTError extends Error {

	constructor (object = {}) {

		super(object.message || object.detail);
		this.fromObject(object);

	}

	fromObject ({
		message,
		id,
		status,
		code,
		title,
		detail,
		meta,
		aboutLink,
		typeLink
	} = {}) {

		this._links = null;
		this._result = {
			id:id || uuidv4(),
			status:String(status || STATUS_CODES.INTERNAL_SERVER_ERROR)
		};

		if (code)
			this._result.code = code;
		if (title)
			this._result.title = title;
		if (message || detail)
			this._result.detail = message || detail;
		if (meta)
			this._result.meta = meta;
		if (aboutLink)
			this.setAboutLink(aboutLink);
		if (typeLink)
			this.setTypeLink(typeLink);

		return this;

	}

	get id () {
		return this._result.id;
	}

	get links () {
		return this._links;
	}

	get status () {
		return this._result.status;
	}

	get code () {
		return this._result.code;
	}

	get title () {
		return this._result.title;
	}

	get detail () {
		return this._result.detail;
	}

	get meta () {
		return this._result.meta;
	}

	setAboutLink (representation) {

		if (this._links === null)
			this._links = {};

		this._links.about = new RESTLink(representation);
		return this;

	}

	addTypeLink (representation) {

		if (this._links === null)
			this._links = {};

		if (!Reflect.has(this._links, 'type'))
			this._links.type = [];

		this._links.type.push(new RESTLink(representation));
		return this;

	}

	toREST () {

		const result = Object.assign({}, this._result);

		if (this._links !== null) {
			result.links = {};
			for (const linkKey in this._links)
				result.links[linkKey] = this._links[linkKey].toREST();
		}

		return result;

	}

}

module.exports = RESTError;
'use strict';
const {URL} = require('url');

class RESTLink {

	constructor (representation) {

		if (typeof representation === 'string')
			this._link = representation;
		else if (representation instanceof URL)
			this._link = representation.toString();
		else
			this._link = {
				href:representation.href,
				meta:representation.meta
			};

	}

	toREST () {
		return this._link;
	}

}

module.exports = RESTLink;
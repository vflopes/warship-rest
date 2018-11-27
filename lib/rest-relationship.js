'use strict';
const RESTLink = require('./rest-link.js');

class RESTRelationship {

	constructor (object = {}) {

		this.fromObject(object);

	}

	fromObject ({
		meta,
		data,
		selfLink,
		relatedLink
	} = {}) {

		this._links = null;
		this._result = {};

		if (meta)
			this._result.meta = meta;
		if (data) {
			if (Array.isArray(data))
				data.forEach((dataItem) => this.addData(dataItem));
			else
				this.setData(data);
		}
		if (selfLink)
			this.setSelfLink(selfLink);
		if (relatedLink)
			this.setRelatedLink(relatedLink);

		return this;

	}

	get links () {
		return this._links;
	}

	get meta () {
		return this._result.meta;
	}

	get data () {
		return this._result.data;
	}

	setData (representation) {

		if (Array.isArray(representation)) {
			for (const item of representation)
				this.addData(item);
			return this;
		}

		this._result.data = {
			id:representation.id,
			type:representation.type
		};
		return this;

	}

	addData ({id, type}) {

		if (!Reflect.has(this._result, 'data'))
			this._result.data = [];

		this._result.data.push({id, type});
		return this;

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

module.exports = RESTRelationship;
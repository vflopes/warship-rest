'use strict';
const uuidv4 = require('uuid/v4');
const RESTLink = require('./rest-link.js');
const RESTRelationship = require('./rest-relationship.js');

class RESTResourceObject {

	constructor (object = {}) {

		this.fromObject(object);

	}

	fromObject ({
		id,
		type,
		attributes,
		meta,
		relationships,
		selfLink,
		relatedLink
	} = {}) {

		this._links = null;
		this._relationships = null;
		this._result = {
			id:id || uuidv4(),
			type
		};

		if (attributes)
			this._result.attributes = attributes;
		if (meta)
			this._result.meta = meta;
		if (relationships)
			relationships.forEach((relationship) => this.addRelationship(relationship));
		if (selfLink)
			this.setSelfLink(selfLink);
		if (relatedLink)
			this.setRelatedLink(relatedLink);

		return this;

	}

	get id () {
		return this._result.id;
	}

	get type () {
		return this._result.type;
	}

	get attributes () {
		return this._result.attributes;
	}

	get links () {
		return this._links;
	}

	get relationships () {
		return this._relationships;
	}

	get meta () {
		return this._result.meta;
	}

	setRelationships (representations) {

		for (const representation of representations)
			this.addRelationship(representation);
		return this;

	}

	addRelationship (representation) {

		if (this._relationships === null)
			this._relationships = {};

		this._relationships[representation.name] = new RESTRelationship(representation);
		return this._relationships[representation.name];

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

		if (this._relationships !== null) {
			result.relationships = {};
			for (const relationshipKey in this._relationships)
				result.relationships[relationshipKey] = this._relationships[relationshipKey].toREST();
		}

		return result;

	}

}

RESTResourceObject.RESTRelationship = RESTRelationship;

module.exports = RESTResourceObject;
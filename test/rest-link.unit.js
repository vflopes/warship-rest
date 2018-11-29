'use strict';
const {expect} = require('chai');
const {URL} = require('url');
const RESTLink = require('../lib/rest-link.js');

describe('RESTLink class', function () {

	it('constructor(URL)', function () {

		const restLink = new RESTLink(new URL('http://localhost/person'));
		expect(restLink.toREST()).to.be.equal('http://localhost/person');

	});

	it('constructor(String)', function () {

		const restLink = new RESTLink('http://localhost/person');
		expect(restLink.toREST()).to.be.equal('http://localhost/person');

	});

	it('constructor(Object)', function () {

		const restLink = new RESTLink({
			href:'http://localhost/person',
			meta:{a:'bc'}
		});
		const restObject = restLink.toREST();
		expect(restObject.href).to.be.equal('http://localhost/person');
		expect(restObject.meta.a).to.be.equal('bc');

	});

});
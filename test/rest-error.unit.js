'use strict';
const {expect} = require('chai');
const RESTLink = require('../lib/rest-link.js');
const RESTError = require('../lib/rest-error.js');

describe('RESTError class', function () {

	it('constructor()', function () {

		const restError = new RESTError({
			message:'abc',
			id:'qwe',
			status:404,
			code:'ENOTFOUND',
			title:'tyu',
			meta:{a:'bc'},
			aboutLink:'http://localhost/about',
			typeLink:['http://localhost/type']
		});
		expect(restError.id).to.be.equal('qwe');
		expect(restError.status).to.be.equal('404');
		expect(restError.code).to.be.equal('ENOTFOUND');
		expect(restError.title).to.be.equal('tyu');
		expect(restError.detail).to.be.equal(restError.message);
		expect(restError.message).to.be.equal('abc');
		expect(restError.meta.a).to.be.equal('bc');
		expect(restError.links.about.toREST()).to.be.equal('http://localhost/about');
		expect(restError.links.type[0].toREST()).to.be.equal('http://localhost/type');

	});

	it('fromObject()', function () {

		const restError = new RESTError();
		restError.fromObject({
			message:'abc',
			id:'qwe',
			status:404,
			code:'ENOTFOUND',
			title:'tyu',
			meta:{a:'bc'},
			aboutLink:'http://localhost/about',
			typeLink:['http://localhost/type']
		});
		expect(restError.id).to.be.equal('qwe');
		expect(restError.status).to.be.equal('404');
		expect(restError.code).to.be.equal('ENOTFOUND');
		expect(restError.title).to.be.equal('tyu');
		expect(restError.detail).to.be.equal(restError.message);
		expect(restError.message).to.be.equal('abc');
		expect(restError.meta.a).to.be.equal('bc');
		expect(restError.links.about.toREST()).to.be.equal('http://localhost/about');
		expect(restError.links.type[0].toREST()).to.be.equal('http://localhost/type');

	});

	it('setAboutLink()', function () {

		const restError = new RESTError();
		restError.setAboutLink('http://localhost');
		expect(restError.links.about).to.be.instanceOf(RESTLink);
		expect(restError.links.about.toREST()).to.be.equal('http://localhost');

	});

	it('addTypeLink()', function () {

		const restError = new RESTError();
		restError.addTypeLink('http://localhost');
		expect(restError.links.type).to.be.an('array');
		expect(restError.links.type[0]).to.be.instanceOf(RESTLink);
		expect(restError.links.type[0].toREST()).to.be.equal('http://localhost');

	});

	it('toREST()', function () {

		const restError = new RESTError();
		restError.fromObject({
			message:'abc',
			id:'qwe',
			status:404,
			code:'ENOTFOUND',
			title:'tyu',
			meta:{a:'bc'},
			aboutLink:'http://localhost/about',
			typeLink:['http://localhost/type']
		});
		const restObject = restError.toREST();
		expect(restObject.links.about).to.be.equal('http://localhost/about');
		expect(restObject.links.type[0]).to.be.equal('http://localhost/type');
		expect(restObject.detail).to.be.equal('abc');
		expect(restObject.id).to.be.equal('qwe');
		expect(restObject.status).to.be.equal('404');
		expect(restObject.code).to.be.equal('ENOTFOUND');
		expect(restObject.title).to.be.equal('tyu');
		expect(restObject.meta.a).to.be.equal('bc');

	});


});
'use strict';
const {expect} = require('chai');
const {URL} = require('url');
const RESTResponse = require('../lib/rest-response.js');
const RESTResourceObject = require('../lib/rest-resource-object.js');
const RESTLink = require('../lib/rest-link.js');
const RESTError = require('../lib/rest-error.js');

describe('RESTResponse class', function () {

	it('setRequest()', function () {

		const restResponse = new RESTResponse();
		const request = {};
		expect(restResponse.setRequest(request)).to.be.equal(restResponse);
		expect(restResponse.request).to.be.equal(request);

	});

	it('setResponse()', function () {

		const restResponse = new RESTResponse();
		const response = {};
		expect(restResponse.setResponse(response)).to.be.equal(restResponse);
		expect(restResponse.response).to.be.equal(response);

	});

	it('url()', function () {

		const restResponse = new RESTResponse();
		const request = {
			headers:{
				host:'localhost'
			},
			url:'/person/?q=term#hash'
		};
		restResponse.setRequest(request);
		let url = restResponse.url();
		expect(url).to.be.instanceOf(URL);
		expect(url.hash).to.be.equal('');
		expect(url.search).to.be.equal('');
		expect(url.pathname).to.be.equal('/person');
		url = restResponse.url(false);
		expect(url).to.be.instanceOf(URL);
		expect(url.hash).to.be.equal('#hash');
		expect(url.search).to.be.equal('?q=term');
		expect(url.pathname).to.be.equal('/person');
		url = restResponse.url(false, (url) => url.pathname += '/relationships');
		expect(url.pathname).to.be.equal('/person/relationships');

	});

	it('status()', function () {

		const restResponse = new RESTResponse();
		restResponse.setResponse({});
		restResponse.status(200);
		expect(restResponse.response.statusCode).to.be.equal(200);
		expect(restResponse.response.statusMessage).to.be.equal('OK');

	});

	it('setMeta()', function () {

		const restResponse = new RESTResponse();
		const meta = {};
		restResponse.setMeta(meta);
		expect(restResponse.meta).to.be.equal(meta);

	});

	it('setData()', function () {

		const restResponse = new RESTResponse();
		restResponse.setData({
			id:'abc',
			type:'qwe'
		});
		expect(restResponse.data).to.be.instanceOf(RESTResourceObject);
		expect(restResponse.data.id).to.be.equal('abc');
		expect(restResponse.data.type).to.be.equal('qwe');
		restResponse.setData([{
			id:'abc',
			type:'qwe'
		}]);
		expect(restResponse.data).to.be.an('array');
		expect(restResponse.data[0]).to.be.instanceOf(RESTResourceObject);
		expect(restResponse.data[0].id).to.be.equal('abc');
		expect(restResponse.data[0].type).to.be.equal('qwe');

	});

	it('addData()', function () {

		const restResponse = new RESTResponse();
		restResponse.addData({
			id:'abc',
			type:'qwe'
		});
		expect(restResponse.data).to.be.an('array');
		expect(restResponse.data[0]).to.be.instanceOf(RESTResourceObject);
		expect(restResponse.data[0].id).to.be.equal('abc');
		expect(restResponse.data[0].type).to.be.equal('qwe');

	});

	it('setIncluded()', function () {

		const restResponse = new RESTResponse();
		restResponse.setIncluded([{
			id:'abc',
			type:'qwe'
		}]);
		expect(restResponse.included).to.be.an('array');
		expect(restResponse.included[0]).to.be.instanceOf(RESTResourceObject);
		expect(restResponse.included[0].id).to.be.equal('abc');
		expect(restResponse.included[0].type).to.be.equal('qwe');

	});

	it('addIncluded()', function () {

		const restResponse = new RESTResponse();
		restResponse.addIncluded({
			id:'abc',
			type:'qwe'
		});
		expect(restResponse.included).to.be.an('array');
		expect(restResponse.included[0]).to.be.instanceOf(RESTResourceObject);
		expect(restResponse.included[0].id).to.be.equal('abc');
		expect(restResponse.included[0].type).to.be.equal('qwe');

	});

	it('setSelfLink()', function () {
		const restResponse = new RESTResponse();
		restResponse.setSelfLink('http://localhost');
		expect(restResponse.links.self).to.be.instanceOf(RESTLink);
		expect(restResponse.links.self.toREST()).to.be.equal('http://localhost');
	});

	it('setRelatedLink()', function () {
		const restResponse = new RESTResponse();
		restResponse.setRelatedLink('http://localhost');
		expect(restResponse.links.related).to.be.instanceOf(RESTLink);
		expect(restResponse.links.related.toREST()).to.be.equal('http://localhost');
	});

	it('setFirstLink()', function () {
		const restResponse = new RESTResponse();
		restResponse.setFirstLink('http://localhost');
		expect(restResponse.links.first).to.be.instanceOf(RESTLink);
		expect(restResponse.links.first.toREST()).to.be.equal('http://localhost');
	});

	it('setPrevLink()', function () {
		const restResponse = new RESTResponse();
		restResponse.setPrevLink('http://localhost');
		expect(restResponse.links.prev).to.be.instanceOf(RESTLink);
		expect(restResponse.links.prev.toREST()).to.be.equal('http://localhost');
	});

	it('setNextLink()', function () {
		const restResponse = new RESTResponse();
		restResponse.setNextLink('http://localhost');
		expect(restResponse.links.next).to.be.instanceOf(RESTLink);
		expect(restResponse.links.next.toREST()).to.be.equal('http://localhost');
	});

	it('setLastLink()', function () {
		const restResponse = new RESTResponse();
		restResponse.setLastLink('http://localhost');
		expect(restResponse.links.last).to.be.instanceOf(RESTLink);
		expect(restResponse.links.last.toREST()).to.be.equal('http://localhost');
	});

	it('addError()', function () {
		const restResponse = new RESTResponse();
		expect(restResponse.addError({
			message:'ert',
			id:'cvb',
			status:400,
			code:'ENOT'
		})).to.be.instanceOf(RESTError);
		expect(restResponse.errors).to.be.an('array');
		expect(restResponse.errors[0].id).to.be.equal('cvb');
	});

	it('fromObject()/toREST()', function () {
		const restResponse = new RESTResponse();
		restResponse.fromObject({
			meta:{a:'bc'},
			data:{
				id:'abc',
				type:'qwe'
			},
			included:[
				{
					id:'wer',
					type:'cvb'
				}
			],
			selfLink:'http://localhost/self',
			relatedLink:'http://localhost/related',
			firstLink:'http://localhost/first',
			prevLink:'http://localhost/prev',
			nextLink:'http://localhost/next',
			lastLink:'http://localhost/last',
			errors:[
				{
					message:'ert',
					id:'cvb',
					status:400,
					code:'ENOT'
				}
			]
		});
		const restObject = restResponse.toREST();
		expect(restObject.jsonapi.version).to.be.a('string');
		expect(restObject.meta.a).to.be.equal('bc');
		expect(restObject.data.id).to.be.equal('abc');
		expect(restObject.included[0].id).to.be.equal('wer');
		expect(restObject.errors[0].id).to.be.equal('cvb');
		expect(restObject.links.self).to.be.equal('http://localhost/self');
		expect(restObject.links.related).to.be.equal('http://localhost/related');
		expect(restObject.links.first).to.be.equal('http://localhost/first');
		expect(restObject.links.prev).to.be.equal('http://localhost/prev');
		expect(restObject.links.next).to.be.equal('http://localhost/next');
		expect(restObject.links.last).to.be.equal('http://localhost/last');
	});

	it('end()#xml', function (done) {
		const restResponse = new RESTResponse();
		restResponse.setResponse({
			getHeader:() => {
				return 'application/xml';
			},
			end:(responseString) => {
				try {
					expect(responseString).to.be.a('string');
					expect(responseString).to.be.equal(`<?xml version='1.0'?><response><jsonapi><version>1.0</version></jsonapi><meta><a>bc</a></meta></response>`);
					done();
				} catch (error) {
					done(error);
				}
			}
		}).fromObject({
			meta:{a:'bc'}
		});
		expect(restResponse.end()).to.be.equal(restResponse);
	});

	it('end()#yaml', function (done) {
		const restResponse = new RESTResponse();
		restResponse.setResponse({
			getHeader:() => {
				return 'application/yaml';
			},
			end:(responseString) => {
				try {
					expect(responseString).to.be.a('string');
					expect(responseString).to.be.equal(`jsonapi:\n  version: '1.0'\nmeta:\n  a: bc\n`);
					done();
				} catch (error) {
					done(error);
				}
			}
		}).fromObject({
			meta:{a:'bc'}
		});
		expect(restResponse.end()).to.be.equal(restResponse);
	});

	it('end()#json', function (done) {
		const restResponse = new RESTResponse();
		restResponse.setResponse({
			getHeader:() => {
				return 'application/json';
			},
			end:(responseString) => {
				try {
					expect(responseString).to.be.a('string');
					expect(responseString).to.be.equal(`{"jsonapi":{"version":"1.0"},"meta":{"a":"bc"}}`);
					done();
				} catch (error) {
					done(error);
				}
			}
		}).fromObject({
			meta:{a:'bc'}
		});
		expect(restResponse.end()).to.be.equal(restResponse);
	});

});
'use strict';
const {expect} = require('chai');
const RESTLink = require('../lib/rest-link.js');
const RESTRelationship = require('../lib/rest-relationship.js');

describe('RESTRelationship class', function () {

	it('constructor()', function () {

		const restRelationship = new RESTRelationship({
			meta:{b:'cv'},
			data:{
				id:'rty',
				type:'hjk'
			},
			selfLink:'http://localhost/self',
			relatedLink:'http://localhost/related'
		});
		expect(restRelationship.meta.b).to.be.equal('cv');
		expect(restRelationship.data.id).to.be.equal('rty');
		expect(restRelationship.data.type).to.be.equal('hjk');
		expect(restRelationship.links.self.toREST()).to.be.equal('http://localhost/self');
		expect(restRelationship.links.related.toREST()).to.be.equal('http://localhost/related');

	});

	it('fromObject()', function () {

		const restRelationship = new RESTRelationship();
		restRelationship.fromObject({
			meta:{b:'cv'},
			data:{
				id:'rty',
				type:'hjk'
			},
			selfLink:'http://localhost/self',
			relatedLink:'http://localhost/related'
		});
		expect(restRelationship.meta.b).to.be.equal('cv');
		expect(restRelationship.data.id).to.be.equal('rty');
		expect(restRelationship.data.type).to.be.equal('hjk');
		expect(restRelationship.links.self.toREST()).to.be.equal('http://localhost/self');
		expect(restRelationship.links.related.toREST()).to.be.equal('http://localhost/related');

	});

	it('setData()', function () {

		const restRelationship = new RESTRelationship();
		restRelationship.setData({
			id:'rty',
			type:'hjk'
		});
		expect(restRelationship.data.id).to.be.equal('rty');
		expect(restRelationship.data.type).to.be.equal('hjk');
		restRelationship.setData([{
			id:'rty',
			type:'hjk'
		}]);
		expect(restRelationship.data).to.be.an('array');
		expect(restRelationship.data[0].id).to.be.equal('rty');
		expect(restRelationship.data[0].type).to.be.equal('hjk');

	});

	it('addData()', function () {

		const restRelationship = new RESTRelationship();
		restRelationship.addData({
			id:'rty',
			type:'hjk'
		});
		expect(restRelationship.data).to.be.an('array');
		expect(restRelationship.data[0].id).to.be.equal('rty');
		expect(restRelationship.data[0].type).to.be.equal('hjk');

	});

	it('setSelfLink()', function () {

		const restRelationship = new RESTRelationship();
		restRelationship.setSelfLink('http://localhost');
		expect(restRelationship.links.self).to.be.instanceOf(RESTLink);
		expect(restRelationship.links.self.toREST()).to.be.equal('http://localhost');

	});

	it('setRelatedLink()', function () {

		const restRelationship = new RESTRelationship();
		restRelationship.setRelatedLink('http://localhost');
		expect(restRelationship.links.related).to.be.instanceOf(RESTLink);
		expect(restRelationship.links.related.toREST()).to.be.equal('http://localhost');

	});

	it('toREST()', function () {

		const restRelationship = new RESTRelationship({
			meta:{b:'cv'},
			data:{
				id:'rty',
				type:'hjk'
			},
			selfLink:'http://localhost/self',
			relatedLink:'http://localhost/related'
		});
		const restObject = restRelationship.toREST();
		expect(restObject.meta.b).to.be.equal('cv');
		expect(restObject.data.id).to.be.equal('rty');
		expect(restObject.data.type).to.be.equal('hjk');
		expect(restObject.links.self).to.be.equal('http://localhost/self');
		expect(restObject.links.related).to.be.equal('http://localhost/related');

	});


});
'use strict';
const {expect} = require('chai');
const RESTLink = require('../lib/rest-link.js');
const RESTRelationship = require('../lib/rest-relationship.js');
const RESTResourceObject = require('../lib/rest-resource-object.js');

describe('RESTResourceObject class', function () {

	it('constructor()', function () {

		const restResourceObject = new RESTResourceObject({
			type:'abc',
			id:'qwe',
			attributes:{
				name:'Warship REST'
			},
			meta:{a:'bc'},
			relationships:[
				{
					name:'relation',
					meta:{b:'cv'},
					data:{
						id:'rty',
						type:'hjk'
					},
					selfLink:'http://localhost/relation/self',
					relatedLink:'http://localhost/relation/related'
				}
			],
			selfLink:'http://localhost/self',
			relatedLink:'http://localhost/related'
		});
		expect(restResourceObject.id).to.be.equal('qwe');
		expect(restResourceObject.type).to.be.equal('abc');
		expect(restResourceObject.attributes.name).to.be.equal('Warship REST');
		expect(restResourceObject.meta.a).to.be.equal('bc');
		expect(restResourceObject.relationships.relation.data.id).to.be.equal('rty');
		expect(restResourceObject.links.self.toREST()).to.be.equal('http://localhost/self');
		expect(restResourceObject.links.related.toREST()).to.be.equal('http://localhost/related');

	});

	it('fromObject()', function () {

		const restResourceObject = new RESTResourceObject();
		restResourceObject.fromObject({
			type:'abc',
			id:'qwe',
			attributes:{
				name:'Warship REST'
			},
			meta:{a:'bc'},
			relationships:[
				{
					name:'relation',
					meta:{b:'cv'},
					data:{
						id:'rty',
						type:'hjk'
					},
					selfLink:'http://localhost/relation/self',
					relatedLink:'http://localhost/relation/related'
				}
			],
			selfLink:'http://localhost/self',
			relatedLink:'http://localhost/related'
		});
		expect(restResourceObject.id).to.be.equal('qwe');
		expect(restResourceObject.type).to.be.equal('abc');
		expect(restResourceObject.attributes.name).to.be.equal('Warship REST');
		expect(restResourceObject.meta.a).to.be.equal('bc');
		expect(restResourceObject.relationships.relation.data.id).to.be.equal('rty');
		expect(restResourceObject.links.self.toREST()).to.be.equal('http://localhost/self');
		expect(restResourceObject.links.related.toREST()).to.be.equal('http://localhost/related');

	});

	it('setRelationships()', function () {

		const restResourceObject = new RESTResourceObject();
		restResourceObject.setRelationships([
			{
				name:'relation',
				meta:{b:'cv'},
				data:{
					id:'rty',
					type:'hjk'
				},
				selfLink:'http://localhost/relation/self',
				relatedLink:'http://localhost/relation/related'
			}
		]);
		expect(restResourceObject.relationships.relation).to.be.instanceOf(RESTRelationship);
		expect(restResourceObject.relationships.relation.data.id).to.be.equal('rty');

	});

	it('addRelationship()', function () {

		const restResourceObject = new RESTResourceObject();
		restResourceObject.addRelationship({
			name:'relation',
			meta:{b:'cv'},
			data:{
				id:'rty',
				type:'hjk'
			},
			selfLink:'http://localhost/relation/self',
			relatedLink:'http://localhost/relation/related'
		});
		expect(restResourceObject.relationships.relation).to.be.instanceOf(RESTRelationship);
		expect(restResourceObject.relationships.relation.data.id).to.be.equal('rty');

	});

	it('setSelfLink()', function () {

		const restResourceObject = new RESTResourceObject();
		restResourceObject.setSelfLink('http://localhost');
		expect(restResourceObject.links.self).to.be.instanceOf(RESTLink);
		expect(restResourceObject.links.self.toREST()).to.be.equal('http://localhost');

	});

	it('setRelatedLink()', function () {

		const restResourceObject = new RESTResourceObject();
		restResourceObject.setRelatedLink('http://localhost');
		expect(restResourceObject.links.related).to.be.instanceOf(RESTLink);
		expect(restResourceObject.links.related.toREST()).to.be.equal('http://localhost');

	});

	it('toREST()', function () {

		const restResourceObject = new RESTResourceObject({
			type:'abc',
			id:'qwe',
			attributes:{
				name:'Warship REST'
			},
			meta:{a:'bc'},
			relationships:[
				{
					name:'relation',
					meta:{b:'cv'},
					data:{
						id:'rty',
						type:'hjk'
					},
					selfLink:'http://localhost/relation/self',
					relatedLink:'http://localhost/relation/related'
				}
			],
			selfLink:'http://localhost/self',
			relatedLink:'http://localhost/related'
		});
		const restObject = restResourceObject.toREST();
		expect(restObject.links.self).to.be.equal('http://localhost/self');
		expect(restObject.links.related).to.be.equal('http://localhost/related');
		expect(restObject.type).to.be.equal('abc');
		expect(restObject.id).to.be.equal('qwe');
		expect(restObject.attributes.name).to.be.equal('Warship REST');
		expect(restObject.relationships.relation.data.id).to.be.equal('rty');
		expect(restObject.meta.a).to.be.equal('bc');

	});


});
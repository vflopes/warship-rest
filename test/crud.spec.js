'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const startRESTCRUD = require('./rest-crud.js');
const startPersonMP = require('./person-mp.js');

describe('AsyncEventEmitter', function () {

	var restCrud;
	var personMP;

	beforeEach(async function () {
		restCrud = await startRESTCRUD();
		personMP = await startPersonMP();
	});

	afterEach(async function () {
		this.timeout(0);
		await (new Promise((resolve) => restCrud.app.server.close(resolve)));
		await personMP.methodProcessor.stop(true);
		await restCrud.payloadIssuer.stop(true);
	});

	it('Should create an entity', function (done) {
		chai
		.request(restCrud.app.server)
		.post('/person')
		.send({
			data:{
				type:'person',
				attributes:{
					name:'Victor'
				}
			}
		})
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(201);
			done();
		});
	});

});
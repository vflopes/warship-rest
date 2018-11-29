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
	var personId;
	var trackerId;

	before(async function () {
		restCrud = await startRESTCRUD();
		personMP = await startPersonMP();
	});

	after(async function () {
		this.timeout(0);
		await (new Promise((resolve) => restCrud.app.server.close(resolve)));
		await personMP.methodProcessor.stop(false);
		await restCrud.payloadIssuer.stop(false);
	});

	it('Should create an entity', function (done) {
		chai
		.request(restCrud.app.server)
		.post('/person')
		.send({
			data:{
				type:'person',
				attributes:{
					name:'Warship REST'
				}
			}
		})
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(201);
			expect(response.body.data.id).to.be.a('string');
			personId = response.body.data.id;
			done();
		});
	});

	it('Should get an entity', function (done) {
		chai
		.request(restCrud.app.server)
		.get('/person/'+personId)
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(200);
			expect(response.body.data.id).to.be.equal(personId);
			done();
		});
	});

	it('Should update an entity', function (done) {
		chai
		.request(restCrud.app.server)
		.put('/person/'+personId)
		.send({
			data:{
				id:personId,
				type:'person',
				attributes:{
					name:'Warship RESTful'
				}
			}
		})
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(200);
			expect(response.body.data.id).to.be.equal(personId);
			done();
		});
	});

	it('Should create an entity (async)', function (done) {
		chai
		.request(restCrud.app.server)
		.post('/async-person')
		.send({
			data:{
				id:personId,
				type:'person',
				attributes:{
					name:'Warship RESTful Async'
				}
			}
		})
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(202);
			expect(response.body.data.type).to.be.equal('queue-jobs');
			expect(response.body.data.id).to.be.a('string');
			trackerId = response.body.data.id;
			done();
		});
	});

	it('Should get a queue job status (forwarded)', function (done) {
		this.timeout(0);
		chai
		.request(restCrud.app.server)
		.get('/async-person/queue-jobs/'+trackerId)
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(200);
			expect(response.body.data.attributes.trackerId).to.be.equal(trackerId);
			expect(response.body.data.attributes.state).to.be.equal('forwarded');
			done();
		});
	});

	it('Should get a queue job status (resolved)', function (done) {
		this.timeout(10000);
		setTimeout(() => {
			chai
			.request(restCrud.app.server)
			.get('/async-person/queue-jobs/'+trackerId)
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(200);
				expect(response.body.data.attributes.trackerId).to.be.equal(trackerId);
				expect(response.body.data.attributes.state).to.be.equal('resolved');
				done();
			});
		}, 5000);
	});

	it('Should create get multiple entities (count 2)', function (done) {
		this.timeout(10000);
		setTimeout(() => {
			chai
			.request(restCrud.app.server)
			.get('/person')
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(200);
				expect(response.body.data).to.be.an('array');
				expect(response.body.data.length).to.be.equal(2);
				done();
			});
		}, 5000);
	});

	it('Should delete an entity', function (done) {
		chai
		.request(restCrud.app.server)
		.delete('/person/'+personId)
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(200);
			expect(response.body.data.id).to.be.equal(personId);
			done();
		});
	});

	it('Should create get multiple entities (count 1)', function (done) {
		chai
		.request(restCrud.app.server)
		.get('/person')
		.end((error, response) => {
			expect(error).to.be.null;
			expect(response).to.have.status(200);
			expect(response.body.data).to.be.an('array');
			expect(response.body.data.length).to.be.equal(1);
			done();
		});
	});

});
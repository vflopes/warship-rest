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
		await personMP.methodProcessor.stop(true);
		await restCrud.payloadIssuer.stop(true);
		await (new Promise((resolve) => restCrud.app.close(resolve)));
	});

	it('Should', function (done) {

	});

});
'use strict';

class CollectionVerb {

	constructor () {

		this._steps = [];

	}

	step (...args) {

		let index = null;
		let stepFunction = args[0];

		if (typeof args[0] === 'number') {
			index = args[0];
			stepFunction = args[1];
		}

		const step = {
			stepFunction,
			isAsync:stepFunction.constructor.name === 'AsyncFunction'
		};

		if (index === null) {
			this._steps.push(step);
			return this;
		} else if (index < 0) {
			this._steps.splice(index*-1, 0, step);
			return this;
		}

		this._steps.splice(index, 1, step);
		return this;

	}

	async execute (request, response) {

		const parameters = {request, response};

		for (const {stepFunction, isAsync} of this._steps) {

			let result = null;

			if (isAsync)
				result = await stepFunction(parameters);
			else
				result = stepFunction(parameters);

			if (result && typeof result === 'object')
				Object.assign(parameters, result);

			if (response.finished)
				return parameters;

		}

		return parameters;

	}

}

module.exports = CollectionVerb;
'use strict';

class CollectionVerb {

	constructor (method = 'GET') {

		this._method = method;
		this._steps = new Map();

	}

	get method () {
		return this._method;
	}

	step (name) {

		if (!this._steps.has(name))
			this._steps.set(
				name,
				{
					inFunction:null,
					isInAsync:false,
					outFunction:null,
					isOutAsync:false
				}
			);

		const step = this._steps.get(name);
		
		const reference = {
			in:(callback) => {
				step.inFunction = callback;
				step.isInAsync = callback.constructor.name === 'AsyncFunction';
				return reference;
			},
			out:(callback) => {
				step.outFunction = callback;
				step.isOutAsync = callback.constructor.name === 'AsyncFunction';
				return reference;
			},
			step:(...args) => this.step(...args)
		};

		return reference;

	}

	async execute (request, response) {

		const parameters = {request, response};

		for (const [name, step] of this._steps) {

			parameters.stepName = name;

			if (step.inFunction) {
				if (step.isInAsync)
					Object.assign(parameters, await step.inFunction(parameters) || {});
				else
					Object.assign(parameters, step.inFunction(parameters) || {});
			}

			if (step.outFunction) {
				if (step.isOutAsync)
					Object.assign(parameters, await step.outFunction(parameters) || {});
				else
					Object.assign(parameters, step.outFunction(parameters) || {});
			}

			if (response.finished)
				return parameters;

		}

		return parameters;

	}

}

module.exports = CollectionVerb;
# MethodAggregator

The **MethodAggregator** unifies the JSONAPI specification, REST\* classes and Warship to compose Express-like apps. This class extends **EventEmitter**.

---------------------------------

#### new MethodAggregator([options])

The `options` is used as template to pass to every [RESTResponse](api-documentation/rest-response.md) instance built by the aggregator.

---------------------------------

#### MethodAggregator.RESTResponse

Constructor of [RESTResponse](api-documentation/rest-response.md).

---------------------------------

#### methodAggregator.method(method)

---------------------------------

#### methodAggregator.listMethodsByVerbName(name)

Returns an array with supported methods filtered by collection verb name.

---------------------------------

#### methodAggregator.apply(app)
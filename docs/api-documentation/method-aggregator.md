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

This method is a proxy to build routes and REST collection verbs. The `method` argument must be an string with the HTTP method that you're going to build a new collection verb os access an existing collection. The returned value is an object with the following properties:

- `verbs` - a `Map` with keys as the routes patterns and values as instances of [CollectionVerb](api-documentation/collection-verb.md).
- `verb` - a function in the form of `verb(routeName)` that will return you an instance of [CollectionVerb](api-documentation/collection-verb.md) creating it if is needed. The creation of a new [CollectionVerb](api-documentation/collection-verb.md) through this method will auto create an `OPTIONS` method with the same route for the [CollectionVerb](api-documentation/collection-verb.md) that will respond with the `Allow` header as the response of the `MethodAggregator.listMethodsByVerbName()`.
- `method` - a reference to the `MethodAggregator.method()` method of the instance, so you can chain calls.

---------------------------------

#### methodAggregator.listMethodsByVerbName(name)

Returns an array with supported methods filtered by collection verb name.

---------------------------------

#### methodAggregator.apply(app)

This method applies all the composed routes, verbs and middlewares into any Express-like app. You must compose your REST application before calling this method. After calling `MethodAggregator.apply()` you can start your application.

The returned value is a reference to the instance itself.

---------------------------------

#### Event: 'error'

This event is emitted when an error is thrown from any middleware. The `MethodAggregator` will try to extract information from `RESTError` or `Message` instances, and will fallback to a internal server error. The argument passed to listeners of this event is the thrown value.
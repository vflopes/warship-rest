# REST

This is the main class exported by this package. This class extends [MethodAggregator](api-documentation/method-aggregator.md). It's a simple wrapper of middlewares to apply on routes of an Express-like app.

---------------------------------

#### new REST(payloadIssuer, [options])

The `payloadIssuer` must be an instance of `Warship` (from `@warshipjs/core`). The `options` is an object with all options accepted by `MethodAggregator` class and the following additional properties:

- `asyncPath` - a string used as the suffix of asynchronous routes, default value is `'queue-jobs'` (as seen in **JSONAPI**).
- `asyncType` - a string to be used as the `type` property of asynchronous routes in the response body, default value is `'queue-jobs'` (as seen in **JSONAPI**).
- `receiver` - the name of the Warship receiver that will be used by REST class to listen for rejected/resolved messages, the default value is `'apiReceiver'`.
- `cachePrefix` - string to be used as prefix of cached responses stored in Redis, the default value is `'resource:cache'`.
- `redisClient` - the `ioredis` client instance that will be used by this class, the default value is `payloadIssuer.redis.clients.rest`.

---------------------------------

#### REST.STATUS_CODES

`STATUS_CODES` object from [Constants](api-documentation/constants.md).

---------------------------------

#### REST.STATUS_CODES_MESSAGES

`STATUS_CODES_MESSAGES` object from [Constants](api-documentation/constants.md).

---------------------------------

#### REST.MethodAggregator

[MethodAggregator](api-documentation/method-aggregator.md) class constructor.

---------------------------------

#### rest.attach(routeOptions)

This method is an abstraction of the method/verb/route building process and middleware attachment. The `routeOptions` are passed to pre-built middlewares described bellow. This method uses the `use` attribute from `routeOptions`:

```javascript
rest.attach({
	urlPath:'/person/:personId',
	messageMethod:'viewPerson',
	verbMethod:'GET',
	use:[
		// Can be a Function or AsyncFunction, which is treated as a middleware
		// If the returned value is an Object, it'll be merged into the first argument of the next middleware call
		({request}) => request.params.cacheKey = request.params.personId,
		// The string will be treated as a pre-built or registered middleware
		'cacheResponder',
		'messageForwarder',
		'rejectionResponder',
		({message,response}) => {
			response.rest.status(message.numeric_code);
			response.rest.setData(message.payload.data);
			response.rest.setSelfLink(response.rest.url(true));
		},
		'cacheHandler',
		({response}) => response.rest.end()
	]
});
```

The returned value is a reference to the instance itself.

---------------------------------

#### rest.register(name, middleware)

Register a new middleware, so it can be referenced by name in the `use` property passed to `REST.attach()` method. 

```javascript
rest.register(
	'dataResponder',
	({message,response}) => {
		response.rest.status(message.numeric_code || REST.STATUS_CODES.CREATED);
		response.rest.setData(message.payload.data);
		response.rest.setSelfLink(response.rest.url(true, (selfLink) => {
			selfLink.pathname += '/'+message.payload.data.id
			return selfLink;
		}));
		response.rest.end();
	}
).attach({
	urlPath:'/person/:personId',
	messageMethod:'deletePerson',
	verbMethod:'DELETE',
	use:[
		'messageForwarder',
		'rejectionResponder',
		'dataResponder'
	]
});
```

The returned value is a reference to the instance itself.

---------------------------------

#### rest.attachCacheResponder(routeOptions)
> Pre-built middleware name: 'cacheResponder'

This middleware will try to respond the request with a cached response. The cache key is extracted from `request.params.cacheKey` attribute, if this attributed is undefined the **SHA1** of the `pathname` from the request url is used as cache key. If the key exists in Redis (as a `HASH`), the response is ended with the cached result, otherwise the middleware chain execution will be executed.

The accepted properties from `routeOptions` object are:

- `urlPath` - the path (route) pattern that will be used to attach the middleware, example `'/person/:personId'`.
- `verbMethod` - the HTTP method that will be used to attach the middleware, example `'POST'`.
- `cacheTtl` - the TTL (in milliseconds) of the cached response, the default value is `60000`.

The returned value is a reference to the instance itself.

---------------------------------

#### rest.attachCacheHandler(routeOptions)
> Pre-built middleware name: 'cacheHandler'

This method will cache the `RESTResponse` from the `response` object (`response.rest`) and will use as the response of future requests to the same route. The cache key policy is the same adopted by `REST.attachCacheResponder()`, but if the cache key is undefined this middleware will continue the execution of the chain. The status code will be cached too.

The accepted properties from `routeOptions` object are:

- `urlPath` - the path (route) pattern that will be used to attach the middleware, example `'/person/:personId'`.
- `verbMethod` - the HTTP method that will be used to build attach the middleware, example `'POST'`.
- `cacheTtl` - the TTL (in milliseconds) of the cached response, the default value is `60000`.

The returned value is a reference to the instance itself.

---------------------------------

#### rest.attachAsyncMessageForwarder(routeOptions)
> Pre-built middleware name: 'asyncMessageForwarder'

This method will behave exactly as the `REST.attachMessageForwarder()`, but will not wait for the message to be resolved/rejected. Usually you'll use the `'asyncResponder'` middleware after the execution of this middleware.

The accepted properties from `routeOptions` object are:

- `urlPath` - the path (route) pattern that will be used to attach the middleware, example `'/person/:personId'`.
- `verbMethod` - the HTTP method that will be used to build attach the middleware, example `'POST'`.
- `messageMethod` - the method that will be used to forward the message.
- `addQuery` - if `true`, parses the querystring from url using [qs](https://www.npmjs.com/package/qs) package, the parsed result will be attached to `message.payload` in the `query` attribute. The default value is `true`.
- `addParams` - if `true`, attaches the extracted parameters from url pattern to `message.payload` in the `params` attribute. The default value is `true`.
- `addHeaders` - if `true`, attaches the headers from `request` object to `message.payload` in the `headers` attribute. The default value is `true`.

The returned value is a reference to the instance itself.

---------------------------------

#### rest.attachMessageForwarder(routeOptions)
> Pre-built middleware name: 'messageForwarder'

This middleware will forward a message with the payload as the request body (and additional properties: `query`, `params` and `headers`, see bellow) and wait for the message to be resolved or rejected.

The accepted properties from `routeOptions` object are:

- `urlPath` - the path (route) pattern that will be used to attach the middleware, example `'/person/:personId'`.
- `verbMethod` - the HTTP method that will be used to build attach the middleware, example `'POST'`.
- `messageMethod` - the method that will be used to forward the message.
- `addQuery` - if `true`, parses the querystring from url using [qs](https://www.npmjs.com/package/qs) package, the parsed result will be attached to `message.payload` in the `query` attribute. The default value is `true`.
- `addParams` - if `true`, attaches the extracted parameters from url pattern to `message.payload` in the `params` attribute. The default value is `true`.
- `addHeaders` - if `true`, attaches the headers from `request` object to `message.payload` in the `headers` attribute. The default value is `true`.
- `isAsync` - if this parameter is true, this method behaves exactly like `REST.attachAsyncMessageForwarder()`, the default value is `false`.
- `outMethod` - the method that will be used to wait for the message to be rejected/resolved, the default value is the same specified in `messageMethod` property.

The returned value is a reference to the instance itself.

---------------------------------

#### rest.attachAsyncResponder(routeOptions)
> Pre-built middleware name: 'asyncResponder'

This middleware will respond a request after the execution of `REST.attachAsyncMessageForwarder()` with the `tracker_id` of the forwarded message that can be used to retrieve information about the execution of the asynchronous queued job.

The accepted properties from `routeOptions` object are:

- `urlPath` - the path (route) pattern that will be used to attach the middleware, example `'/person/:personId'`.
- `verbMethod` - the HTTP method that will be used to build attach the middleware, example `'POST'`.

The returned value is a reference to the instance itself.

---------------------------------

#### rest.attachQueueJobsResponder(routeOptions)
> Pre-built middleware name: 'queueJobsResponder'

This middleware will try to respond with the status of the `forwarded` message getting information about it from the `request.params.trackerId` attribute. If the message is not found the response will be a `404` unless the `continueOnNotFound` route option is `true`.

The accepted properties from `routeOptions` object are:

- `urlPath` - the path (route) pattern that will be used to attach the middleware, example `'/person/:personId'`.
- `verbMethod` - the HTTP method that will be used to build attach the middleware, example `'POST'`.
- `continueOnNotFound` - if the message is not found continue the middlewares chain instead of responding with a `404` response.

The returned value is a reference to the instance itself.

---------------------------------

#### rest.attachRejectionResponder(routeOptions)
> Pre-built middleware name: 'rejectionResponder'

This middleware will try to respond with a rejection code if the state of the `message` passed as parameter to middleware is not resolved. If the state is rejected the `numeric_code` of the message is used as the resulting HTTP status code, if this value is undefined or null the status code will be `400`. Any message that is not resolved or rejected is considered a `500` (internal server error). Resolved messages will be ignored by this middleware and the execution of the chain will continue.

The accepted properties from `routeOptions` object are:

- `urlPath` - the path (route) pattern that will be used to attach the middleware, example `'/person/:personId'`.
- `verbMethod` - the HTTP method that will be used to build attach the middleware, example `'POST'`.

The returned value is a reference to the instance itself.
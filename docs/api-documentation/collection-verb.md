# CollectionVerb

The **CollectionVerb** class is a wrapper for middlewares representing the execution pipe of a REST collection over one HTTP method.

---------------------------------

#### collectionVerb.stepsCount

The number of middlewares attached to collection.

---------------------------------

#### collectionVerb.step([index,] stepFunction)

This method adds a middleware into the middleware pipe.

- If you don't specify a numeric index the middleware is appended into middleware array.
- If you specify a numeric value greater than 0 the middleware will replace the specified middleware index.
- If you specify a numeric value less than 0 the middleware will prepend the specified middleware index.

The `stepFunction` must be the middleware, can be an `async` function.

The returned value is a reference to the instance itself.

---------------------------------

#### collectionVerb.execute(request, response)

The `request`/`response` are respectively [IncomingMessage](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_incomingmessage) and [ServerResponse](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_serverresponse) instances. These objects are passed to middlewares as the first argument, and if the return value of a middleware is an object, that object will be merged into this first argument of the next middleware:

```javascript
// Example

const middleware1 = async ({request,response}) => {
	return {otherProperty:Math.random()};
};

// The `otherProperty` will be passed to middleware2

const middleware1 = ({request,response,otherProperty}) => {
	console.log(otherProperty);
};

await collectionVerb.step(middleware1).step(middleware2).execute(request, response);
```

If a middleware ends the `response`, the execution pipe will be stopped after the execution of that middleware.

This method is asynchronous and the returned value is the resulting argument passed to the last middleware.
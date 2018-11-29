# RESTResponse

**RESTResponse** is a class to handle the JSONAPI specification in the context of a HTTP response/request from HTTP server.

---------------------------------

#### new RESTResponse([request[, response[, options]]])

The `request`/`response` are respectively [IncomingMessage](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_incomingmessage) and [ServerResponse](https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_serverresponse) instances. You can also pass null to both arguments and use setters later to define these two objects.

The options object accepts the following properties:

- `protocol` - the server's protocol used to build urls from `RESTResponse.url()` calls, the default value is `'http://'`.
- `jsonApiVersion` - the JSONAPI version attached to the final REST response, the default value is `'1.0'`.

---------------------------------

#### RESTResponse.RESTResourceObject

Constructor of [RESTResourceObject](api-documentation/rest-resource-object.md).

---------------------------------

#### RESTResponse.RESTError

Constructor of [RESTError](api-documentation/rest-error.md).

---------------------------------

#### RESTResponse.RESTLink

Constructor of [RESTLink](api-documentation/rest-link.md).

---------------------------------

#### restResponse.request

Returns the `request` of the response.

---------------------------------

#### restResponse.response

Returns the `response` of the response.

---------------------------------

#### restResponse.errors

Returns the `errors` of the response.

---------------------------------

#### restResponse.data

Returns the `data` of the response.

---------------------------------

#### restResponse.meta

Returns the `meta` of the response.

---------------------------------

#### restResponse.included

Returns the `included` of the response.

---------------------------------

#### restResponse.links

Returns the `links` of the resource. The valid properties are:

- `self` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setSelfLink()`.
- `related` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setRelatedLink()`.
- `first` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setFirstLink()`.
- `prev` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setPrevLink()`.
- `next` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setNextLink()`.
- `last` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setLastLink()`.

---------------------------------

#### restResponse.reset()

Resets all values of the instance except `request` and `response`. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.setRequest([request])

Defines the `request` value of the response. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.setResponse([response])

Defines the `response` value of the response. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.url([reset[, transformFunction]])

Builds a new instance of [URL](https://nodejs.org/dist/latest-v10.x/docs/api/url.html#url_class_url) based on the request object (including the full path). If the `reset` argument is `true` the `hash` and `search` attributes from the **URL** instance are reset to an empty string, otherwise both are left untouched, the default value is `true`.

The `transformFunction` argument is by default `null` but can be a function in the form of `transformFunction(requestUrl)` that will transform the **URL** instance before returning it.

```javascript
const urlObject = restResponse.url(true, (requestUrl) => requestUrl.pathname += '/subroute');
console.log(urlObject.toString())
```

---------------------------------

#### restResponse.status(statusCode[, statusMessage])

Defines the http status code of the response, if the the `statusMessage` is not specified the standard message for the specified `statusCode` will be assigned to the response. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.fromObject([object])

Defines all values of the instance from the `object` argument:

- `meta` - optional object with non-standard meta information.
- `data` - can be an array of objects or an object to pass to [RESTResourceObject](api-documentation/rest-resource-object.md) constructor.
- `included` - an array of objects to pass to [RESTResourceObject](api-documentation/rest-resource-object.md) constructor.
- `selfLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `relatedLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `firstLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `prevLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `nextLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `lastLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `errors` - an array of objects to pass to [RESTError](api-documentation/rest-error.md) constructor.

The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.setMeta(meta)

Defines the `meta` value of the response. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.setData(representation)

The `representation` argument can be an object or an array with objects to be passed to [RESTResourceObject](api-documentation/rest-resource-object.md) constructor. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.addData(representation)

The `representation` argument must be an object to be passed to [RESTResourceObject](api-documentation/rest-resource-object.md) constructor. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.setIncluded(representation)

The `representation` argument must be an array with objects to be passed to [RESTResourceObject](api-documentation/rest-resource-object.md) constructor. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.addIncluded(representation)

The `representation` argument must be an object to be passed to [RESTResourceObject](api-documentation/rest-resource-object.md) constructor. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.setSelfLink(representation)

Defines the `RESTError.links.self` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResponse.setRelatedLink(representation)

Defines the `RESTError.links.related` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResponse.setFirstLink(representation)

Defines the `RESTError.links.first` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResponse.setPrevLink(representation)

Defines the `RESTError.links.prev` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResponse.setNextLink(representation)

Defines the `RESTError.links.next` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResponse.setLastLink(representation)

Defines the `RESTError.links.last` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResponse.addError(representation)

The `representation` argument must be an object to be passed to [RESTError](api-documentation/rest-error.md) constructor. The returned value is a reference to the instance itself.

---------------------------------

#### restResponse.toREST()

Convert the `RESTResponse` instance into a serializable object. The returned value is the converted object.

---------------------------------

#### restResponse.end([data])

This method produces the final response payload and calls the `response.end()` method to finish the request. This method switches the response format using the `Content-Type` header of the `response` instance. The accepted values are: `'application/xml'`, `'application/json'`, `'application/yaml'`, otherwise an error will be thrown. If the `data` argument is not specified the data is loaded from `RESTResponse.toREST()` method call. The returned value is a reference to the instance itself.
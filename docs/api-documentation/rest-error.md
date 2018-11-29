# RESTError

**RESTError** is a representation of [errors specification](https://jsonapi.org/format/upcoming/#errors) from **JSONAPI**. This class extends native **Error** class from JavaScript.

---------------------------------

#### new RESTError([object])

The constructor of **RESTError** will call `RESTError.fromObject()` with the specified `object` argument.

---------------------------------

#### restError.id

Returns the `id` of the error.

---------------------------------

#### restError.links

Returns the `links` of the error. The valid properties are:

- `about` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTError.setAboutLink()`.
- `type` - (array with instances of [RESTLink](api-documentation/rest-link.md)) from `RESTError.addTypeLink()`.

---------------------------------

#### restError.status

Returns the `status` of the error.

---------------------------------

#### restError.code

Returns the `code` of the error.

---------------------------------

#### restError.title

Returns the `title` of the error.

---------------------------------

#### restError.detail

Returns the `detail` of the error. This have the same value of `message` property from native `Error` class.

---------------------------------

#### restError.meta

Returns the `meta` of the error.

---------------------------------

#### restError.fromObject([object])

Defines all values of the instance from the `object` argument:

- `id` - string with the error's `id`, if not specified, an UUIDv4 will be generated.
- `status` - numeric http status code as a string.
- `code` - alphanumeric code of the error.
- `title` - string defining error's title.
- `detail` or `message` - string with details of the error, the `detail` and `message` properties are aliases.
- `meta` - optional object with non-standard meta information.
- `aboutLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `typeLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.

The returned value is a reference to the instance itself.

---------------------------------

#### restError.setAboutLink(representation)

Defines the `RESTError.links.about` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restError.addTypeLink(representation)

Adds a link to `RESTError.links.type` array as a [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restError.toREST()

Convert the `RESTError` instance into a serializable object. The returned value is the converted object.
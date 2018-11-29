# RESTRelationship

**RESTRelationship** is a representation of [relationships specification](https://jsonapi.org/format/upcoming/#document-resource-object-relationships) from **JSONAPI**.

---------------------------------

#### new RESTRelationship([object])

The constructor of **RESTRelationship** will call `RESTRelationship.fromObject()` with the specified `object` argument.

---------------------------------

#### restRelationship.links

Returns the `links` of the relationship. The valid properties are:

- `self` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTRelationship.setSelfLink()`.
- `related` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTRelationship.setRelatedLink()`.

---------------------------------

#### restRelationship.meta

Returns the `meta` of the relationship.

---------------------------------

#### restRelationship.data

Returns the `data` of the relationship.

---------------------------------

#### restRelationship.fromObject([object])

Defines all values of the instance from the `object` argument:

- `meta` - optional object with non-standard meta information.
- `data` - this property can be an array of objects or an object to pass to `RESTRelationship.addData()` method.
- `selfLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `relatedLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.

The returned value is a reference to the instance itself.

---------------------------------

#### restRelationship.setData(representation)

The `representation` argument can be an object with `id` and `type` properties or an array with objects to be passed to `RESTRelationship.addData()` method. The returned value is a reference to the instance itself.

---------------------------------

#### restRelationship.addData(representation)

The `representation` argument must be an object with `id` and `type` properties to define the data property of the relationship. The returned value is a reference to the instance itself.

---------------------------------

#### restRelationship.setSelfLink(representation)

Defines the `RESTError.links.self` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restRelationship.setRelatedLink(representation)

Defines the `RESTError.links.related` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restRelationship.toREST()

Convert the `RESTRelationship` instance into a serializable object. The returned value is the converted object.
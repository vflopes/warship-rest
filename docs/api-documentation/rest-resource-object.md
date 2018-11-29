# RESTResourceObject

**RESTResourceObject** is a representation of [document resource objects specification](https://jsonapi.org/format/upcoming/#document-resource-objects) from **JSONAPI**.

---------------------------------

#### new RESTResourceObject([object])

The constructor of **RESTResourceObject** will call `RESTResourceObject.fromObject()` with the specified `object` argument.

---------------------------------

#### RESTResourceObject.RESTRelationship

Constructor of [RESTRelationship](api-documentation/rest-relationship.md).

---------------------------------

#### restResourceObject.id

Returns the `id` of the resource.

---------------------------------

#### restResourceObject.type

Returns the `type` of the resource.

---------------------------------

#### restResourceObject.attributes

Returns the `attributes` of the resource.

---------------------------------

#### restResourceObject.links

Returns the `links` of the resource. The valid properties are:

- `self` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setSelfLink()`.
- `related` - (instance of [RESTLink](api-documentation/rest-link.md)) from `RESTResourceObject.setRelatedLink()`.

---------------------------------

#### restResourceObject.relationships

Returns the `relationships` of the resource.

---------------------------------

#### restResourceObject.meta

Returns the `meta` of the resource.

---------------------------------

#### restResourceObject.fromObject([object])

Defines all values of the instance from the `object` argument:

- `id` - string with the resource's `id`, if not specified, an UUIDv4 will be generated.
- `type` - string with the resource's `type`.
- `attributes` - string with the resource's `attributes`.
- `meta` - optional object with non-standard meta information.
- `relationships` - array with objects to pass to [RESTRelationship](api-documentation/rest-relationship.md) constructor.
- `selfLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.
- `relatedLink` - data to be passed to [RESTLink](api-documentation/rest-link.md) constructor.

The returned value is a reference to the instance itself.

---------------------------------

#### restResourceObject.setRelationships(representation)

The `representation` argument must be an array with objects to pass to [RESTRelationship](api-documentation/rest-relationship.md) constructor. The returned value is a reference to the instance itself.

---------------------------------

#### restResourceObject.addRelationship(representation)

The `representation` argument must be a object to pass to [RESTRelationship](api-documentation/rest-relationship.md) constructor. The returned value is a reference to the instance itself.

---------------------------------

#### restResourceObject.setSelfLink(representation)

Defines the `RESTError.links.self` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResourceObject.setRelatedLink(representation)

Defines the `RESTError.links.related` [RESTLink](api-documentation/rest-link.md) instance. The returned value is the built link instance. The `representation` argument is passed to the constructor of [RESTLink](api-documentation/rest-link.md) class.

---------------------------------

#### restResourceObject.toREST()

Convert the `RESTResourceObject` instance into a serializable object. The returned value is the converted object.
# RESTLink

**RESTLink** is a representation of [document links specification](https://jsonapi.org/format/upcoming/#document-links) from **JSONAPI**.

---------------------------------

#### new RESTLink(representation)

The `representation` argument can be:

- A string with the raw link.
- An object with `href` and/or `meta` properties.
- An instance of **URL** from NodeJS's **url** module.

---------------------------------

#### restLink.toREST()

Convert the `RESTLink` instance into a serializable object. The returned value is the converted object.
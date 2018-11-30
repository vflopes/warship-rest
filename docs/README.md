# Warship REST

Warship REST is a Payload Issuer that implements RESTful capabilities adopting [JSONAPI](https://jsonapi.org/) specification for Express-like packages (express, polka, restify and etc). This package focuses on fast deployments of REST Endpoints, treating them as gateways for Warship environment or **Payload Issuers**. The JSONAPI specification was chosen because:

- It's simple
- It's flexible, you can use as a data structure for you MPs
- Doesn't overload the payload with excessive HATEOAS

However, this package is not mandatory to build REST APIs using Warship, you can create your own API from scratch using only **warshipjs/core** package.
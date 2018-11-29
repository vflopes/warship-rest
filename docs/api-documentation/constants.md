# Constants

There's a file named **constants.js** in the **lib** folder that holds all the constants values of the **Warship REST** package, the main two exported properties are: `STATUS_CODES` and `STATUS_CODES_MESSAGES`.

---------------------------------

#### STATUS_CODES

This is an object where all keys are constants names of the HTTP status codes and the values are the numeric status code.

```javascript
// Example:
STATUS_CODES.NOT_FOUND === 404;
```

---------------------------------

#### STATUS_CODES_MESSAGES

This is an object where all keys are the numeric values of the HTTP status codes and the values are the default message for each status code.

```javascript
// Example:
STATUS_CODES_MESSAGES[404] === 'Not Found';
```
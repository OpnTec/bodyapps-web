[![Build Status](https://travis-ci.org/fashiontec/bodyapps-service.svg?branch=master)](https://travis-ci.org/fashiontec/bodyapps-service)

Web service and web application components of #bodyapps project

## Setup

 * Install Node.js, MongoDB on machine. 
 * Then run `npm install` in this directory and all the dependencies will be automatically downloaded.
 * Execute `node server.js` and 
 * If you want to start server on specific port number such as 8020, run `PORT=8020 node server.js`
 * Or via grunt: `grunt run`

## Test

 * Unit tests: `grunt test`
 * API tests: `grunt api-test`

# Coding Conventions

 * Use 2 spaces for indenting your code.
 * Use UNIX-style newlines (`\n`), and a newline character as the last character of a file.
 * Limit your lines to 80 characters.
 * Use single quotes, unless you are writing JSON.

Opening braces go on the same line as the statement:

```js
// Right
if (true) {
  console.log('winning');
}

// Wrong
if (true)
{
  console.log('losing');
}
```

Declare one variable per var statement, it makes it easier to re-order the lines:


```js
// Right
var fs = require('fs');
var async = require('async');

// Wrong - hard to reorder lines
var fs = require('fs'),
    async = require('async');

```

Naming: variables, properties and function names should:
 * Use `lowerCamelCase`, class names `UpperCamelCase`
 * Be descriptive, avoid stuff like `var tmp`, `function returnError`
 * Single character variables & uncommon abbreviations should be avoided

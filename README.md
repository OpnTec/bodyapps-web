[![Build Status](https://travis-ci.org/fashiontec/bodyapps-service.svg?branch=master)](https://travis-ci.org/fashiontec/bodyapps-service)

Web service and web application components of #bodyapps project

## Setup

### Preconditions

 * Install Node.js, MongoDB on machine.
 * Then run `npm install` in project directory to install dependencies

### Running the Server

 * You will need a Google Account and create Google OAuth client credentials (see below)
 * Create a file `.env.yaml` in your project directory 
 * Enter your local config as shown below
 * After this you can run `grunt s` to start the server

```yaml
MONGO_URI: 'mongodb://localhost/bodyapps-service-dev' 
SMTP_USER: '{my_gmail_user}'
SMTP_PASS: '{my_gmail_password}'
GOOGLE_CLIENT_ID: '{google_client_id}'
GOOGLE_CLIENT_SECRET: '{google_client_secret}'
```

 * To run from CLI directly, use your OSes native mechanism to define environment variables

### Tests

 * Tests should work out-of the box, can be run via grunt (recommended) or mocha-CLI
 * Via grunt, simply execute `grunt api-test` from inside the project dir
 * Via Mocha, execute `mocha test/my-test-case`, or use any documented [mocha options](http://visionmedia.github.io/mocha/#usage)

### Obtaining Google OAuth client credentials
 
 * Create a new project in [Google Developer Console](https://console.developers.google.com/)
 * Go to APIs & auth > Credentials > Create new Client ID
 * Application type: "Web application",
 * Authorized javascript origins: "http://localhost:3000" (when running locally)
 * Authorized redirect URI: "http://localhost:3000/auth/google/callback" (when running locally)

# Contributing

 * Pull requests welcome :)

## Coding Conventions

 * Use 2 spaces for indenting your code.
 * Use UNIX-style newlines (`\n`), and a newline character as the last character of a file.
 * Limit your lines to 100 characters.
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

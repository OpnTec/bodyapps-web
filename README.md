[![Build Status](https://travis-ci.org/fashiontec/bodyapps-service.svg?branch=master)](https://travis-ci.org/fashiontec/bodyapps-service)

Web service and web application components of #bodyapps project

## Installation Guide

* First install Node.js, MongoDB, machine. 
* Then run 'npm install' in this directory and all the dependencies will be automatically downloaded.

## Run the server

* To start the server, run 'node server.js' and if you want to start server on specific port number such as '8020',you can run 'PORT=8020 node server.js'.

## Test

* Test files are in the 'test' directory. You can run 'mocha test/' to run all tests.

# Contributing

## 2 Spaces for indention

* Use 2 spaces for indenting your code.

## Newlines

* Use UNIX-style newlines (`\n`), and a newline character as the last character
of a file.

## 80 characters per line

* Limit your lines to 80 characters.

## Use single quotes

* Use single quotes, unless you are writing JSON.

## Opening braces go on the same line

Your opening braces go on the same line as the statement.

*Right:*

```js
if (true) {
  console.log('winning');
}
```

*Wrong:*

```js
if (true)
{
  console.log('losing');
}
```

## Declare one variable per var statement

Declare one variable per var statement, it makes it easier to re-order the lines.

*Right:*

```js
if (true) {
  console.log('winning');
}
```

*Wrong:*

```js
if (true)
{
  console.log('losing');
}
```

## Use lowerCamelCase for variables, properties and function names

* Variables, properties and function names should use `lowerCamelCase`.  They
should also be descriptive. Single character variables and uncommon
abbreviations should generally be avoided.

# bodyapps-service

**Travis build state** : [![Build Status](https://travis-ci.org/fashiontec/bodyapps-service.svg?branch=master)](https://travis-ci.org/fashiontec/bodyapps-service)  
**Travis CI link** : https://travis-ci.org/fashiontec/bodyapps-service

Web service and web application components of #bodyapps project

## Installation Guide

* First install Node.js, MongoDB, machine. 
* Then run 'npm install' in this directory and all the dependencies will be automatically downloaded.

## Run the server

* To start the server, run 'node server.js' and if you want to start server on specific port number such as '8020',you can run 'PORT=8020 node server.js'.

## Test

* Test files are in the 'test' directory. You can run 'mocha test/' to run all tests.

## How to use cURL tool for quick testing

```bash
curl -i -X POST -H 'Content-Type: application/json' -d '{ "name": "vishv2", "age": "22", "dob":"12/10/1990", "email":"vishv1brahmbhatt@yahoo.com" }' http://localhost:3000/users
```


```bash
curl -X POST -H 'Content-Type: application/json' -d '{"m_unit": "cm", "mid_neck_girth" : "10", "bust_girth" :"10", "waist_girth" : "10", "hip_girth" : "10", "across_back_shoulder_width" : "10", "shoulder_drop" : "10", "shoulder_slope_degrees" :"10", "arm_length" :"10", "wrist_girth" : "10", "upper_arm_girth" : "10", "armscye_girth" : "10", "height" : "10", "hip_height" :"10", "user_id" : "53a4ac3dd1a9927017910f09", "person":{"name": "San", "email":"san@hotmail.com", "gender":"male", "dob": "12/10/1990"}}' http://localhost:3000/users/53a4ac3dd1a9927017910f09/measurements
```

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

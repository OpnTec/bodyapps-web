# bodyapps-service

[![Build Status](https://travis-ci.org/fossasia/bodyapps-service.svg?branch=master)](https://travis-ci.org/fossasia/bodyapps-service)

## **Software Stack**
The software stack for our application includes following technologies:

1. **Server**: Node.js

2. **Database**: MongoDB

3. **Frontend**: Backbone Framework

4. **UI Design**: Twitter BootStrap

We have used mongoose to access MongoDB database. Mongoose is a wrapper around MongoDB native library which is relatively easy to use rather than native MongoDB drivers.

## Reason behind selecting this software stack

### **Why (Node.js + MongoDb) for server side rather than traditional PHP+MySql?**

Let me share few advantages we had considered before coming to this decision:

* Compared to traditional web-serving techniques where each connection (request) spawns a new thread, taking up system RAM and eventually maxing-out at the amount of RAM available, Node.js operates on a single-thread, using non-blocking I/O calls, allowing it to support tens of thousands of concurrent connections (held in the event loop).

* One such calculation: assuming that each thread potentially has an accompanying 2 MB of memory with it, running on a system with 8 GB of RAM puts us at a theoretical maximum of 4000 concurrent connections, plus the cost of context-switching between threads. That’s the scenario we typically deal with in traditional web-serving techniques. By avoiding all that, Node.js achieves scalability levels of over pretty large number of concurrent connections (Upto 1M).

* NPM: It is the official package manager for Node.js. It helps maintaining the complexity of project without much problem. In addition, it is easy for someone to create their own library/module and share it in npm registry. We can download any module from npm registry ,and use the module in our project without recreating the same stuff over and over again, which makes development pretty fast and clean in Node.js. It also makes the process of extending functionality of backend services simple, and a new contributor should find this functionality useful when starting with this project.

Also,  there are many modules used in this project too :) and you can find the list here:
[package.json](https://github.com/fashiontec/bodyapps-service/blob/master/package.json)

### **Why Backbone?**

1. Backbone's  framework size is something around 60K and it's size is small compared to other options like AngularJS,EmberJS.

2. Backbone is extremely lightweight(as its only dependency is on one JavaScript library), it’s good for building fast and responsive applications and it’s most effective option if web applications are themselves small and single-page. And our web-app as per the plan was supposed to be one page application.

## Setup

### Preconditions

 * Install Node.js, MongoDB on machine.
 * Then run `npm install` in project directory to install dependencies

### Running the Server

 * You will need a Google Account and create Google OAuth client credentials (see below)
 * Some evironment variables need to be set to configure the system. Use your OSes native mechanism
   to set them to the correct values before starting the server:

| Variable Name | Meaning |
|---------------|---------|
| MONGO_URI | URI of MongoDB to connect to, e.g. "mongodb://localhost/bodyapps-service" |
| SMTP_USER | GMail account to use for sending emails |
| SMTP_PASS | Matching password |
| GOOGLE_CLIENT_ID | Google client ID obtained from Google Developer Console |
| GOOGLE_CLIENT_SECRET | Matching client secret |
```

 * Top: create a local script `setenv.sh` containing your local settings and run
   `source ./setenv.sh && grunt s` to start the server.

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

 * Please install [EditorConfig](http://editorconfig.org/) support for your editor/IDE
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
 
 #Code Structure
 
 ### **Files**

***

**app.js** - is the central part of backend service. All important settings with express server are initialized here.
For e.g. we use **body-parser** middleware for parsing request body as JSON.

**server.js**- sets appropriate port and starts the express server.

**Gruntfile.js** - is used to configure or define tasks and load Grunt plugins.

**package.json** - This file is used by npm to store metadata for projects published as npm modules.

**logger.js** - Logging setup is done using Winston.

### **Folders**

***

**app**- It contains sub-folders like routes, models, lib, misc.
*     **routes** - all routes of User, Measurement, Image and Message API are defined.
*     **models** - all models for User, Measurement, Image and Message used by mongoose are defined.
*     **lib** - functions which are used in routes, but still independent in their functionality.
*     **misc** - miscellaneous functions. For example, currently it contains functions used in generation of HDF file from user and measurement record.

**test** - It contains the code related to testing of REST calls and some unit tests as well. It has two subfolders api and unit. 
*     **api**- contains the code related to testing of all API’s like user, measurement, image and message.
*     **unit**- contains the unit tests of certain functions. Currently, functions like authCheck, serializeUser, deserializeUser of passport are unit tested using Sinon.

**public** - all static files (for e.g. html files) are kept in this folder. All static files are served wrt to this path by express server.

# Deployment

The system depends on some environment variables to operate correctly. Since actual production values for these variables cannot be added to the codebase, it is the system administrators job to provide them.

The mechanism of environment variables is simple and generic and works on any UNIX'ish platform w/o relying on a specific environment, runtime monitor, etc. Thus, it should work with PM2, upstart/monit, etc.

For a detailed list of possible environment variables, check out [config.js](https://github.com/fashiontec/bodyapps-service/blob/replace_config/config.js)

### Example Deployment

On a dedicated server, we can simply set the variables in file called `~/.bodyappsrc` in the home folder of the user running the application. Assuming a user `bodyapps` is used:

```bash
# /home/bodyapps/.bodyappsrc
export MONGO_URI='mongodb://localhost/bodyapps-service'
export SMTP_USER='liamg@gmail.com'
export SMTP_PASS='...'
export GOOGLE_CLIENT_ID='...'
export GOOGLE_CLIENT_SECRET='...'
export LOG_LEVEL='debug'
```

Include the contents of this file by appending the following line to `~/.profile`:

```bash
source ~/.bodyappsrc
```

To test, simply issue the following command. Output should be what has been set for `SMTP_USER`:

```bash
source ~/.profile
echo $SMTP_USER
> liamg@gmail.com 
```

# Rest-API

One of the most important part of our backend services are [REST API](http://code.tutsplus.com/tutorials/a-beginners-guide-to-http-and-rest--net-16340) calls.  There are three main resources of our database and their corresponding API’s forms core part of backend:

1. User API

2. Measurement API

3. Image API

In addition, we are using Message API for sending mails.

### **User API:**

***

1.`POST /api/API_VERSION/users `

_This is used for creating an user entity/resource in the database. The fields stored in user can be found here:[User Model](https://github.com/fashiontec/bodyapps-service/blob/master/app/models/user.js)_

2.`GET /api/API_VERSION/users/:user_id`

_It returns a user whose object id(i.e. _id) matches user_id._

### **Measurement API:**

***

1.`POST /api/API_VERSION/users/:user_id/measurements`

_It creates a new measurement record in the database. The fields stored in measurement record can be found here:[Measurement Model](https://github.com/fashiontec/bodyapps-service/blob/master/app/models/measurement.js)._

2.`GET /api/API_VERSION/users/:user_id/measurements/:measurement_id`

_It returns a measurement record whose m_id matches  ‘measurement_id’ for  header **Accept: application/json**._

_For header, **Accept: application/vnd.valentina.hdf**, it returns a HDF record having details of user and it’s measurement record._

3.`GET  /api/API_VERSION/users/:user_id/measurements`

_It returns the measurement record of a user whose user_id field equals the user_id mentioned in the URL._

4.`DELETE /api/API_VERSION/users/:user_id/measurements/:measurement_id`

_It deletes the measurement record whose m_id matches the measurement_id of the URL._

5.`GET  /api/API_VERSION/users/:user_id/deletedMeasurements`

_It returns the list of deletedMeasurements for an user. It finds deleted measurement records whose user_id matches the one mentioned in URL._

6.`GET  /api/API_VERSION/users/:user_id/measurements?modifiedAfter`

_It returns the list of measurements whose timestamp is greater than modifiedAfter value. Here modifiedAfter denotes number of milliseconds after 1st January, 1970 midnight._

7.`GET  /api/API_VERSION/users/:user_id/measurements?personName`
 
_It returns the list of measurements whose personName equals the one mentioned in URL and whose user_id matches user_id mentioned in URL._

8.`PUT /api/API_VERSION/users/:user_id/measurements/:measurement_id`

_Updates the fields passed in body of request for the measurement record whose m_id matches measurement_id in url._

### **Image API**

***

1.`POST /api/ API_VERSION/users/:user_id/measurements/:measurement_id/image/:side`

_It creates a new image for mentioned body part, and stores the appropriate entry in measurement record._

2.`GET /api/API_VERSION/images/:image_id`
  
_It returns image whose object id(i.e. _id) matches with image_id of URL._

### **Message API**

***

1.`POST  /api/API_VERSION/message`

_It sends mail containing HDF file as an attachment._

## Rest-API Examples

1.`POST /api/API_VERSION/users `
![](http://imagebin.ca/1XTB9fjg8UPM/POSTusers.png)

2.`GET /api/API_VERSION/users/:user_id`
![](http://ibin.co/1XTBjGUcamp2)

3.`POST /api/API_VERSION/users/:user_id/measurements`
![](http://ibin.co/1XTCmCrBSTAD)

4.`GET /api/API_VERSION/users/:user_id/measurements/:measurement_id`
![](http://ibin.co/1XTDl5ZaOj6L)

5.`POST /api/ API_VERSION/users/:user_id/measurements/:measurement_id/image/:side`
![](http://ibin.co/1XTE5NoO2YwQ)
![](http://ibin.co/1XTElqQz94U2)

6.`GET /api/API_VERSION/images/:image_id`
![](http://ibin.co/1XTEOjygmKnG)

7.`POST  /api/API_VERSION/message`
![](http://ibin.co/1XTFFC2bYiKM)

# Testing

### Libraries Used:

**Mocha**: Test Runner

**Supertest**: Used for testing REST api.

**Assert**: For doing assertion check during the testing.

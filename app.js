/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Application of the backend.
 * 
 * Starts the connection with database using mongoose
 * and based on the request of URL, app forwards it to
 * appropriate methods.
 */

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var uri = 'mongodb://localhost/mongoose-shared-connection';
global.db = mongoose.createConnection(uri);

var user = require('./routes/user');
var measurement = require('./routes/measurement');

var app = express();
app.use(bodyParser());
app.use(morgan());
app.use(express.static(__dirname + '/public'));

app.post('/users/measurements', measurement.insertMeasurementRecord);
app.get('/users/:user_id/measurements',
  measurement.findMeasurementRecords);
app.get('/users/:user_id/measurements/:measurement_id',
  measurement.findMeasurementRecord);
app.post('/users', user.insertUser);
app.get('/users/:user_id', user.findUser);

app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

app.post('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

// handling 404 errors
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
 
  res.send(err.message || 'No such request found');
});

module.exports = app;

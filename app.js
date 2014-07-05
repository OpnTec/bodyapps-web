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
var config = require('config');

console.log('Connecting to ' + config.mongo.uri);
global.db = mongoose.createConnection(config.mongo.uri);

var session = require('express-session');
var cookieParser = require('cookie-parser');  

var app = express();
// configure Express
var passport = require('./app/passport');

app.use(morgan());
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'bodyappsecretwebapp', cookie:{maxAge:86400000} }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

require('./app/routes/passport.js')(app); //load routes and pass in 'app'
// and configured passport

require('./app/routes/user.js')(app);
require('./app/routes/measurement.js')(app);
app.get('/logout', function(req, res) {
  req.session.destroy(function (err) {
    res.redirect('/index.html');
  });
});

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

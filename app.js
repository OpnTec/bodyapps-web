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

// Force config dir location relative to this file - makes deployment a lot more robust
process.env.NODE_CONFIG_DIR = __dirname + '/config';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('config');
var logger = require('./logger');

logger.debug('Connecting to ' + config.mongo.uri);
mongoose.connect(config.mongo.uri);

var session = require('express-session');
var cookieParser = require('cookie-parser');  

var app = express();
// configure Express
var passport = require('./app/passport');

var winstonStream = {
  write: function(message){
    logger.info(message);
  }
};
app.use(morgan('combined', {stream:winstonStream}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({ secret: config.session.secret, saveUninitialized: true, 
  resave: true, cookie:{maxAge:86400000} }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

require('./app/routes/passport')(app); //load routes and pass in 'app'
// and configured passport

require('./app/routes/user')(app);
require('./app/routes/measurement')(app);
require('./app/routes/image')(app);

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

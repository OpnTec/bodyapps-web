/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Application of the backend.
 * 
 * Starts the connection with database using mongoose and based on the request of URL, app forwards 
 * it to appropriate methods.
 */

// Force config dir location relative to this file - makes deployment a lot more robust
process.env.NODE_CONFIG_DIR = __dirname + '/config';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('config');
var uuid = require('node-uuid');
var logger = require('./logger');
var methodOverride = require('method-override');
var busboy = require('connect-busboy');
var session = require('express-session');
var cookieParser = require('cookie-parser');

logger.debug('Connecting to ' + config.mongo.uri);
mongoose.connect(config.mongo.uri);


// Configure express
var app = express();
app.API_VERSION = 'v1';
var passport = require('./app/passport');

var winstonStream = {
  write: function(message){ logger.info(message); }
};
app.use(morgan('combined', {stream:winstonStream}));

app.use(cookieParser());
app.use(busboy());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// This should be written to config/runtime.json
if (!config.session.secret) {
  config.session.secret = uuid.v4();
}

app.use(session({ secret: config.session.secret, saveUninitialized: true, 
  resave: true, cookie:{maxAge:86400000}, 
  store: require('mongoose-session')(mongoose) }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));


// Configure passport
require('./app/routes/passport')(app); 

// Load routes, pass in 'app' for routes to attach to
require('./app/routes/user')(app);
require('./app/routes/measurement')(app);
require('./app/routes/image')(app);
require('./app/routes/message')(app);

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
// TODO: catch _any_ errors here and provide generic error handling
app.use(function(err, req, res, next) {
  if(err.status !== 404) return next();
  res.send(err.message || 'No such request found');
});

module.exports = app;

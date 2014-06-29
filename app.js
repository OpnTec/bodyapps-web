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

var user = require('./routes/user');
var measurement = require('./routes/measurement');

var session = require('express-session');
var cookieParser = require('cookie-parser');  
var passport = require('passport');
var util = require('util');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('./models/user');

var GOOGLE_CLIENT_ID = "227579141651-m1g4kcorqjh94efr6hli36lul84gnfp8.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "PlPel6Ol65zAwjiGPF-wJZD-";

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(!err)  done(null, user);
    else  done(err, null)
  });
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      var gmail = profile.emails[0].value;

      User.findOne({ email: gmail}, function(err, gUser) {
        if (err)
            return done(err);

        if (gUser) {
             return done(null, gUser);
        }
        else {
          var newUser = new User();

          // set all of the relevant information
          newUser.name  = profile.displayName;
          newUser.email = profile.emails[0].value;

          // save the user
          newUser.save(function(err) {
              if (err)
                  return next(err);
              return done(null, newUser);
          });
        }
      });
    });
  }
));

var app = express();
// configure Express

app.use(morgan());
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'bodyappsecretwebapp' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.post('/users/measurements', measurement.insertMeasurementRecord);
app.get('/users/:user_id/measurements',
  measurement.findMeasurementRecords);
app.get('/users/:user_id/measurements/:measurement_id',
  measurement.findMeasurementRecord);
app.post('/users', user.insertUser);
app.get('/users/:user_id', user.findUser);

app.get('/auth/google',
  passport.authenticate('google', 
    { scope: ['https://www.googleapis.com/auth/plus.me',
              'https://www.googleapis.com/auth/userinfo.email'] }),
                function(req, res){
                // The request will be redirected to Google for authentication, 
                //so we will not call this function.
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/index.html#home' }),
  function(req, res) {
    var url = '/index.html#/user/' + req.user._id;
    res.redirect(url);
  });

app.get('/logout', function(req, res){
    req.session.destroy(function (err) {
      res.redirect('/index.html#home');
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

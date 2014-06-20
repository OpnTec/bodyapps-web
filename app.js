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

var passport = require('passport');
var util = require('util');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var express = require('express');
var mongoose = require('mongoose');

var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');

var uri = 'mongodb://localhost/mongoose-shared-connection';
global.db = mongoose.createConnection(uri);
var user = require('./routes/user');
var measurement = require('./routes/measurement');
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
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.me',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index.html#/homeuser');
  });

app.get('/logout', function(req, res){
    req.session.destroy(function (err) {
      res.redirect('/index.html#');
  });
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      var email = profile.emails[0].value;

      User.findOne({ email: email}, function(err, user) {
        if (err)
            return done(err);

        if (user) {
            return done(null, user);
        } else {
            var newUser = new User();

            // set all of the relevant information
            newUser.name  = profile.displayName;
            newUser.email = profile.emails[0].value;

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
      });
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/index.html#');
}

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

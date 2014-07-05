/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * API tests of the bodyapps passport's google authentication.
 */

var request = require('supertest');

var app = require('../app.js');

describe('GET google o auth', function() {
  var api = request(app);
  describe('GET /auth/google', function() {

    it('should redirect the user to google for login', function(done) {
      var url = '/auth/google';
      var location = 'https://accounts.google.com/o/oauth2/'
      +'auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000'
      + '%2Fauth%2Fgoogle%2Fcallback&scope=https%3A%2F%2Fwww.googleapis.com'
      +'%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth'
      + '%2Fuserinfo.email&client_id=227579141651-'
      +'m1g4kcorqjh94efr6hli36lul84gnfp8.apps.googleusercontent.com';
      console.log('GET ' + url);
      api.get(url)
        .expect(302)
        .expect('location', location)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('GET /auth/google/callback', function() {

    it('should redirect the user to website', function(done) {
      var url = '/auth/google/callback';
      var location = 'https://accounts.google.com/o/oauth2/'
      +'auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000'
      + '%2Fauth%2Fgoogle%2Fcallback&client_id=227579141651-'
      +'m1g4kcorqjh94efr6hli36lul84gnfp8.apps.googleusercontent.com';
      console.log('GET ' + url);
      api.get(url)
        .expect(302)
        .expect('location', location)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});
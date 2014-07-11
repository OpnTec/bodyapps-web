/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * API tests of the bodyapps passport's google authentication.
 */

var request = require('supertest');
var assert = require('assert');

var app = require('../../app.js');

describe('GET google oauth', function() {
  var api = request(app);
  describe('GET /auth/google', function() {

    it('should redirect the user to google for login', function(done) {
      var url = '/auth/google';
      api.get(url)
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          var locationStart = new RegExp('^https://accounts\.google\.com'
            +'/o/oauth2/.*');
          var locationEnd = new RegExp('client_id=227579141651-'
            +'m1g4kcorqjh94efr6hli36lul84gnfp8.apps.googleusercontent.com$');
          assert.equal(true, locationStart.test(res.header.location));
          assert.equal(true, locationEnd.test(res.header.location));
          done();
        });
    });
  });

  describe('GET /auth/google/callback', function() {

    it('should redirect the user to website', function(done) {
      var url = '/auth/google/callback';
      api.get(url)
        .expect(302)
        .end(function(err, res) {
          if (err) return done(err);
          var locationStart = new RegExp('^https://accounts\.google\.com'
            +'/o/oauth2/.*');
          var locationEnd = new RegExp('client_id=227579141651-'
            +'m1g4kcorqjh94efr6hli36lul84gnfp8.apps.googleusercontent.com$');
          assert.equal(true, locationStart.test(res.header.location));
          assert.equal(true, locationEnd.test(res.header.location));
          done();
        });
    });
  });

});

/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * API tests of the bodyapps user backend service.
 */

var request = require('supertest');
var assert = require('assert');
var _ = require('lodash');

var app = require('../../app.js');
var User = require('../../app/models/user');

describe('User API', function() {

  var user;
  var api = request(app);

  // Load fixture data
  beforeEach(function(done) {
    User.create({
      name: 'Wile E. Coyote',
      dob: '09/17/1949',
      age: '100',
      email: 'willy.e.coyote@acme.org'
    }, function(err, _user) {
      user = _user;
      done(err);
    })
  });

  // Reset database
  afterEach(function(done) {
    User.collection.remove(done);
  });

  describe('GET /:user_id', function() {

    it('should return a single user', function(done) {
      var url = '/users/' + user.id;
      console.log('GET ' + url);
      api.get(url)
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body.data);
          assert.equal(user.name, res.body.data.name);
          assert.equal(user.email, res.body.data.email);
          done();
        });
    });

    it('should respond 404 if a user was not found', function(done) {
      api.get('/users/abc123')
        .expect('Content-type', /json/)
        .expect(404, done);
    });

  });

  describe('POST /users', function() {

    var data = { 
      name: 'John Doe',
      age: '22', 
      dob: '10/12/1990',
      email: 'john.doe@example.org'
    };

    it('should create a new user', function(done) {
      api.post('/users')
        .send(data)
        .expect('Content-type', /json/)
        .expect(201)
        .end(function(err, res) {
          assert.ok(res.body.data);
          assert.ok(res.body.data.id);
          assert.ok(res.body.data.name);
          assert.ok(res.body.data.email);
          done();
        });
    });

    it('should reject a user w/o email', function(done) {
      var _data = _.clone(data);
      delete(_data.email);

      api.post('/users')
        .send(_data)
        .expect('Content-type', /json/)
        .expect(400, done);
    })
  });
})

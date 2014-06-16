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

var app = require('../app.js');
var User = require('../models/user');
var Measurement = require('../models/measurement');
var measurement;
var user;

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

beforeEach(function(done) {
  Measurement.create({
    m_unit: 'cm',
    mid_neck_girth : 10,
    bust_girth :'10',
    waist_girth : 10, 
    hip_girth : '10',
    across_back_shoulder_width : '10', 
    shoulder_drop : '10',
    shoulder_slope_degrees :'10', 
    arm_length :'10',
    wrist_girth : '10',
    upper_arm_girth : '10', 
    armscye_girth : '10',
    height : '10',
    hip_height :'10', 
    user_id : user.id,
    person:{
    name: 'San', 
    email:'san@hotmail.com',
    dob: '12/10/1990'
    }
  }, function(err,_measurement) {
    measurement = _measurement;
    done(err);
  })
});

// Reset database
afterEach(function(done) {
  User.collection.remove(done);
});

afterEach(function(done) {
  Measurement.collection.remove(done);
});

describe('Measurement API', function() {
  var api = request(app);

  describe('GET /users/:user_id/measurements/:measurement_id', function() {

    it('should return a single measurement record', function(done) {
      var url = '/users/' + user.id + '/measurements/' + measurement.m_id;
      console.log('GET ' + url);
      api.get(url)
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body.data);
          assert.equal(measurement.m_id, res.body.data.m_id);
          assert.equal(measurement.mid_neck_girth, 
            res.body.data.mid_neck_girth);
          assert.equal(measurement.bust_girth, res.body.data.bust_girth);
          assert.equal(measurement.waist_girth, res.body.data.waist_girth);
          assert.equal(measurement.hip_girth, res.body.data.hip_girth);
          assert.equal(measurement.across_back_shoulder_width, 
            res.body.data.across_back_shoulder_width);
          assert.equal(measurement.shoulder_drop, res.body.data.shoulder_drop);
          assert.equal(measurement.shoulder_slope_degrees, 
            res.body.data.shoulder_slope_degrees);
          assert.equal(measurement.arm_length, res.body.data.arm_length);
          assert.equal(measurement.upper_arm_girth, 
            res.body.data.upper_arm_girth);
          assert.equal(measurement.armscye_girth, res.body.data.armscye_girth);
          assert.equal(measurement.height, res.body.data.height);
          assert.equal(measurement.hip_height, res.body.data.hip_height);
          assert.equal(measurement.user_id, res.body.data.user_id);
          assert.equal(measurement.person.name, res.body.data.person.name);
          assert.equal(measurement.person.email, res.body.data.person.email);
          done();
        });
    });

    it('should respond 404 if a measurement was not found', function(done) {
      api.get('/users/abc123/measurements/xyz123')
        .expect('Content-type', /json/)
        .expect(404, done);
    });

  });

  describe('GET /users/:user_id/measurements', function() {

    it('should return a list of measurement records', function(done) {
      var url = '/users/' + user.id + '/measurements/';
      console.log('GET ' + url);
      api.get(url)
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          var length = res.body.length;

          for(var i=0; i<length; i++)
          {
            assert.ok(res.body[i].data);
            assert.equal(measurement.m_id, res.body[i].data.m_id);
            assert.equal(measurement.mid_neck_girth, 
              res.body[i].data.mid_neck_girth);
            assert.equal(measurement.bust_girth, res.body[i].data.bust_girth);
            assert.equal(measurement.waist_girth, res.body[i].data.waist_girth);
            assert.equal(measurement.hip_girth, res.body[i].data.hip_girth);
            assert.equal(measurement.across_back_shoulder_width, 
              res.body[i].data.across_back_shoulder_width);
            assert.equal(measurement.shoulder_drop, 
              res.body[i].data.shoulder_drop);
            assert.equal(measurement.shoulder_slope_degrees, 
              res.body[i].data.shoulder_slope_degrees);
            assert.equal(measurement.arm_length, res.body[i].data.arm_length);
            assert.equal(measurement.upper_arm_girth, 
              res.body[i].data.upper_arm_girth);
            assert.equal(measurement.armscye_girth, 
              res.body[i].data.armscye_girth);
            assert.equal(measurement.height, res.body[i].data.height);
            assert.equal(measurement.hip_height, res.body[i].data.hip_height);
            assert.equal(measurement.user_id, res.body[i].data.user_id);
            assert.equal(measurement.person.name, res.body[i].data.person.name);
            assert.equal(measurement.person.email, 
              res.body[i].data.person.email);
          }
          done();
        });
    });
  });

  describe('POST /users/measurements', function() {

  it('should create a new measurement record', function(done) {
    var data = {
      m_unit: 'cm',
      mid_neck_girth : '10',
      bust_girth :'10',
      waist_girth : '10', 
      hip_girth : '10',
      across_back_shoulder_width : '10', 
      shoulder_drop : '10',
      shoulder_slope_degrees :'10', 
      arm_length :'10',
      wrist_girth : '10',
      upper_arm_girth : '10', 
      armscye_girth : '10',
      height : '10',
      hip_height :'10', 
      user_id : user.id,
      person:{
      name: 'john', 
      email:'john@hotmail.com',
      dob: '12/10/1990'
      }
    };
    api.post('/users/measurements')
      .send(data)
      .expect('Content-type', /json/)
      .expect(201)
      .end(function(err, res) {
        assert.ok(res.body.data);
        assert.ok(res.body.data.m_id);
        assert.ok(res.body.data.mid_neck_girth);
        assert.ok(res.body.data.bust_girth);
        assert.ok(res.body.data.waist_girth);
        assert.ok(res.body.data.hip_girth);
        assert.ok(res.body.data.across_back_shoulder_width);
        assert.ok(res.body.data.shoulder_drop);
        assert.ok(res.body.data.shoulder_slope_degrees);
        assert.ok(res.body.data.arm_length);
        assert.ok(res.body.data.upper_arm_girth);
        assert.ok(res.body.data.armscye_girth);
        assert.ok(res.body.data.height);
        assert.ok(res.body.data.hip_height);
        assert.ok(res.body.data.user_id);
        assert.ok(res.body.data.person.name);
        assert.ok(res.body.data.person.email);
        assert.ok(res.body.data.person.dob);
        done();
        });
    });
  });
})

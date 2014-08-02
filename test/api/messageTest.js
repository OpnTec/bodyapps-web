/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * API tests of the 'Message' for backend service.
 */

var request = require('supertest');
var assert = require('assert');
var _ = require('lodash');

var stubTransport = require('../common');
var app = require('../../app');
var User = require('../../app/models/user');
var Measurement = require('../../app/models/measurement');
var async = require('async');
var measurement;
var user;
var defaultData;
var userId;
var measurementId;

function createUser(done) {
  User.create({
    name: 'Wile E. Coyote',
    dob: '09/17/1949',
    email: 'willy.e.coyote@acme.org'
  } ,function(err, _user) {
      user = _user;
      userId = user.id;
      done(err);
  });
}

function createMeasurement(done) {
  Measurement.create({
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
    person : {
    name: 'john', 
    email:'john@hotmail.com',
    gender: 'male',
    dob: '12/10/1990'
    },
    user_id : userId
  }, function(err,_measurement) {
      measurement = _measurement;
      measurementId = measurement.m_id;
      done(err);
  });
}

function createMessageData(done) {
  defaultData = {
    user_id: userId,
    measurement_id : measurementId,
    recipient : 'johndoe@acme.com',
    subject: 'hi',
    message:'Please find the attached file'
  };
  done();
}

function removeUser(done) {
  User.collection.remove(done);
}

function removeMeasurement(done) {
  Measurement.collection.remove(done);
}

  // Load fixture data
beforeEach(function(done) {
  async.series([
    createUser, createMeasurement, createMessageData
  ] ,done);
});

// Reset database
afterEach(function(done) {
  async.series([ 
    removeUser, removeMeasurement
  ], done);
});

describe('Message API', function() {

  var api = request(app);

  describe('POST /message', function() {

    it('should send an email', function(done) {
      api.post('/message')
        .send(defaultData)
        .expect('Content-type', /json/)
        .expect(201)
        .end(function(err, res) {
          assert.ok(res.body);
          assert.equal(res.body.mail.recipient, defaultData.recipient);
          assert.equal(res.body.mail.subject, defaultData.subject);
          assert.equal(res.body.mail.message, defaultData.message);
          done();
          });
      });

    it('should not accept a missing recipient', function(done) {
      var data = _.omit(defaultData, 'recipient');
      api.post('/message')
        .send(data)
        .expect(400, done);
    });

    it('should not accept a missing user_id', function(done) {
      var data = _.omit(defaultData, 'user_id');
      api.post('/message')
        .send(data)
        .expect(400, done);
    });

    it('should not accept a missing measurement_id', function(done) {
      var data = _.omit(defaultData, 'measurement_id');
      api.post('/message')
        .send(data)
        .expect(400, done);
    });

    it('should call stubbed nodemailer transport', function(done) {
      assert.equal(true, stubTransport.sendmail.called);
      done();
    });

    it('should pass correct arguments to stubbed nodemailer transport',
      function(done) {
        assert.equal(defaultData.recipient,
          stubTransport.sendmail.args[0][0].to);
        assert.equal(defaultData.subject,
          stubTransport.sendmail.args[0][0].subject);
        assert.equal(defaultData.message,
          stubTransport.sendmail.args[0][0].text);
        done();
    });

  });
});

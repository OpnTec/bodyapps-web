/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * API tests of the image for backend service.
 */

var request = require('supertest');
var assert = require('assert');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

var app = require('../../app.js');
var User = require('../../app/models/user');
var Measurement = require('../../app/models/measurement');
var Image = require('../../app/models/image');
var API_VERSION = app.API_VERSION;
var measurement;
var user;
var image;
var data;
var updatedImageData;

var url;

var user_id;

function parser(res, callback) {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', function (chunk) {
      res.data += chunk;
  });
  res.on('end', function () {
    callback(null, res.data);
  });
}

function encodeAnotherImage(done) {
  fs.readFile(__dirname + '/bodyfrontupdated.png', function (err, data) {
    done(null, data);
  });
}

function createUser(done) {
  User.create({
    name: 'Wile E. Coyote',
    dob: '09/17/1949',
    email: 'willy.e.coyote@acme.org'
  } ,function(err, _user) {
      user = _user;
      user_id = user.id;
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
    user_id : user_id
  }, function(err,_measurement) {
    measurement = _measurement;
    done(err);
  });
}

function encodeImage(callback) {
  fs.readFile(__dirname + '/bodyfront.png', function (err, data) {
    if (err) callback(err);
    callback(null, data);
  });
}

function createImage(done) {
  encodeImage(function(err, imageData) {
    Image.create({data: imageData, type:'image/png'}, function(err, img) {
      if (err) return done(err);
      image = img;
      done(null, imageData);
    });
  });
}

function removeUser(done) {
  User.collection.remove(done);
}

function removeMeasurement(done) {
  Measurement.collection.remove(done);
}

describe('Image API', function() {
  var api = request(app);

  // Load fixture data
  beforeEach(function(done) {
    async.series([createUser, createMeasurement, createImage, encodeAnotherImage],
      function(err, res) {
        if (err) return done();
        data = res[2];
        updatedImageData = res[3];
        url = '/api/' + API_VERSION + '/users/'+ user.id + '/measurements/'
          + measurement.m_id + '/image/body_front'; 
        done();
    });
  });

  // Reset database
  afterEach(function(done) {
    async.series([ 
      function(cb) { Measurement.collection.remove(cb) }, 
      function(cb) { User.collection.remove(cb) },
      function(cb) { Image.collection.remove(cb) }
    ], done);
  });

  describe('POST /users/:user_id/measurements/:measurement_id/image/:side', function() {

    it('should create a new image in measurement record', function(done) {
      api.post(url)
        .set('Content-Type', 'image/png')
        .set('Content-Length', data.length)
        .send(data)
        .expect('Content-type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body.data);
          assert.ok(res.body.data.type);
          assert.ok(res.body.data.id);
          done();
          });
      });

      it('should reject a image w/o valid content', function(done) {
        var _data = 'this is not an image'
        api.post(url)
          .set('Content-Type', 'image/png')
          .set('Content-Length', _data.length)
          .send(_data)
          .expect('Content-type', /json/)
          .expect(400, done);
      });

      it('should respond 404 if measurement was not found', function(done) {
        api.post('/api/' + API_VERSION +
          '/users/abc123/measurements/xyz123/image/body_front')
          .set('Content-Type', 'image/png')
          .set('Content-Length', data.length)
          .send(data)
          .expect('Content-type', /json/)
          .expect(404, done);
      });

    it('should create a new image in measurement record using multipart/form-data',
      function(done) {
        api.post(url)
          .set('Content-Type', 'multipart/form-data')
          .attach('body_front', __dirname + '/bodyfront.png')
          .expect('Content-type', /json/)
          .expect(201)
          .end(function(err, res) {
            if (err) return done(err);
            assert.ok(res.body.data);
            assert.ok(res.body.data.type);
            assert.ok(res.body.data.id);
            done();
            });
      });

      it('should reject a image w/o valid content for multipart/form-data',
        function(done) {
          var _data = 'this is not an image'
          api.post(url)
            .set('Content-Type', 'multipart/form-data')
            .attach('body_front', __dirname + '/invalidImageData.txt')
            .expect('Content-type', /json/)
            .expect(400, done);
      });

      it('should respond 404 if measurement was not found for multipart/form-data',
        function(done) {
          api.post('/api/' + API_VERSION +
            '/users/abc123/measurements/xyz123/image/body_front')
            .set('Content-Type', 'multipart/form-data')
            .attach('body_front', __dirname + '/bodyfront.png')
            .expect('Content-type', /json/)
            .expect(404, done);
      });
  });

  describe('GET /images/:image_id', 
    function() {

      it('should return a single image record', function(done) {
        var url = '/api/' + API_VERSION + '/images/'+ image.id;
        api.get(url)
          .expect(200)
          .expect('Content-type', /png/)
          .parse(parser)
          .end(function(err, res) {
            if (err) return done(err);
            assert.ok(res.body);
            assert.equal((image.data).toString('binary'), res.body);
            done();
          });
      });

      it('should respond 404 if a image was not found', function(done) {
        api.get('/api/' + API_VERSION + '/images/pqr123')
          .expect('Content-type', /json/)
          .expect(404, done);
      });

  });

  describe('PUT /images/:image_id', 
    function() {

      it('should update a single image record', function(done) {
        var url = '/api/' + API_VERSION + '/images/'+ image.id;
        api.put(url)
          .set('Content-Type', 'image/png')
          .set('Content-Length', updatedImageData.length)
          .send(updatedImageData)
          .expect(200)
          .expect('Content-type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            assert.ok(res.body);
            assert.equal(image.id, res.body.data.id);
            assert.equal('image/png', res.body.data.type);
            assert.equal(true, res.body.data.updated);
            done();
          });
      });

      it('should respond 404 if a image was not found', function(done) {
        api.put('/api/' + API_VERSION + '/images/pqr123')
          .set('Content-Type', 'image/png')
          .set('Content-Length', updatedImageData.length)
          .send(updatedImageData)
          .expect('Content-type', /json/)
          .expect(404, done);
      });

      it('should reject a image w/o valid content', function(done) {
        var url = '/api/' + API_VERSION + '/images/'+ image.id;
        _data = 'this is not an image'
        api.put(url)
          .set('Content-Type', 'image/png')
          .set('Content-Length', _data.length)
          .send(_data)
          .expect('Content-type', /json/)
          .expect(400, done);
      });

    });

  })
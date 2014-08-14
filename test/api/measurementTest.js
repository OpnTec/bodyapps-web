/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * API tests of the measurement for backend service.
 */

var request = require('supertest');
var assert = require('assert');
var _ = require('lodash');

var app = require('../../app.js');
var User = require('../../app/models/user');
var Measurement = require('../../app/models/measurement');
var async = require('async');
var fs = require('fs');
var xml2js = require('xml2js');
var admzip = require('adm-zip');
var rimraf = require('rimraf');
var moment = require('moment');
var API_VERSION = app.API_VERSION;
var measurement;
var anotherMeasurement;
var user;
var userId;
var data;
var updatedData;

function binaryZipParser(res, callback) {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', function (chunk) {
      res.data += chunk;
  });
  res.on('end', function () {
      callback(null, new Buffer(res.data, 'binary'));
  });
}

function createUser(done) {
  User.create({
    name: 'Wile E. Coyote',
    dob: '09/17/1949',
    age: '100',
    email: 'willy.e.coyote@acme.org'
  } ,function(err, _user) {
      user = _user;
      userId = user.id;
      done(err);
  });
}

function createMeasurement(done) {
  Measurement.create(
    data = {
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
        done(err);
  });
}

function createAnotherMeasurement(done) {
  Measurement.create(
    updatedData = {
      m_unit: 'cm',
      m_timestamp: moment().subtract(2, 'days').format(),
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
      name: 'san', 
      email:'san@hotmail.com',
      gender: 'male',
      dob: '12/10/1980'
      },
      user_id : userId,
      deleted: true,
    }, function(err,_measurement) {
        anotherMeasurement = _measurement;
        done(err);
  });
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
    createUser, createMeasurement, createAnotherMeasurement
  ] ,done);
});

// Reset database
afterEach(function(done) {
  async.series([ 
    removeUser, removeMeasurement
  ], done);
});

describe('Measurement API', function() {
  var api = request(app);

  describe('GET /users/:user_id/measurements/:measurement_id', function() {

    it('should return a single measurement record', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id +
        '/measurements/' + measurement.m_id;
      api.get(url)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body.data);
          assert.equal(measurement.m_id, res.body.data.m_id);
          assert.equal(measurement.user_id, res.body.data.user_id);
          assert.equal(measurement.person.name, res.body.data.person.name);
          assert.equal(measurement.person.email, res.body.data.person.email);
          done();
        });
    });

    it('should return a Hdf record', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id +
        '/measurements/' + measurement.m_id;
      api.get(url)
        .set('Accept', 'application/vnd.valentina.hdf')
        .expect(200)
        .expect('Content-type', /vnd.valentina.hdf/)
        .parse(binaryZipParser)
        .end(function(err, res) {
          if (err) return done(err);
          var fileData;

          async.series([
            function(callback) {
              fs.writeFile(__dirname + '/sampleHdf.zip', res.body, function(err) {
                if (err) return done(err);
                callback();
              });
            },
            function(callback) {
              var zip = new admzip(__dirname + '/sampleHdf.zip');
              zip.extractAllTo(__dirname + '/output', true);
              callback();
            },
            function(callback) {
              fs.readFile(__dirname + '/output/hdf.xml', function(err, data) {
                if(err) return done(err);
                fileData = data;
                callback();
              });
            },
            function(callback) {
              var parser = new xml2js.Parser();
              parser.parseString(fileData, function(err, result) {
                if(err) return done(err);
                var docInfo = result.hdf.document_info;
                var bodyDefinition = result.hdf.body_definition;

                assert.equal(docInfo[0].author_name[0], user.name);
                assert.equal(docInfo[0].author_email[0], user.email);
                assert.equal(bodyDefinition[0].personal[0].name[0],
                  measurement.person.name);
                assert.equal(bodyDefinition[0].personal[0].sex[0],
                  measurement.person.gender);
                assert.equal(bodyDefinition[0].measurements[0].height[0],
                  measurement.height);
                assert.equal(bodyDefinition[0].measurements[0].neck[0]
                  .mid_neck_girth[0], measurement.mid_neck_girth);

                callback();
              });
            },
            function(callback) {
              fs.unlink(__dirname + '/sampleHdf.zip', function(err) {
                if(err) return done(err);
                callback();
              });
            },
            function(callback) {
              rimraf(__dirname + '/output', function(err) {
                if(err) return done(err);
                callback();
              });
            }],function(err) {
                if (err) return done(err);
                done();
            });
        });
    });

    it('should respond 404 if a measurement was not found', function(done) {
      api.get('/api/' + API_VERSION + '/users/abc123/measurements/xyz123')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(404, done);
    });

    it('should respond 404 if Hdf record cannot be found', function(done) {
      api.get('/api/' + API_VERSION + '/users/abc123/measurements/xyz123')
        .set('Accept', 'application/vnd.valentina.hdf')
        .expect(404, done);
    });

    it('should respond 406 if unknown mime is requested', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id +
        '/measurements/' + measurement.m_id;
      api.get(url)
        .set('Accept', 'application/unknown')
        .expect(406, done);
    });

  });

  describe('GET /users/:user_id/measurements', function() {

    it('should return a list of measurement records', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id + '/measurements';
      api.get(url)
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body[0].data);

          assert.equal(measurement.m_id, res.body[0].data.m_id);
          assert.equal(measurement.user_id, res.body[0].data.user_id);
          assert.equal(measurement.person.name,
            res.body[0].data.person.name);
          assert.equal(measurement.person.email, 
            res.body[0].data.person.email);
          done();
        });
    });

    it('should respond empty list if records were not found', function(done) {
      api.get('/api/' + API_VERSION + '/users/abc123/measurements')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(0, res.body.data.length);
          done();
        });
    });

  });

  describe('GET /users/:user_id/measurements/?modifiedAfter', function() {

    it('should return a changed list of measurement records', function(done) {
      var lastModifiedTime = moment().subtract(1, 'days')._d.getTime();
      var url = '/api/' + API_VERSION + '/users/' + user.id +
        '/measurements/?modifiedAfter=' + lastModifiedTime;
      api.get(url)
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body[0]);
          assert.equal(measurement.m_id, res.body[0].data);
          done();
        });
    });

    it('should respond empty list if records were not found', function(done) {
      api.get('/api/' + API_VERSION +
        '/users/abc123/measurements?modifiedAfter=1406898760638')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(0, res.body.data.length);
          done();
        });
    });

    it('should respond with an error if wrong query is passed', function(done) {
      api.get('/api/' + API_VERSION + '/users/abc123/measurements?modifiedAfter=abc')
        .expect('Content-type', /json/)
        .expect(400, done);
    });

  });

  describe('GET /users/:user_id/measurements/?personName', function() {

    it('should return a list of measurement records', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id + '/measurements/?personName=' +
        measurement.person.name;
      api.get(url)
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body[0].data);

          assert.equal(measurement.m_id, res.body[0].data.m_id);
          assert.equal(measurement.user_id, res.body[0].data.user_id);
          assert.equal(measurement.person.name,
            res.body[0].data.person.name);
          assert.equal(measurement.person.email, 
            res.body[0].data.person.email);
          done();
        });
    });

    it('should respond empty list if records were not found', function(done) {
      api.get('/api/' + API_VERSION + '/users/abc123/measurements?personName=xyz')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(0, res.body.data.length);
          done();
        });
    });

  });

  describe('POST /users/measurements', function() {

  it('should create a new measurement record', function(done) {
    var url = '/api/' + API_VERSION + '/users/' + user.id + '/measurements';
    api.post(url)
      .send(data)
      .expect('Content-type', /json/)
      .expect(201)
      .end(function(err, res) {
        assert.ok(res.body.data);
        assert.ok(res.body.data.m_id);
        assert.ok(res.body.data.user_id);
        assert.ok(res.body.data.person.name);
        assert.ok(res.body.data.person.email);
        assert.ok(res.body.data.person.dob);
        done();
        });
    });

    it('should reject a measurement w/o name and dob and gender', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id + '/measurements';
      var _data = _.clone(data);
      delete(_data.person.name);
      delete(_data.person.dob);
      delete(_data.person.gender);

      api.post(url)
        .send(_data)
        .expect('Content-type', /json/)
        .expect(400, done);
    });
  });

  describe('PUT /users/:user_id/measurements/:measurement_id', function() {

    it('should update a measurement record', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id +
        '/measurements/' + measurement.m_id;
      var _updatedData = _.clone(updatedData);
      _updatedData.deleted = false;
      api.put(url)
        .send(_updatedData)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          assert.ok(res.body.data);
          assert.equal(measurement.m_id, res.body.data.m_id);
          assert.equal(anotherMeasurement.user_id, res.body.data.user_id);
          assert.equal(anotherMeasurement.person.name, res.body.data.person.name);
          assert.equal(anotherMeasurement.person.email, res.body.data.person.email);
          done();
          });
      });

      it('should respond 405 if a measurement_id is tried to be updated',
        function(done) {
          var url = '/api/' + API_VERSION + '/users/' + user.id +
            '/measurements/' + measurement.m_id;
          var _updatedData = _.clone(updatedData);
          _updatedData.m_id = anotherMeasurement.m_id;
          _updatedData.deleted = false;
          api.put(url)
            .send(_updatedData)
            .expect('Content-type', /json/)
            .expect(405, done);
      });

      it('should respond 404 if a measurement was not found', function(done) {
        api.put('/api/' + API_VERSION + '/users/abc123/measurements/xyz123')
          .send(updatedData)
          .expect('Content-type', /json/)
          .expect(404, done);
      });
  });

  describe('DELETE /users/:user_id/measurements/:measurement_id', function() {

    it('should delete a measurement record', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id +
        '/measurements/' + measurement.m_id;
      api.delete(url)
        .expect('Content-type', /json/)
        .expect(200, done);
    });

    it('should respond 404 if a measurement was not found', function(done) {
      api.delete('/api/' + API_VERSION + '/users/abc123/measurements/xyz123')
        .expect('Content-type', /json/)
        .expect(404, done);
    });

  });

  describe('GET /users/:user_id/deletedMeasurements', function() {

    it('should return a list of deleted measurement records', function(done) {
      var url = '/api/' + API_VERSION + '/users/' + user.id + '/deletedMeasurements';
      api.get(url)
        .expect(200)
        .expect('Content-type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.body);
          assert.equal(anotherMeasurement.m_id, res.body[0].data);
          done();
        });
    });

    it('should respond empty list if records were not found', function(done) {
      api.get('/api/' + API_VERSION + '/users/abc123/deletedMeasurements')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(0, res.body.data.length);
          done();
        });
    });
  });
})

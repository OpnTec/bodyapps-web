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
var measurement;
var user;
var data;

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
      user_id = user.id;
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
      user_id : user_id
    }, function(err,_measurement) {
        measurement = _measurement;
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
    createUser, createMeasurement
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
      var url = '/users/' + user.id + '/measurements/' + measurement.m_id;
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
      var url = '/users/' + user.id + '/measurements/' + measurement.m_id;
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
              fs.writeFile(__dirname + '/sampleHdf.zip', res.body, function (err) {
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
              parser.parseString(fileData, function (err, result) {
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
              fs.unlink(__dirname + '/sampleHdf.zip', function (err) {
                if(err) return done(err);
                callback();
              });
            },
            function(callback) {
              rimraf(__dirname + '/output', function (err) {
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
      api.get('/users/abc123/measurements/xyz123')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(404, done);
    });

    it('should respond 404 if Hdf record cannot be found', function(done) {
      api.get('/users/abc123/measurements/xyz123')
        .set('Accept', 'application/vnd.valentina.hdf')
        .expect(404, done);
    });

    it('should respond 406 if unknown mime is requested', function(done) {
      var url = '/users/' + user.id + '/measurements/' + measurement.m_id;
      api.get(url)
        .set('Accept', 'application/unknown')
        .expect(406, done);
    });

  });

  describe('GET /users/:user_id/measurements', function() {

    it('should return a list of measurement records', function(done) {
      var url = '/users/' + user.id + '/measurements';
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
            assert.equal(measurement.user_id, res.body[i].data.user_id);
            assert.equal(measurement.person.name, res.body[i].data.person.name);
            assert.equal(measurement.person.email, 
              res.body[i].data.person.email);
          }
          done();
        });
    });

    it('should respond empty list if records were not found', function(done) {
      api.get('/users/abc123/measurements')
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
    var url = '/users/' + user.id + '/measurements';
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
      var url = '/users/' + user.id + '/measurements';
      var _data = _.clone(data);
      delete(_data.person.name);
      delete(_data.person.dob);
      delete(_data.person.gender);

      api.post(url)
        .send(_data)
        .expect('Content-type', /json/)
        .expect(400, done);
    })
  });
})

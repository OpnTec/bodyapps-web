/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
*/

/*
 * Router for 'Measurement' resource. 
 * 
 * It handles the request of (1)Finding a measurement record of user.
 * (2)Providing a list of measurement records.(3)Creating a measurement
 * record.
 */

var Measurement = require('../models/measurement');
var User = require('../models/user');
var validator = require('validator');
var errorResponse = require('./errorResponse');
var generateHdf = require('../misc/hdf/generateHdf');
var moment = require('moment');
var API_VERSION;

function mapMeasurement(req, doc) {
  var data = doc.toJSON();
  data.images =  doc.images.map(function(img) {
    var path = 'api/' + API_VERSION + '/images/' + img.idref;
    var href = req.protocol + '://' + req.headers.host + path;
    return {rel: img.rel, href: href};
  });
  return {data: data};
}

module.exports = function(app) {

  API_VERSION = app.API_VERSION;

  app.get('/api/' + API_VERSION + '/users/:user_id/measurements',
    function(req, res, next) {
      var userId = req.params.user_id;
      var modifiedAfter = req.query.modifiedAfter;
      var personName = req.query.personName;
      var measurementList = [];

      if(!validator.isNull(personName)) {
        Measurement.find({ 'person.name': personName, user_id: userId,
          deleted:false }, function(err, docs) {
            if(docs.length==0) {
              return res.json({ data: measurementList });
            }
            docs.forEach(function(doc){
              measurementList.push(mapMeasurement(req, doc));
            });
            return res.json(measurementList);
        });
      }
      else {
        if(validator.isNull(modifiedAfter)) {
          Measurement.find({ user_id: userId, deleted:false }, function(err, docs) {
            if(err) return next(err);
            if(docs.length==0) {
              return res.json({ data: measurementList});
            }
            docs.forEach(function(doc){
              measurementList.push(mapMeasurement(req, doc));
            });
            return res.json(measurementList);
          });
        }
        else {
          if(!validator.isNumeric(modifiedAfter)) {
            return res.status(400).json(
              errorResponse('modifiedAfter should be numeric', 400));
          }
          var lastSyncDate = new Date(parseInt(modifiedAfter));

          Measurement.find({ user_id: userId, m_timestamp: { $gt:lastSyncDate},
            deleted: false }, function(err, docs) {
              if(err) return next(err);
              if(docs.length==0) {
                return res.json({data: measurementList});
              }
              docs.forEach(function(doc) {
                measurementList.push({data: doc.m_id});
              });
              return res.json(measurementList);
          });
        }
      }
  });

  app.get('/api/' + API_VERSION + '/users/:user_id/measurements/:measurement_id',
    function(req, res, next) {
      var measurementId = req.params.measurement_id;
      var userId = req.params.user_id;
      var accept = req.get('Accept');

      switch(accept) {

        case 'application/json':
          Measurement.findOne({ m_id: measurementId}, function(err, doc) {
            if(err) return next(err);
            if(doc) {
              return res.json(mapMeasurement(req, doc));
            }
            return res.status(404)
              .json(errorResponse('Measurement record not found', 404));
          });
          break;

        case 'application/vnd.valentina.hdf':
          User.findOne({ _id: userId}, function(err, user) {
            if(err) return next(err);

            if(validator.isNull(user))  return res.status(404).send('user not found');
            Measurement.findOne({ m_id: measurementId},
              function(err, measurement) {
                if(err) return next(err);
                if(validator.isNull(measurement))
                  return res.status(404).send('measurement not found');
                generateHdf(user, measurement, function(err, hdf) {
                  if(err) return next(err);
                  res.set('Content-type', 'application/vnd.valentina.hdf');
                  hdf.pipe(res);
                });
            });
          });
          break;

        default:
          return res.status(406).send('Not Acceptable Request');
          break;
      }
  });

  app.post('/api/' + API_VERSION + '/users/:user_id/measurements',
    function(req, res, next) {
      var body = req.body;
      var personName = body.person.name;
      var personDob = body.person.dob;
      var personGender = body.person.gender;

      if(validator.isNull(personName) || validator.isNull(personDob) 
        || validator.isNull(personGender)) {
          return res.status(400).json(
            errorResponse('person name, date of birth or gender is missing', 400));
      }
      Measurement.create(body, function(err, doc) {
        if(err) return next(err);
        return res.status(201).json(mapMeasurement(req, doc));
      });

  });

  app.put('/api/' + API_VERSION + '/users/:user_id/measurements/:measurement_id',
    function(req, res, next) {
      var body = req.body;
      var measurementId = req.params.measurement_id;
      var measurementIdBody = req.body.m_id;

      if(!validator.isNull(measurementIdBody)) {
        if(measurementIdBody!=measurementId) {
          return res.status(405).json(
            errorResponse('cannot modify measurement_id', 405));        
        }
        else {
          body.m_timestamp = moment().format();
          Measurement.findOneAndUpdate({ m_id : measurementId }, body,
            function(err, doc) {
              if(err) return next(err);
              if(validator.isNull(doc)) {
                return res.status(404).json(
                  errorResponse('measurement record not found', 404));
              }
              return res.status(200).json(mapMeasurement(req, doc));
          });
        }
      }
      else {
        body.m_timestamp = moment().format();
          Measurement.findOneAndUpdate({ m_id : measurementId }, body,
            function(err, doc) {
              if(err) return next(err);
              if(validator.isNull(doc)) {
                return res.status(404).json(
                  errorResponse('measurement record not found', 404));
              }
              return res.status(200).json(mapMeasurement(req, doc));
          });
      }
  });

  app.delete('/api/' + API_VERSION + '/users/:user_id/measurements/:measurement_id',
    function(req, res, next) {
      var measurementId = req.params.measurement_id;
      var userId = req.params.user_id;

      Measurement.findOne({ m_id : measurementId }, function(err, doc) {
        if(err) return next(err);
        if(validator.isNull(doc)) {
          return res.status(404).json(
            errorResponse('measurement record not found', 404));
        }
        doc.deleted = true;
        doc.save(function(err) {
          if(err) next(err);
          return res.status(200).json({ data: 'measurement record deleted' });
        });
      });
  });

  app.get('/api/' + API_VERSION + '/users/:user_id/deletedMeasurements',
    function(req, res, next) { 
      var userId = req.params.user_id;
      var measurementList = [];

      Measurement.find({ user_id: userId, deleted: true }, function(err, docs) {
        if(err) return next(err);
        if(docs.length==0) {
          return res.json({ data: measurementList });
        }
        docs.forEach(function(doc){
          measurementList.push({ data: doc.m_id });
        });
        return res.json(measurementList);
      });
    });
}

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
var validator = require('validator');
var errorResponse = require('./errorResponse');

function mapMeasurement(req, doc) {
  var data = doc.toJSON();
  data.images =  doc.images.map(function(img) {
    var path = '/images/' + img.idref;
    var href = req.protocol + '://' + req.headers.host + path;
    return {rel: img.rel, href: href};
  });
  return {data: data};
}

module.exports = function(app) {
  app.get('/users/:user_id/measurements', function(req, res, next) { 
    var userId = req.params.user_id;

    Measurement.find({ user_id: userId}, function(err, docs) {
      if(err) return next(err);
      var measurementList = [];
      if(docs.length==0)  {
        return res.json({ data: measurementList});
      }
      docs.forEach(function(doc) {
        measurementList.push(mapMeasurement(req, doc));
      });
      return res.json(measurementList);
    })
  });

  app.get('/users/:user_id/measurements/:measurement_id', function(req, res) {
    var m_id = req.params.measurement_id;

    Measurement.findOne({ m_id: m_id}, function(err, doc) {
      if(err) return next(err);
      if(doc) {
        return res.json(mapMeasurement(req, doc));
      }
      return res.json(404,
        errorResponse('Measurement record not found', 404));
    })
  });

  app.post('/users/:user_id/measurements', function(req, res) {
    var body = req.body;
    var personName = body.person.name;
    var personDob = body.person.dob;
    var personGender = body.person.gender;

    if(validator.isNull(personName) || validator.isNull(personDob) 
      || validator.isNull(personGender)) {
        return res.json(400,
          errorResponse('Email not found', 400));
    }
    Measurement.create(body, function(err, doc) {
      if(err) return next(err);
      return res.json(201, mapMeasurement(req, doc));
    })

  });
}

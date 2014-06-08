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

exports.findMeasurementRecords = function(req, res, next) {
  var userid = req.params.user_id;
  Measurement.find({ user_id: userid}, function(err, doc) {
    if(err) return next(err);
    res.send(doc);
  })
}

exports.findMeasurementRecord = function(req, res) {
  var id = req.params.measurement_id;
  Measurement.find({ m_id: id}, function(err, doc) {
    if(err) return next(err);
    res.send(doc);
  })
}

exports.insertMeasurementRecord = function(req, res) {
  var body = req.body;
  Measurement.create(body, function(err, doc) {
    if(err) return next(err)
    res.json({m_id: doc.m_id});
    console.log(body);
    })
}

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
var Image = require('../models/image');
var validator = require('validator');
var errorResponse = require('./errorResponse');
var xml = require('./xmlBuilder');
var archiver = require('archiver');
var async = require('async');

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

  app.get('/users/:user_id/measurements/:measurement_id', function(req, res, next) {
    var measurementId = req.params.measurement_id;
    var userId = req.params.user_id;

    if(req.get('Accept') === 'application/json') {
      Measurement.findOne({ m_id: measurementId}, function(err, doc) {
        if(err) return next(err);
        if(doc) {
          return res.json(mapMeasurement(req, doc));
        }
        return res.json(404,
          errorResponse('Measurement record not found', 404));
      })
    }
    else if (req.get('Accept') === 'application/vnd.valentina.hdf') {
      var zip = archiver('zip');
      res.set('Content-type', 'application/vnd.valentina.hdf');

      zip.pipe(res);
      var fileNameList = [];

      User.findOne({ _id: userId}, function(err, user) {
        if(err) return next(err);

        if(validator.isNull(user))  return res.send(404,'user not found');
        Measurement.findOne({ m_id: measurementId}, function(err, measurement) {
          if(err) return next(err);
          if(validator.isNull(measurement))  
            return res.send(404,'measurement not found');

          if(measurement.images.length!=0) {
            async.each(measurement.images, function(image, callback) {
              Image.findOne({ _id: image.idref}, function(err, doc) {
                if(err) return next(err);
                var fileName = 'pictures/'+ image.idref + '.' + image.type;
                zip.append(doc.binary_data, {name: fileName});
                fileNameList.push(fileName);
                callback();
              });
            },
              function(err) {
                if(err) next(err);
                var xmlDoc = xml.returnXML(measurement, user, fileNameList);
   
                zip.append(new Buffer(xmlDoc),
                  { name:'hdf.xml' });
                zip.finalize(function (err) {
                  if (err) next(err);
                  res.end();
                });
              }
            )
          }

          else {
            var xmlDoc = xml.returnXML(measurement, user, fileNameList);

            zip.append(new Buffer(xmlDoc),
              { name:'hdf.xml' });
            zip.finalize(function (err) {
              if (err) next(err);
              res.end();
            });
          }
        });
      });
    }
    else {
      return res.send(406, 'Not Acceptable Request');
    }
  });

  app.post('/users/:user_id/measurements', function(req, res, next) {
    var body = req.body;
    var personName = body.person.name;
    var personDob = body.person.dob;
    var personGender = body.person.gender;

    if(validator.isNull(personName) || validator.isNull(personDob) 
      || validator.isNull(personGender)) {
        return res.json(400,
          errorResponse('person name, date of birth or gender is missing', 400));
    }
    Measurement.create(body, function(err, doc) {
      if(err) return next(err);
      return res.status(201).json(mapMeasurement(req, doc));
    })

  });
}

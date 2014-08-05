/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Router for 'Image' resource. 
 * 
 * It creates a new record of 'Images' for Measurements.
 */

var Image = require('../models/image');
var Measurement = require('../models/measurement');
var validator = require('validator');
var mimeMagic = require( 'node-ee-mime-magic');
var errorResponse = require('./errorResponse');
var config = require('config');
var apiVersion = config.apiversion.uri;

function returnImageRec(doc, method) {
  var imageRecord;
  if(method === 'POST') {
    imageRecord = {
      data :{
        id : doc.id,
        type: doc.type
      }
    };
  }
  else {
    imageRecord = {
      data :{
        id : doc.id,
        type: doc.type,
        data: doc.data
      }
    };
  }
  return imageRecord;
}

module.exports = function(app) {
  app.post(apiVersion + '/users/:user_id/measurements/:measurement_id/image/:side', 
    function (req, res, next) {
      var body = req.body;
      var measurementId = req.params.measurement_id;
      var side = req.params.side;
      var data = body.data;

      if(validator.isNull(data)) {
        return res.status(400).json(errorResponse('invalid request,type or data is missing', '400'));
      }

      Measurement.findOne({m_id: measurementId}, function(err, measurement) {
        if(err) return next(err);
        if(validator.isNull(measurement)) {
          console.log('No such measurement');
          return res.status(404).json(errorResponse('Measurement record not found', '404'));
        }
        var bitmap = new Buffer(data, 'base64');

        mimeMagic(bitmap, function(err, mimeType) {
          if (err || !mimeType) {
            return res.status(400).json(errorResponse('invalid image data', '400'));
          }
          var image = new Image();

          image.type = mimeType.mime;
          image.data = data;

          image.save(function(err) {
            if(err) return next(err);
            measurement.images.push({rel: side, idref:image._id});
            measurement.save(function(err) {
              var imageRecord = returnImageRec(image, req.method);
              return res.status(201).json(imageRecord);
            });
          });
        });
      });
  });

  app.get(apiVersion +'/images/:image_id', function(req, res, next) {
    var image_id = req.params.image_id;

    Image.findById(image_id, function(err, doc) {
      if(err) return res.status(404).json(errorResponse('image not found', '404'));
      var imageRecord = returnImageRec(doc, req.method);
      return res.status(200).json(imageRecord);
    });
  });

}

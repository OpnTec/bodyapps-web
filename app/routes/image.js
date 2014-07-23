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
  app.post('/users/:user_id/measurements/:measurement_id/image/:side', 
    function (req, res, next) {
      var body = req.body;
      var measurementId = req.params.measurement_id;
      var side = req.params.side;
      var data = body.data;

      if(validator.isNull(data)) {
          return res.json(400,
            errorResponse('invalid request,type or data is missing', '400'));
      }

      Measurement.findOne({m_id: measurementId}, function(err, measurement) {
        if(err) return next(err);
        if(validator.isNull(measurement)) {
          return res.json(404, 
            errorResponse('Measurement record not found', '404'));
        }
        var bitmap = new Buffer(data, 'base64');

        mimeMagic(bitmap, function(err, mimeType) {
          if (err || !mimeType) {
            return res.json(400,
              errorResponse('invalid image data', '400'));
          }
          var image = new Image();

          image.type = mimeType.mime;
          image.data = data;

          image.save(function(err) {
            if(err) return next(err);
            measurement.images.push({rel: side, idref:image._id});
            measurement.save(function(err) {
              var imageRecord = returnImageRec(image, req.method);
              return res.json(201, imageRecord);
            });
          });
        });
      });
  });

  app.get('/images/:image_id', function(req, res, next) {
    var image_id = req.params.image_id;

    Image.findById(image_id, function(err, doc) {
      if(err) return res.json(404, errorResponse('image not found', '404'));
      var imageRecord = returnImageRec(doc, req.method);
      return res.json(200, imageRecord);
    });
  });

}

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
var streamifier = require ('streamifier');

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
  else if(method === 'PUT'){
    imageRecord = {
      data :{
        id : doc.id,
        type: doc.type,
        updated: true
      }
    };
  }
  return imageRecord;
}

function saveImage(measurementId, data, side, res, callback) {
  Measurement.findOne({m_id: measurementId}, function(err, measurement) {
    if(err) return next(err);
    if(validator.isNull(measurement)) {
      return res.status(404).json(
        errorResponse('Measurement record not found', '404'));
    }
    mimeMagic(data, function(err, mimeType) {
      if (err || !mimeType) {
        return res.status(400).json(
          errorResponse('invalid image data', '400'));
      }
      var image = new Image();
      image.type = mimeType.mime;
      image.extension = mimeType.extension;
      image.data = data;
      image.save(function(err) {
        if(err) return next(err);
        measurement.images.push({rel: side, idref:image._id});
        measurement.save(function(err) {
          callback(err, image);
        });
      });
    });
  });
}

module.exports = function(app) {
  var API_VERSION = app.API_VERSION;

  app.post('/api/' + API_VERSION +
    '/users/:user_id/measurements/:measurement_id/image/:side', 
    function (req, res, next) {
      var measurementId = req.params.measurement_id;
      var side = req.params.side;
      var Buffer = require('buffer').Buffer;
      var chunks = [];

      if(req.is('image/*')) {
        req.on('data', function(chunk) {
          chunks.push(chunk);
        });

        req.on('end', function() {
          var data = Buffer.concat(chunks);
          saveImage(measurementId, data, side, res, function(err, image) {
            if(err) next(err);
            var imageRecord = returnImageRec(image, req.method);
            return res.status(201).json(imageRecord);
          });
        });
      }
      else {
        req.pipe(req.busboy);
        req.busboy.on('file', function(fieldname, file, filename) {
          file.on('data', function(chunk) {
            chunks.push(chunk);
          });
          file.on('end', function() {
            var data = Buffer.concat(chunks);
            saveImage(measurementId, data, side, res, function(err, image) {
              if(err) next(err);
              var imageRecord = returnImageRec(image, req.method);
              return res.status(201).json(imageRecord);
            });
          });
        });
      }
  });

  app.get('/api/' + API_VERSION + '/images/:image_id', function(req, res, next) {
    var image_id = req.params.image_id;

    Image.findById(image_id, function(err, doc) {
      if(err) return res.status(404).json(errorResponse('image not found', '404'));
      res.set('Content-type', doc.type);
      res.set('Content-Length', doc.data.length);
      streamifier.createReadStream(doc.data).pipe(res);
      return res;
    });
  });

  app.put('/api/' + API_VERSION + '/images/:image_id', function(req, res, next) {
    var image_id = req.params.image_id;

    var chunks = [];
    req.on('data', function(chunk) {
      chunks.push(chunk);
    });

    req.on('end', function() {
      var data = Buffer.concat(chunks);
      Image.findById(image_id, function(err, doc) {
        if(err) return res.status(404).json(
          errorResponse('image not found', '404'));

        mimeMagic(data, function(err, mimeType) {
          if (err || !mimeType) {
            return res.status(400).json(
              errorResponse('invalid image data', '400'));
          }
          doc.type = mimeType.mime;
          doc.extension = mimeType.extension;
          doc.data = data;
          doc.save(function(err) {
            var imageRecord = returnImageRec(doc, req.method);
            return res.status(200).json(imageRecord);
          });
        });
      });
    });
  });

}

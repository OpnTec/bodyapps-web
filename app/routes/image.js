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
var mimeMagic = require( 'node-ee-mime-magic' );
var fs = require('fs');

function errorResponse(message, status) {
  var message = {
    error: {
      message: message,
      status: status
    }
  };
  return message;
}

function returnImageRec(doc)
{
  var imageRecord = {
    data :{
      id : doc.id,
      type: doc.type,
      binary_data: doc.binary_data
    }
  };
  return imageRecord;
}

function mimeMagicCheck(buffer) {
  var isValidImage;
  mimeMagic( buffer, function( err, mimeType ){
    if ( err || !mimeType ) isValidImage = false;
    else isValidImage = true;
   });
  return isValidImage;
}

module.exports = function(app) {
  app.post('/users/:user_id/measurements/:measurement_id/image/:side', 
    function (req, res, next) {
      var body = req.body;
      var m_id = req.params.measurement_id;;
      var side = req.params.side;
      var type = body.type;
      var binary_data = body.binary_data;

      if(validator.isNull(type) || validator.isNull(binary_data)) {
          return res.json(400, 
            errorResponse('invalid request,type or data is missing', '400'));
      }
      
      var bitmap = new Buffer(binary_data, 'base64');
      var bMimeType = mimeMagicCheck(bitmap);

      if(!bMimeType){
        return res.json(400, 
          errorResponse('invalid image data', '400'));
      }
      var image = new Image();
      image.type = body.type;
      image.binary_data = body.binary_data;
      image.save(function(err) {
        if (err)
          return next(err);
      });

      var query = {};
      query[side] = image._id;

      Measurement.update({ m_id: m_id }, { $set: query}, 
        function (err) {
          if(err)  return next(err);
          var imageRecord = returnImageRec(image);
          res.json(201, imageRecord);
      });
  });

  app.get('/users/:user_id/measurements/:measurement_id/image/:side', 
    function(req, res) {
      var body = req.body;
      var m_id = req.params.measurement_id;
      var side = req.params.side;
      var image_id;

      Measurement.findOne({m_id: m_id}, function(err, measurement) {
        if(err)  return next(err);
        else {
          if(validator.isNull(measurement)) {
            return res.json(404, errorResponse('image not found', '404'));
          }
          image_id = measurement[side];
          Image.findById(image_id, function(err, doc) {
            if(err)  return next(err);
            if(doc) {
              var imageRecord = returnImageRec(doc);
              return res.json(200,imageRecord);
            }
            return res.json(404,errorResponse('image not found', '404'));
          });
        }
    });
  });

}

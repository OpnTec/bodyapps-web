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

function returnImageRec(doc, method)
{
  var imageRecord;
  if(method == "POST") {
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
        binary_data: doc.binary_data
      }
    };
  }
  return imageRecord;
}

function mimeMagicCheck(buffer) {
  var isValidImage;
  var type;
  mimeMagic( buffer, function( err, mimeType ){
    if ( err || !mimeType ) {
      isValidImage = false;
      type = 'undefined';
    }
    else  {
      isValidImage = true;
      type = mimeType.mime;
    }
   });

  var mimeProperties = {
    imageCheck : isValidImage, 
    mimeType: type
  };
  return mimeProperties;
}

module.exports = function(app) {
  app.post('/users/:user_id/measurements/:measurement_id/image/:side', 
    function (req, res, next) {
      var body = req.body;
      var m_id = req.params.measurement_id;
      var side = req.params.side;
      var binary_data = body.binary_data;

      if(validator.isNull(binary_data)) {
          return res.json(400, 
            errorResponse('invalid request,type or data is missing', '400'));
      }

      var bitmap = new Buffer(binary_data, 'binary');
      var mime = mimeMagicCheck(bitmap);

      if(!mime.imageCheck) {
        return res.json(400, 
          errorResponse('invalid image data', '400'));
      }
      var image = new Image();
      image.type = mime.mimeType;
      image.binary_data = body.binary_data;
      image.save(function(err) {
        if (err)  return next(err);
      });

      Measurement.findOne({m_id:m_id}, function(err, doc) {
        if(err)  next(err);
        doc[side] = image._id;
        doc.images.push({rel: side,idref:image._id});
        doc.save(function(err) {
          if(err)  return next(err);
          var imageRecord = returnImageRec(image, req.method);
          res.json(201, imageRecord);
        });
      });
  });

  app.get('/users/:user_id/measurements/:measurement_id/image/:image_id', 
    function(req, res, next) {
      var body = req.body;
      var m_id = req.params.measurement_id;
      var image_id = req.params.image_id;

      Image.findById(image_id, function(err, doc) {
        if(doc) {
          var imageRecord = returnImageRec(doc);
          return res.json(200,imageRecord);
        }
        return res.json(404, errorResponse('image not found', '404'));
      });
  });

}

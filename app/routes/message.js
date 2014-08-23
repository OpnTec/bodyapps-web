/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
*/

/*
 * Router for 'Message' resource. 
 * 
 * It handles the request of sending HDF file via email.
 */

var validator = require('validator');

var User = require('../models/user');
var Image = require('../models/image');
var Measurement = require('../models/measurement');

var errorResponse = require('./errorResponse');
var nodemailer = require('../lib/sendmail');
var generateHdf = require('../misc/hdf/generateHdf');

var config = require('../../config');

function mailResponse(body) {
  var mailInfo = {
    mail: {
      recipient: body.recipient,
      subject: body.subject,
      message: body.message
    }
  };
  return mailInfo;
}

function mailDetails(body, userName, hdfStream) {

  var recipient = body.recipient;
  var subject = body.subject;
  var message = body.message;

  var mailOptions = {
    from: userName + ' via <' + config.messageOptions.from + '>',
    to: recipient,
    subject: subject,
    text: message,

    attachments: [
      {
        filename: 'hdf.zip',
        streamSource: hdfStream
      }
    ]
  };
  return mailOptions;
}

module.exports = function(app) {
var API_VERSION = app.API_VERSION;

  app.post('/api/' + API_VERSION + '/message', function(req, res, next) {
    var body = req.body;
    var userId = body.user_id;
    var measurementId = body.measurement_id;
    var email = body.recipient;

    if(validator.isNull(userId) || validator.isNull(measurementId)
      || validator.isNull(email)) {
        return res.status(400).json(
          errorResponse('user_id, measurement_id or recipient is missing', 400));
    }

    User.findOne({ _id: userId}, function(err, user) {
      if(err) return next(err);
      if(validator.isNull(user)){
        return res.status(404).json(
          errorResponse('User record not found', 404));
      }

      Measurement.findOne({ m_id: measurementId}, function(err, measurement) {
        if(err) return next(err);
        if(validator.isNull(measurement)){
          return res.status(404).json(
            errorResponse('Measurement record not found', 404));
        }
        generateHdf(user, measurement, function(err, hdf) {
          if(err) return next(err);
          var mailOptions = mailDetails(body, user.name, hdf);
          nodemailer.sendmail(mailOptions, function(err, sendMailResponse) {
            if(err) next(err);
            res.status(201).json(mailResponse(body));
          });
        });
      });
    });
  });
}

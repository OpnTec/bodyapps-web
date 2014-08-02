/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
*/

/*
 * Router for 'Message' resource. 
 * 
 * It handles the request of sending HDF file via email.
 */

var Measurement = require('../models/measurement');
var User = require('../models/user');
var Image = require('../models/image');
var validator = require('validator');
var errorResponse = require('./errorResponse');
var fs = require('fs');
var config = require('config');
var nodemailer = require('../lib/sendmail');
var generateHdf = require('../misc/hdf/generateHdf');

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

function mailDetails(body, userName) {

  var recipient = body.recipient;
  var subject = body.subject;
  var message = body.message;

  var mailOptions = {
    from: userName + ' via ' + '<'
      + config.transportOptions.auth.XOAuth2.user + '>',
    to: recipient,
    subject: subject,
    text: message,

    attachments: [
      {
        filename: 'hdf.zip',
        filePath: __dirname + '/' + body.measurement_id + '.zip'
      }
    ]
  };
  return mailOptions;
}

module.exports = function(app) {
  app.post('/message', function(req, res, next) {
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
          var fileOutput = fs.createWriteStream(__dirname + '/'
            +  measurementId + '.zip');
          hdf.pipe(fileOutput);
          var mailOptions = mailDetails(body, user.name);
          nodemailer.sendmail(mailOptions, function(err) {
            if(err) next(err);
            res.status(201).json(mailResponse(body));
            fs.unlink(__dirname + '/' + measurementId + '.zip', function (err) {
              if (err) next(err);
            });
          });
        });
      });
    });
  });
}

/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
*/

/*
 * Handles mail transport of nodemailer.
 * This function sends email via nodemailer.
 */

var nodemailer = require('nodemailer');
var config = require('config');

var transport = nodemailer.createTransport(config.transport.type,
  config.transportOptions);

module.exports.sendmail = function(message, callback) {
  transport.sendMail(message, function(err, res) {
    if(err) callback(err);
    transport.close();
    callback(null, res);
  });
}

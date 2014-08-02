/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
*/

/*
 * Stubbed sendmail function of nodemailer.
 */

var sendmail = require('../app/lib/sendmail');
var sinon = require('sinon');

module.exports.sendmail = sinon.stub(sendmail, 'sendmail').yields(null, {
  message: '250 2.0.0 OK 1403606574 og3sm31277838pbc.48 - gsmtp',
  messageId: 'adefbd50fb8c11e3a3ac0800200c9a66@localhost'
});

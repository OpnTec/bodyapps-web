/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Logger of the bodyapps backend.
 */

var winston = require('winston');
var config = require('./config');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console) ({level:config.logging.level})
  ]
});

module.exports = logger;

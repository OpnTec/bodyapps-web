/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Server of the bodyapps backend.
 */

var app = require('./app');
var logger = require('./logger');
 
app.set('port', process.env.PORT || 3000);
 
app.listen(app.get('port'), function() {
  logger.debug('Express server listening on port ' + app.get('port'));
});

module.exports = app;

/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Error response for the invalid routes. 
 * 
 */

module.exports = function errorResponse(errorMessage, status) {
  var message = {
    error: {
      message: errorMessage,
      status: status
    }
  };
  return message;
}

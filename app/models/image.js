/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Image model for the bodyapps backend. 
 * 
 * Model is defined via Mongoose. Image can be uniquely identified 
 * by it's object id.
 */

var mongoose = require('mongoose');

module.exports = mongoose.model('Image', {
  type: String, //jpg or png
  extension: String,
  data: Buffer //binary buffer
});

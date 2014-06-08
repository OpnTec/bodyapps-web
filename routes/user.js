/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Router for 'User' resource. 
 * 
 * It creates a new record of 'User'
 */

var User = require('../models/user');

exports.insertUser = function (req, res, next) {
  var body = req.body;
  var email = body.email;
  User.findOne({ email: email}, function(err, user) {
  if(user) return res.json({user_id: user._id});
  User.create( body, function (err, doc) {
    if (err) return next(err);
    res.send(doc._id);
    })
  })
}

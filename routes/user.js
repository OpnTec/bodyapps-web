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
var validator = require('validator');

function returnUserRec(doc)
{
  var userRecord = {
    data :{
      name : doc.name,
      id : doc._id,
      dob : doc.dob,
      age :doc.age,
      email : doc.email
    }
  };
  return userRecord;
}
exports.insertUser = function (req, res, next) {
  var body = req.body;
  var email = body.email;
  if(validator.isNull(email)) return res.json(400, {email:null});
  User.findOne({ email: email}, function(err, user) {
    if(user) {
      var userRecord = returnUserRec(user);
      return res.json(201,userRecord);
    }
    User.create( body, function (err, doc) {
      if (err) return next(err);
      var userRecord = returnUserRec(doc);
      return res.json(201,userRecord);
      })
  })
}

exports.findUser = function(req, res) {
  var id = req.params.user_id;
  User.findOne({_id: id}, function(err, doc) {
    if(doc) {
      var userRecord = returnUserRec(doc);
      return res.json(200,userRecord);
    }
    return res.json(404,{user:null});
  })
}

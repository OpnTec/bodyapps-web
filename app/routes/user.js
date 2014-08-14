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
var errorResponse = require('./errorResponse');

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

module.exports = function(app) {
var API_VERSION = app.API_VERSION;
  app.post('/api/' + API_VERSION + '/users', function (req, res, next) { 
    var body = req.body;
    var email = body.email;
    if(validator.isNull(email)) {
      return res.status(400).json(errorResponse('Email not found', 400));
    }
    User.findOne({ email: email}, function(err, user) {
      if(user) {
        var userRecord = returnUserRec(user);
        return res.status(201).json(userRecord);
      }
      User.create( body, function (err, doc) {
        if (err) return next(err);
        var userRecord = returnUserRec(doc);
        return res.status(201).json(userRecord);
      })
    })
  });

  app.get('/api/' + API_VERSION + '/users/:user_id', function (req, res, next) {
    var id = req.params.user_id;
    User.findOne({_id: id}, function(err, doc) {
      if(doc) {
        var userRecord = returnUserRec(doc);
        return res.status(200).json(userRecord);
      }
      return res.status(404).json(errorResponse('User not found', 404));
    })
  });
}
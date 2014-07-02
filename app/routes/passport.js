/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * It handles routes for 'Google-OAuth'.
 */
var passport = require('passport');

var profile = 'https://www.googleapis.com/auth/plus.me';
var email = 'https://www.googleapis.com/auth/userinfo.email';

module.exports = function(app) {
  app.get('/auth/google',
    passport.authenticate('google', 
      { scope: [profile, email] })
  );

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/index.html' }),
    function(req, res) {
      var url = '/index.html#/user/' + req.user._id;
      res.redirect(url);
    });
}

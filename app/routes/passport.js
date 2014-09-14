/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * It handles routes for 'Google-OAuth'.
 */
var passport = require('passport');

var PROFILE = 'https://www.googleapis.com/auth/plus.me';
var EMAIL = 'https://www.googleapis.com/auth/userinfo.email';

module.exports = function(app) {
  app.get('/auth/google',
    passport.authenticate('google', 
      { scope: [PROFILE, EMAIL] })
  );

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/index.html' }),
    function(req, res) {
      var url = '/index.html#login/' + req.user._id;
      res.redirect(url);
    });

  app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
      res.redirect('/index.html');
    });
  });
}

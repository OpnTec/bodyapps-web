/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * It handles routes for 'Google-OAuth'.
 */

module.exports = function(app, passport) {
	app.get('/auth/google',
	  passport.authenticate('google', 
	    { scope: ['https://www.googleapis.com/auth/plus.me',
	              'https://www.googleapis.com/auth/userinfo.email'] }),
	                function(req, res){
	                // The request will be redirected to Google for authentication, 
	                //so we will not call this function.
	  });

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { failureRedirect: '/index.html' }),
	  function(req, res) {
	    var url = '/index.html#/user/' + req.user._id;
	    res.redirect(url);
	  });

	app.get('/logout', function(req, res){
	    req.session.destroy(function (err) {
	      res.redirect('/index.html');
	  });
	});
}
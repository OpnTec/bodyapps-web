/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/**
 * Main script for frontend application.
 */

// Current user, if any
var user = false;
var measurements = new Measurements();

// Just a bad hack, since session is maintained on the server and we need to the current user
// from the server somehow. Future versions should maintain the session on the client only and
// no roundtrips to the server should be required.
function checkLogin(fn) {
  if (user) {
    fn();
  } else if ($.cookie('bodyapps.userId')) {
    loadUser($.cookie('bodyapps.userId'), {
    success: function(_user) {
      user = _user;
      fn();
    },
    error: function(req, res) {
      if (res.status === 401) {
        // not tested since server doesn't check authorization yet
        window.location.hash = 'login';
      } else {
        alert('Sorry we could not log you in: ' + res.statusText);
      }
    }})
  } else {
    window.location.hash = 'login';
  }
}

/**
 * Fetch user from backend.
 */
function loadUser(userId, options) {
  var userModel = new UserModel();
  userModel.url = '/api/v1/users/' + userId;
  userModel.fetch(options);
}

/**
 * Application router
 */
var Router = Backbone.Router.extend({

  routes: {
    '': 'homepage',
    'login': 'login',
    'login/:userId': 'loginSuccess',
    'measurements': 'measurements',
    'measurement/create': 'createMeasurement',
    'measurement/:m_id': 'measurementHome',
    'edit_measurement/:m_id': 'editMeasurement'
  },

  /**
   * Override route method to hook in custom login check
   */
  route: function(route, name, callback) {
    var router = this;
    if (!callback) callback = this[name];
    if (route.indexOf('login') === 0) {
      // skip login check for login-related routes
      return Backbone.Router.prototype.route.call(this, route, name, callback);
    } else {
      return Backbone.Router.prototype.route.call(this, route, name, function() {
        var args = arguments;
        checkLogin(function() { callback.apply(router, args); });
      });
    }
  },

  homepage: function() {
    new WelcomeView().render();
  },

  login: function() {
    new LoginView().render();
  },

  loginSuccess: function(userId) {
    // remember user via cookie, then redirect
    $.cookie('bodyapps.userId', userId);
    window.location.hash = '';
  },

  measurements: function() {
    new MeasurementListView().render();
  },

  createMeasurement: function() {
    new CreateMeasurementView().render();
  },

  measurementHome: function(mId) {
    var model = new MeasurementModel();
    model.url = '/api/v1/users/' + user.get('id') + '/measurements/' + mId;
    model.fetch({headers:{'Accept': 'application/json'}, success: function() {
      new MeasurementMasterView({model: model}).render();
    }});
  },

  editMeasurement: function(mId) {
    var model = new UserModel();
    model.url = '/api/v1/users/' + user.get('id') + '/measurements/' + mId;
    model.fetch({headers:{'Accept': 'application/json'}, success: function() {
        new EditMeasurementView({model: model}).render();
    }});
  }

});

var router = new Router();
Backbone.history.start();

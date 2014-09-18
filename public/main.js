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
    'bodyviz': 'bodyViz',
    'create_measurement': 'newMeasurement',
    'edit_measurement/:m_id': 'measurementHome',
    'edit_measurement/:m_id/personalInfo': 'editPersonalInfo',
    'edit_measurement/:m_id/headInfo': 'editHead',
    'edit_measurement/:m_id/neckInfo': 'editNeck',
    'edit_measurement/:m_id/shoulderInfo': 'editShoulder',
    'edit_measurement/:m_id/chestInfo': 'editChest',
    'edit_measurement/:m_id/armInfo': 'editArm',
    'edit_measurement/:m_id/handInfo': 'editHand',
    'edit_measurement/:m_id/hipNwaistInfo': 'editHipNwaist',
    'edit_measurement/:m_id/legInfo': 'editLeg',
    'edit_measurement/:m_id/footInfo': 'editFoot',
    'edit_measurement/:m_id/trunkInfo': 'editTrunk',
    'edit_measurement/:m_id/heightsInfo': 'editHeights',
  },

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
    $.cookie('bodyapps.userId', userId);
    window.location.hash = '';
  },

  measurements: function() {
    new MeasurementListView().render();
  },

  bodyViz: function() {
    new BodyVizView().render();
  },

  newMeasurement: function() {
    new CreateMeasurementView().render();
  },

  measurementHome: function(m_id) {
    new MeasurementHomeView().render({m_id: m_id});
  },

  editPersonalInfo: function(m_id) {
    new CreateMeasurementView().render({m_id: m_id});
  },

  editHead: function(m_id) {
    new EditHeadView().render({m_id: m_id});
  },

  editNeck: function(m_id) {
    new EditNeckView().render({m_id: m_id});
  },

  editShoulder: function(m_id) {
    new EditShoulderView().render({m_id: m_id});
  },

  editChest: function(m_id) {
    new EditChestView().render({m_id: m_id});
  },

  editArm: function(m_id) {
    new EditArmView().render({m_id: m_id});
  },

  editHand: function(m_id) {
    new EditHandView().render({m_id: m_id});
  },

  editHipNwaist: function(m_id) {
    new EditHipNwaistView().render({m_id: m_id});
  },

  editLeg: function(m_id) {
    new EditLegView().render({m_id: m_id});
  },

  editFoot: function(m_id) {
    new EditFootView().render({m_id: m_id});
  },

  editTrunk: function(m_id) {
    new EditTrunkView().render({m_id: m_id});
  },

  editHeights: function(m_id) {
    new EditHeightsView().render({m_id: m_id});
  }
});

var router = new Router();
Backbone.history.start();

var bodyviz = $('#bodyviz-container').bodyviz();

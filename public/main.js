/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Application of the frontend.
 * 
 * Handles the rendering of the data , i.e. make
 * calls to database to fetch and save the data.
 * And display view on the website page.
 */

// Current user, if any
var user = false;

//models

var MeasurementModel = Backbone.Model.extend({
  defaults: {
    height : '',
    head_girth: '',
    head_and_neck_length: '',
    mid_neck_girth: '',
    neck_base_girth: '',
    shoulder_girth: '',
    upper_chest_girth: '',
    bust_girth: '',
    under_bust_girth: '',
    waist_girth: '',
    waist_to_hip_height: '',
    waist_to_knee_height: '',
    waist_height: '',
    side_waist_length: '',
    center_front_waist_length: '',
    center_back_waist_length: '',
    shoulder_length: '',
    shoulder_and_arm_length: '',
    upper_front_chest_width: '',
    front_chest_width: '',
    across_front_shoulder_width: '',
    across_back_shoulder_width: '',
    upper_back_width: '',
    back_width: '',
    shoulder_width: '',
    bustpoint_to_bustpoint: '',
    halter_bustpoint_to_bustpoint: '',
    neck_to_bustpoint: '',
    shoulder_drop: '',
    shoulder_slope_degree: '',
    trunk_girth: '',
    armscye_girth: '',
    elbow_girth: '',
    upper_arm_girth: '',
    wrist_girth: '',
    underarm_length: '',
    cervical_to_wrist_length: '',
    shoulder_to_elbow_length: '',
    arm_length: '',
    scye_depth: '',
    hand_girth: '',
    hand_length: '',
    hand_width: '',
    thumb_length: '',
    index_finger_length: '',
    middle_finger_length: '',
    ring_finger_length: '',
    little_finger_length: '',
    thumb_width: '',
    index_finger_width: '',
    middle_finger_width: '',
    ring_finger_width: '',
    little_finger_width: '',
    little_finger_length: '',
    thumb_girth: '',
    index_finger_girth: '',
    middle_finger_girth: '',
    ring_finger_girth: '',
    little_finger_girth: '',
    high_hip_girth: '',
    hip_girth: '',
    high_hip_height: '',
    hip_height: '',
    crotch_length: '',
    crotch_height: '',
    rise_height: '',
    thigh_girth: '',
    mid_thigh_girth: '',
    knee_girth: '',
    calf_girth: '',
    ankle_girth: '',
    cervical_to_knee_height: '',
    cervical_height: '',
    knee_height: '',
    ankle_height: '',
    foot_length: '',
    foot_width: '',
    foot_across_top: '',
    arm_type: '',
    back_shape: '',
    chest_type: '',
    shoulder_type: '',
    stomach_shape: '',
    images: [{
      rel: '',
      idref: ''
    }],
    person : {
      name: '',
      email:'',
      gender:'',
      dob:'',
      eye_color: '',
      hair_color: '',
      skin_complexion: '',
      blood_type: '',
      allergy: '',
      eye_performance: ''
    },
    user_id :''
  },
  idAttribute: 'm_id',

  /* Backbone automatically updates the model while running
    POST request. As our REST call returns value in the form
    of 'data:{key1:value1}', this function will take appropriate 
    care of updating while parsing the data. 
  */
  parse : function(resp, xhr) {
    return resp.data; 
  }
});

var UserModel = Backbone.Model.extend({
  defaults:{
    name: '',
    dob: '',
    email: ''
  },
  parse : function(resp, xhr) {
    return resp.data; 
  }
});

//collections

var Measurements = Backbone.Collection.extend({
  model:MeasurementModel,
});

//views

var MeasurementListView = Backbone.View.extend({

  el: '#content-container',
  template: _.template($('#measurement-list').html()),

  initialize: function() {
    this.collection = new Measurements();
    _.bindAll(this, 'render', 'addOne');
  },

  render: function(options) {
    var id = user.get('id');
    var url = '/api/v1/users/' + id + '/measurements';
    var addOne = this.addOne.bind(this);

    this.$el.html(this.template());
    this.collection.url = url;
    this.collection.fetch({success: function(records, response) {
      records.each(addOne);
    }});

    return this;
  },

  addOne: function(measurement) {
    var view = new MeasurementRowView({model: measurement});
    this.$('#measurement-list-body').append(view.render().el);
  }
});


var MeasurementRowView = Backbone.View.extend({

  tagName: 'tr',
  template: _.template($('#measurement-item').html()),

  render: function(options) {
    this.$el.html(this.template({measurement: this.model.toJSON()}));
    return this;
  } 
});

var MeasurementView = Backbone.View.extend({
  tagName:'tr',
  template: _.template($('#measurement-list').html()),

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var WelcomeView = Backbone.View.extend({

  el:'#content-container',

  template: _.template($('#welcome-message').html()),

  render:function() {
    this.$el.html(this.template({user: user.toJSON()}));
    return this;
  }
});

var LoginView = Backbone.View.extend({

  el:'#content-container',

  template: _.template($('#login-view').html()),

  render:function() {
    this.$el.html(this.template());
    return this;
  }
});

var BodyVizView = Backbone.View.extend({

  el:'#bodyviz-container',

  // template: _.template($('#').html()),

  render:function() {
    this.$el.bodyviz();
    return this;
  }
});

var MeasurementHomeView = Backbone.View.extend({

  el:'#content-container',

  template: _.template($('#measurement-home').html()),

  render:function(options) {
    if (!user) {
      window.location.hash = '';
      return;
    }
    this.$el.html(this.template({
      user_id: user.get('id'), 
      m_id: options.m_id
    }));
    return this;
  }
});

/**
 * Base view for all measurement editors. Renders the form for given measurement set and contains
 * the required logic to save the record to the server.
 */
var EditMeasurementBaseView = Backbone.View.extend({

  el:'#content-container',

  initialize: function() {
    _.bindAll(this, 'render', 'save');
  },

  render: function(options) {
    this.model = new MeasurementModel();
    this.model.url = '/api/v1/users/' + user.get('id') + '/measurements/' + options.m_id;
    this.model.fetch({
      headers:{
        'Accept': 'application/json'
      },
      success: function() {
        this.$el.html(this.template({ measurement: this.model.toJSON() }));
        this.$('form').submit(this.save);
      }.bind(this)
    });
    return this;
  },

  save: function(ev) {
    ev.preventDefault();
    var measurementDetails = $(ev.currentTarget).serializeJSON();
    var mId = this.model.get('m_id');
    var nextUrl = this.next === null ? 
      '#edit_measurement/' + mId :
      '#edit_measurement/' + mId + '/' + this.next;
    this.$('.btn-primary').text('Saving...').attr('disabled', 'disabled');
    this.model.save(measurementDetails, {success: function() {
      router.navigate(nextUrl, {trigger: true});
    }});
  }
});

var EditHeadView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-headInfo').html()),
  next: 'neckInfo'
});

var EditNeckView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-neckInfo').html()),
  next: 'shoulderInfo'
});

var EditShoulderView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-shoulderInfo').html()),
  next: 'chestInfo'
});

var EditChestView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-chestInfo').html()),
  next: 'armInfo'
});

var EditArmView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-armInfo').html()),
  next: 'handInfo'
});

var EditHandView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-handInfo').html()),
  next: 'hipNwaistInfo'
});

var EditHipNwaistView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-hipNwaistInfo').html()),
  next: 'legInfo'
});

var EditLegView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-legInfo').html()),
  next: 'footInfo'
});

var EditFootView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-footInfo').html()),
  next: 'trunkInfo'
});

var EditTrunkView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-trunkInfo').html()),
  next: 'heightsInfo'
});

var EditHeightsView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-heightsInfo').html()),
  next: null
});

var CreateMeasurementView = Backbone.View.extend({

  el:'#content-container',
  template: _.template($('#create-measurement').html()),

  intialize: function() {
    _.bindAll(this, 'render', '_render', 'save');
  },

  render:function(options) {
    options = options || {};
    var userId = user.get('id');

    if(!options.m_id) {
      return this._render(null, userId);
    } else {
      this.model = new MeasurementModel();
      this.model.url = '/api/v1/users/' + userId + '/measurements/' + options.m_id;
      this.model.fetch({
        headers: {
          'Accept':'application/json'
        },
        success: function() {
          var measurement = this.model.toJSON();
          this._render(measurement, userId);
        }.bind(this)
      });
    }
  },

  _render: function(measurement, userId) {
    this.$el.html(this.template({
      user_id: userId,
      measurement: measurement
    }));
    this.$('form').submit(this.save);
    return this;
  },

  save: function(ev) {
    ev.preventDefault();
    if(!this.model) {
      var measurementDetails = $(ev.currentTarget).serializeJSON();
      var measurement = new MeasurementModel();
      measurement.url = '/api/v1/users/' + user.get('id') + '/measurements';
      measurement.save(measurementDetails, {
        type:'post',
        success:function() {
          var measurementId = measurement.get('m_id');
          var url = '#edit_measurement/' + measurementId;
          router.navigate(url, {trigger:true});
        }
      });
    }
    else {
      var self = this;
      var measurementDetails = $(ev.currentTarget).serializeJSON();
      this.model.save(measurementDetails, {
        success:function() {
          var userId = self.model.get('user_id');
          var measurementId = self.model.get('m_id');
          router.navigate('/user/' + userId + '/edit_measurement/' 
            + measurementId + '/headInfo', {trigger:true});
        }
      });
    }
    return false; //stop the default behaviour of form.
  }
});

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

function loadUser(userId, options) {
  var userModel = new UserModel();
  userModel.url = '/api/v1/users/' + userId;
  userModel.fetch(options);
}

//router
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

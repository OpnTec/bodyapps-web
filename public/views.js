/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/**
 * Views for frontend application.
 */

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
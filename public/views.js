/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/**
 * Views for frontend application.
 */

var MeasurementListView = Backbone.View.extend({

  el: '#container',
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

  events: {
    'click #delete-measurement': 'delete'
  },

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.remove.bind(this));
  },

  render: function(options) {
    this.$el.html(this.template({measurement: this.model.toJSON()}));
    return this;
  },

  delete: function(e) {
    e.preventDefault();
    this.model.destroy();
  }
});

var MeasurementMasterView = Backbone.View.extend({

  el: '#container',
  template: _.template($('#measurement-master').html()),
  model: null,
  measurementPane: null,
  bodyvizPane: null,

  render: function() {
    this.$el.html(this.template());
    this.measurementPane = this.$('#measurement-pane');
    this.bodyvizPane = this.$('#bodyviz-pane');
    new BodyVizView({el: this.bodyvizPane, model: this.model}).render();
    new MeasurementView({el: this.measurementPane, model: this.model}).render();
    return this;
  }
});

var MeasurementView = Backbone.View.extend({

  tagName: 'div',
  contentPane: null,
  currentView: null,

  initialize: function() {
    // Order in which editors are shown when using apply-button
    this.sequence = [
      MeasurementHomeView,
      // EditHeadView,
      EditNeckView,
      EditShoulderView,
      EditChestView,
      EditArmView,
      // EditHandView,
      EditHipNwaistView,
      EditLegView,
      // EditFootView,
      // EditTrunkView,
      EditHeightsView
    ]
  },

  render: function(){
    this.$el.html("<div id=\"content-pane\"></div>");
    this.contentPane = this.$('#content-pane');
    return this.next();
  },

  next: function(current) {    
    var viewClass = this._getNextView(current);
    return this.switchTo(viewClass);
  },

  switchTo: function(viewClass) {
    var options = {
      model: this.model,
      parent: this
    }
    if (this.currentView) {
      this.currentView.remove();
    }
    this.currentView = (new viewClass(options));
    this.contentPane.html(this.currentView.render().el);
    return this;
  },

  _getNextView: function(current) {
    var currentIdx, nextIdx;
    currentIdx = this.sequence.indexOf(current);
    if (currentIdx < 0) return this.sequence[0];
    nextIdx = (currentIdx + 1) % this.sequence.length;
    return this.sequence[nextIdx];
  }
});

var MeasurementHomeView = Backbone.View.extend({

  parent: null,
  tagName: 'div',
  template: _.template($('#measurement-home').html()),

  events: {
    'click #edit-head': 'editHead',
    'click #edit-neck': 'editNeck',
    'click #edit-shoulder': 'editShoulders',
    'click #edit-chest': 'editChest',
    'click #edit-arm': 'editArm',
    'click #edit-hand': 'editHand',
    'click #edit-waist': 'editHipNWaist',
    'click #edit-leg': 'editLeg',
    'click #edit-foot': 'editFoot',
    'click #edit-trunk': 'editTrunk',
    'click #edit-heights': 'editHeights'
  },

  initialize: function(options) {
    this.parent = options.parent;
  },

  render: function() {
    this.$el.html(this.template({
      user_id: user.get('id'),
      m_id: this.model.get('m_id')
    }));
    return this;
  },

  editHead: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditHeadView);
  },

  editNeck: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditNeckView);
  },

  editShoulders: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditShoulderView);
  },

  editChest: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditChestView);
  },

  editArm: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditArmView);
  },

  editHand: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditHandView);
  },

  editHipNWaist: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditHipNwaistView);
  },

  editLeg: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditLegView);
  },

  editFoot: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditFootView);
  },

  editTrunk: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditTrunkView);
  },

  editHeights: function(e) {
    e.preventDefault();
    this.parent.switchTo(EditHeightsView);
  }
});



/**
 * Base view for all measurement editors. Renders the form for given measurement set and contains
 * the required logic to save the record to the server.
 */
var EditMeasurementBaseView = Backbone.View.extend({
  tagName: 'div',
  parent: null,

  toolbarTemplate:_.template($('#toolbar-template').html()),

  events: {
    'click #btn-back': 'back',
    'click #btn-save': 'save',
    'click #btn-save-continue': 'saveContinue'
  },

  initialize: function(options) {
    this.parent = options.parent;
  },

  render: function() {
    this.$el.html(this.template({ measurement: this.model.toJSON() })).find('form').
      prepend(this.toolbarTemplate);
    return this;
  },

  saveContinue: function(ev) {
    ev.preventDefault();
    var measurementDetails = this.$('form').serializeJSON();
    this.$('#btn-submit').text('Saving...').attr('disabled', 'disabled');
    this.model.save(measurementDetails, {success: this.next.bind(this)});
  },

  save: function(ev) {
    ev.preventDefault();
    var measurementDetails = this.$('form').serializeJSON();
    this.$('#btn-save').text('Saving...');
    this.model.save(measurementDetails, {
      success: function() {
        this.$('#btn-save').text('Save');
      }
    }).bind(this);
  },

  next: function() {
    this.parent.next(this.constructor);
  },

  back: function() {
    this.parent.switchTo(MeasurementHomeView);
  }
});

var EditHeadView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-headInfo').html())
});

var EditNeckView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-neckInfo').html())
});

var EditShoulderView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-shoulderInfo').html())
});

var EditChestView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-chestInfo').html())
});

var EditArmView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-armInfo').html())
});

var EditHandView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-handInfo').html())
});

var EditHipNwaistView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-hipNwaistInfo').html())
});

var EditLegView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-legInfo').html())
});

var EditFootView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-footInfo').html())
});

var EditTrunkView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-trunkInfo').html())
});

var EditHeightsView = EditMeasurementBaseView.extend({
  template: _.template($('#edit-measurement-heightsInfo').html())
});

var CreateMeasurementView = Backbone.View.extend({

  el:'#container',
  template: _.template($('#create-measurement').html()),
  model: null,
  $form: null,

  initialize: function() {
    _.bindAll(this, 'render', 'save');
    this.model = new MeasurementModel();
  },

  render: function() {
    var userId = user.get('id');
    this.$el.html(this.template({
      user_id: userId,
      measurement: this.model
    }));
    this.$form = this.$('form');
    this.$form.submit(this.save);
    return this;
  },

  save: function(ev) {
    ev.preventDefault();
    var measurementDetails = this.$form.serializeJSON();
    // var measurement = new MeasurementModel();
    this.model.url = '/api/v1/users/' + user.get('id') + '/measurements';
    this.model.save(measurementDetails, {
      type: 'post',
      success: function() {
        var measurementId = this.model.get('m_id');
        var url = '#measurement/' + measurementId;
        window.location.hash = url;
      }.bind(this)
    });
  }
});

var BodyVizView = Backbone.View.extend({

  model: null,
  bodyviz: null,

  initialize: function(options) {
    if (this.model) {
      this.model.on('change', this._updateVizFrame.bind(this));
    }
  },

  render: function() {
    this.bodyviz = this.$el.bodyviz();
    this._updateVizFrame();
    return this;
  },

  _updateVizFrame: function() {
    var morphs = this.model.toMorphArray();
    console.log(morphs);
    this.bodyviz.update(morphs);
  }  
});

var WelcomeView = Backbone.View.extend({

  el:'#container',

  template: _.template($('#welcome-message').html()),

  render:function() {
    this.$el.html(this.template({user: user.toJSON()}));
    return this;
  }
});

var LoginView = Backbone.View.extend({

  el:'#container',

  template: _.template($('#login-view').html()),

  render:function() {
    this.$el.html(this.template());
    return this;
  }
});

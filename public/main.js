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

var MeasurementModel = Backbone.Model.extend({
    defaults: {
    data : {
      m_id: '',
      m_unit: '',
      m_timestamp: '',
      mid_neck_girth : '',
      bust_girth : '',
      waist_girth : '',
      hip_girth : '',
      across_back_shoulder_width : '',
      shoulder_drop : '',
      shoulder_slope_degrees :'',
      arm_length : '',
      wrist_girth : '',
      upper_arm_girth : '',
      armscye_girth : '',
      height : '',
      hip_height :'',
      person : {
        name: '',
        email_id:'',
        gender:'',
        dob:''
      },
      user_id :''
    }
    }
  });

var Measurements = Backbone.Collection.extend({
  model:MeasurementModel,
});

var MeasurementListView = Backbone.View.extend({
  el:'tbody',

  initialize: function () {
     this.collection.bind('change', this.render, this);
  },

  render:function(options) {
    var that = this;
    if(options.id){
      var url = 'http://localhost:3000/users/' + options.id + '/measurements';
      this.collection.url = url;
      this.collection.fetch({
        success:function(records){
          records.each(function(ms) {
            var mview = new MeasurementView({model:ms});
            that.$el.append(mview.render().el);
          })
        that.$el.html();
        }
      })
      return that;
    }
  }
});

var MeasurementView = Backbone.View.extend({
  tagName:'tr',
  template: _.template($('#measurement-list').html()),

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});

var UserModel = Backbone.Model.extend({
  defaults:{
    name: 'vis',
    age: '22',
    email: 'vishv1brahmbhatt@yahoo.com',
    dob: '12/10/1990'
  },urlRoot = 'http://localhost:3000/users/'
});

var UserView = Backbone.View.extend({
tagName:'li',

template: _.template($('#user-name').html()),

initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

render : function(options){
  var that = this;
  var url = this.model.urlRoot;
  this.model.urlRoot = url + options.id;
  this.model.fetch({
    success:function(user){
      that.$el.html(this.template(user.toJSON());
    }
  });
  return that;
}
});

var Router = Backbone.Router.extend({
  routes: {
    'homeuser/:id' : 'userhome',
    'user/:id' : 'user'
  }
});

var measurements = new Measurements();
var measurementListView = new MeasurementListView({collection:measurements});

var userModel = new UserModel();
var userView = new UserView({model:userModel});
var router = new Router();

router.on('route:userhome',function(id){
  $('#user-info').append(userView.render({id: id}).el);
  console.log("on userhome");
});

router.on('route:user',function(id){
  measurementListView.render({id: id});
  console.log("on routerhome");
});

Backbone.history.start();

var MeasurementModel = Backbone.Model.extend({
    defaults: {
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
    person_name: '',
    person_email_id:'',
    person_gender:'',    
    person_dob:'',
    user_id :''
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
      var url = 'http://localhost:8020/user/' + options.id + '/measurements';
      this.collection.url = url;
      this.collection.fetch({
        success:function(records){
          records.each(function(ms) {
            var mview = new MeasurementView({model:ms});
            that.$el.append(mview.render().el);
          });
        that.$el.html();
        }
      });
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

var Router = Backbone.Router.extend({
  routes: {
    'user/:id' : 'user'
  }
});

var measurements = new Measurements();
var measurementListView = new MeasurementListView({collection:measurements});

var router = new Router();

router.on('route:user',function(id){
  measurementListView.render({id: id});
});

Backbone.history.start();

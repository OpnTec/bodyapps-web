/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

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

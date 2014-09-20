/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/**
 * Backbone model represeting a single measurement set.
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

  /**
   * Server will return resources wrapped into a `data` element, we need to override `parse` to 
   * extract the fields correctly.
   */
  parse : function(resp, xhr) {
    return resp.data;
  },

  /**
   * Extracts the attributes of this models into an array of measurement points that can be used
   * by the body vizualizer. See bodyapps-viz/models/testconfig.json for details.
   *
   * Order of fields returned: 
   * 0: height
   * 1: upper_chest_girth
   * 2: mid_neck_girth
   * 3: neck_to_bustpoint
   * 4: shoulder_girth
   * 5: shoulder_slope_degree
   * 6: bust_girth,
   * 7: stomach_shape,
   * 8: waist_girth,
   * 9: arm_length,
   * 10: upper_arm_girth,
   * 11: wrist_girth,
   * 12: hip_girth,
   * 13: hip_height,
   * 14: thigh_girth,
   * 15: lower_leg_length,
   * 16: calf_girth,
   * 
   * @return {Array}
   */
  toMorphArray: function() {
    // Defaults used by the vizualizer:
    // [160,96.67,37,12.36,13.07,1,86,1,76.66,26,15,16,112,36,42,38,55];
    return [
      parseFloat(this.get('height')) || 160,
      parseFloat(this.get('upper_chest_girth')) || 96.67,
      parseFloat(this.get('mid_neck_girth')) || 37,
      parseFloat(this.get('neck_to_bustpoint')) || 12.36,
      parseFloat(this.get('shoulder_girth')) || 13.07,
      parseFloat(this.get('shoulder_slope_degree')) || 1,
      parseFloat(this.get('bust_girth')) || 86,
      1, // parseFloat(this.get('stomach_shape')), // missing?
      76.66, // parseFloat(this.get('waist_girth')), // missing?
      parseFloat(this.get('arm_length')) || 26,
      parseFloat(this.get('upper_arm_girth')) || 15,
      parseFloat(this.get('wrist_girth')) || 16,
      parseFloat(this.get('hip_girth')) || 112,
      parseFloat(this.get('hip_height')) || 36,
      parseFloat(this.get('thigh_girth')) || 42,
      parseFloat(this.get('knee_height')) || 38, // lower leg length? 
      parseFloat(this.get('calf_girt')) || 55
    ]
  }
});

/**
 * Backbone model representing a system user. There's no collection for users so far, since we're
 * only interested in the currently logged in user.
 */
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

/**
 * Collection of measurements.
 */
var Measurements = Backbone.Collection.extend({
  model:MeasurementModel,
});

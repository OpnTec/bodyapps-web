/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
*/

/*
 * Router for 'Measurement' resource. 
 * 
 * It handles the request of (1)Finding a measurement record of user.
 * (2)Providing a list of measurement records.(3)Creating a measurement
 * record.
 */

var Measurement = require('../models/measurement');

exports.findMeasurementRecords = function(req, res, next) {
  var userid = req.params.user_id;

  Measurement.find({ user_id: userid}, function(err, docs) {
    if(err) return next(err);
    var measurementList = [];
    docs.forEach(function(doc) {
    var measurementRecord = {
      data :{
        m_id : doc.m_id,
        m_unit: doc.m_unit,
        mid_neck_girth : doc.mid_neck_girth,
        bust_girth :doc.bust_girth,
        waist_girth : doc.waist_girth, 
        hip_girth : doc.hip_girth,
        across_back_shoulder_width : doc.across_back_shoulder_width, 
        shoulder_drop : doc. shoulder_drop,
        shoulder_slope_degrees : doc.shoulder_slope_degrees, 
        arm_length : doc.arm_length,
        wrist_girth : doc.wrist_girth,
        upper_arm_girth : doc.upper_arm_girth, 
        armscye_girth : doc.armscye_girth,
        height : doc.height,
        hip_height :doc.hip_height, 
        user_id : doc.user_id,
        person:{
          name: doc.person.name, 
          email:doc.person.email,
          dob: doc.person.dob
        }
      }
    };
    measurementList.push(measurementRecord);
    });
    return res.json(measurementList);
  })
}

exports.findMeasurementRecord = function(req, res) {
  var id = req.params.measurement_id;

  Measurement.findOne({ m_id: id}, function(err, doc) {
    if(err)  return next(err);
    if(doc) {
      var measurementRecord = {
        data :{
          m_id : doc.m_id,
          m_unit: doc.m_unit,
          mid_neck_girth : doc.mid_neck_girth,
          bust_girth :doc.bust_girth,
          waist_girth : doc.waist_girth, 
          hip_girth : doc.hip_girth,
          across_back_shoulder_width : doc.across_back_shoulder_width, 
          shoulder_drop : doc. shoulder_drop,
          shoulder_slope_degrees : doc.shoulder_slope_degrees, 
          arm_length : doc.arm_length,
          wrist_girth : doc.wrist_girth,
          upper_arm_girth : doc.upper_arm_girth, 
          armscye_girth : doc.armscye_girth,
          height : doc.height,
          hip_height :doc.hip_height, 
          user_id : doc.user_id,
          person:{
          name: doc.person.name, 
          email:doc.person.email,
          dob: doc.person.dob
          }
        }
      };
    return res.json(measurementRecord);
    }
    return res.json(404, {measurement:null});
  })
}

exports.insertMeasurementRecord = function(req, res) {
  var body = req.body;

  Measurement.create(body, function(err, doc) {
    var measurementRecord = {
      data :{
        m_id : doc.m_id,
        m_unit: doc.m_unit,
        mid_neck_girth : doc.mid_neck_girth,
        bust_girth :doc.bust_girth,
        waist_girth : doc.waist_girth, 
        hip_girth : doc.hip_girth,
        across_back_shoulder_width : doc.across_back_shoulder_width, 
        shoulder_drop : doc. shoulder_drop,
        shoulder_slope_degrees : doc.shoulder_slope_degrees, 
        arm_length : doc.arm_length,
        wrist_girth : doc.wrist_girth,
        upper_arm_girth : doc.upper_arm_girth, 
        armscye_girth : doc.armscye_girth,
        height : doc.height,
        hip_height :doc.hip_height, 
        user_id : doc.user_id,
        person:{
        name: doc.person.name, 
        email:doc.person.email,
        dob: doc.person.dob
       }
      }
    };
  return res.json(201,measurementRecord);
  })
}

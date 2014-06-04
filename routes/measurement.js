var model = require('../models/measurement');

exports.findMeasurementRecords = function(req, res,next) {
  var userid = req.params.user_id;
  console.log('Retrieving all measurement: ' + userid);
  model.measurementModel.find({ user_id: userid}, function(err,user) {
    if(err) return next(err);
    res.send(user);
  })
}

exports.findMeasurementRecord = function(req, res) {
  var id = req.params.measurement_id;
  console.log('Retrieving a measurement: ' + id);
  model.measurementModel.find({ m_id: id}, function(err,user) {
    if(err) return handleError(err);
    res.send(user);
  })
}

exports.insertMeasurementRecord = function(req, res) {
  var body = req.body;
  model.measurementModel.create(body, function(err, doc) {
    if(err) return next(err)
    res.send(doc.m_id);
    console.log(body);
    })
}
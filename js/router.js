var model = require('./models');

// var S = require('string'); // will be using this 'string' module for string manipulations

exports.insertUser = function (req, res, next) {
		var body = req.body;
		var email = body.emailId;
		model.userModel.findOne({ emailId: email}, function(err,user) {
		if(user) return res.send("already exist");
		model.userModel.create( body, function (err, doc) {
			if (err) return next(err);
			res.send(doc);
		})
	})
}

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
	model.measurementModel.create(body, function(err, doc) {
			if(err) return next(err)
				res.send(doc);
				console.log(body);
		})
}
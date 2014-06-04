var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var uri = 'mongodb://localhost/mongoose-shared-connection'; //temporary assigned location for mongoose
global.db = mongoose.createConnection(uri);

var userRoutes = require('./routes/user');
var measurementRoutes = require('./routes/measurement');

var app = express();
app.use(bodyParser());

app.post('/user/measurements', measurementRoutes.insertMeasurementRecord);
app.get('/user/:user_id/measurements', measurementRoutes.findMeasurementRecords); // this one requires some modifications, will be pushing the changes soon
app.get('/user/:user_id/measurements/:measurement_id', measurementRoutes.findMeasurementRecord);
app.post('/user', userRoutes.insertUser);

app.listen(8020, function () {
	console.log('listening on http://localhost:8020');
});

module.exports.server = app;
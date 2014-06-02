var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var uri = 'mongodb://localhost/mongoose-shared-connection'; //temporary assigned location for mongoose
global.db = mongoose.createConnection(uri);

var routes = require('./router');

var app = express();
app.use(bodyParser());

app.post('/user/measurements', routes.insertMeasurementRecord);
app.get('/user/:user_id/measurements', routes.findMeasurementRecords); // this one requires some modifications, will be pushing the changes soon
app.get('/user/:user_id/measurements/:measurement_id', routes.findMeasurementRecord);
app.post('/user', routes.insertUser);

app.listen(8020, function () {
  console.log('listening on http://localhost:8020');
});

module.exports.server = app;
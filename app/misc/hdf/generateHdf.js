/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
*/

/*
 * Function to generate HDF from 'Measurement' and 'User' resource.
 * 
 * It takes user and measurement records as input. And generates 'zip' file
 * having the details for HDF export.
 */

var Image = require('../../models/image');
var hdfBuilder = require('./hdfBuilder');
var async = require('async');
var archiver = require('archiver');

module.exports = function generateHdf(user, measurement, callbackFunction) {
  var zip = archiver('zip');
  var fileNameList = [];

  if(measurement.images.length!=0) {
    async.each(measurement.images, function(image, callback) {
      Image.findOne({ _id: image.idref}, function(err, doc) {
        if(err) callbackFunction(err);
        var fileName = 'pictures/'+ image.idref + '.' + image.type;
        zip.append(doc.binary_data, {name: fileName});
        fileNameList.push(fileName);
        callback();
      });
    },
      function(err) {
        if(err) callbackFunction(err);
        var xmlDoc = hdfBuilder.xmlString(measurement, user, fileNameList);

        zip.append(new Buffer(xmlDoc), {name:'hdf.xml'});
        callbackFunction(null, zip);
        zip.finalize();
      }
    )
  }
  else {
    var xmlDoc = hdfBuilder.xmlString(measurement, user, fileNameList);

    zip.append(new Buffer(xmlDoc), {name:'hdf.xml'});
    callbackFunction(null, zip);
    zip.finalize();
  }
}

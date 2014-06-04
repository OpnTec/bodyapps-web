var Schema = require('mongoose').Schema;

var User = new Schema({
  name: String
  ,dob: { type: Date}
  ,age: Number
  ,email_id: String
});

exports.userModel = db.model('userModel', User);
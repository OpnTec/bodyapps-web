var model = require('../models/user');

exports.insertUser = function (req, res, next) {
  var body = req.body;
  var email = body.email_id;
  model.userModel.findOne({ email_id: email}, function(err,user) {
  if(user) return res.send(user._id); //before it was a token ,"already exist"
  model.userModel.create( body, function (err, doc) {
    if (err) return next(err);
    res.send(doc._id);
    console.log(doc._id);
    })
  })
}
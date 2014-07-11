var app = require('../../app.js');
var passport = require('../../app/passport');
var User = require('../../app/models/user');
var expect = require('chai').expect;
var sinon = require('sinon');

describe('Passport', function() {

  var user;

  beforeEach(function(done) {

    User.find().remove(function(err) {
      user = new User();
      user.name = 'John Doe';
      user.email = 'john.doe@acme.org';
      user.save(done);
    });
  });

  describe('authCheck', function() {

    // Simplest case: test if authCheck returns the existing user
    it('should return existing user', function(done) {
      passport.authCheck('john.doe@acme.org', {}, function(err, result) {
        if (err) return done(err);
        expect(result).not.to.be.undefined;
        expect(result).not.to.be.null;
        expect(result._id).to.eql(user._id);
        done();
      });
    });

    // Test if error handling works 
    it('should callback an error if model yields error', function(done) {
      var err = Error('Boh!');
      // We use Sinon to simulate an error response from the model layer
      sinon.stub(User, 'findOne').yields(err);
      passport.authCheck('john.doe@acme.org', {}, function(err, result) {
        expect(err).to.equal(err);
        User.findOne.restore(); // Don't forget to 'reset' the stubbed model
        done();
      });
    });

    // Test if a user will be created when no user with that email already exists
    it('create a new user if it does not exist', function(done) {
      var email = 'jane.doe@example.org';
      var profile = {
        emails: [{value: email}],
        displayName: 'Jane Doe'
      };

      passport.authCheck(email, profile, function(err, result) {
        if (err) return done(err);
        expect(result).to.be.ok;

        // If everything worked we should have a user with that email now.
        User.findOne({email: email}, function(err, _user) {
          if (err) return done(err);
          expect(_user).to.be.ok;
          expect(_user.email).to.equal(email);
          expect(_user.name).to.equal(profile.displayName);
          done();
        })
      });
    });

  });

  describe('serializeUser', function() {

    it('should yield the user id', function(done) {
      passport.serializeUser(user, function(err, result) {
        if (err) return done(err);
        expect(result).not.to.be.undefined;
        expect(result).not.to.be.null;
        expect(result).to.eql(user._id);
        done();
      });
    })
  });

  describe('deserializeUser', function() {

    it('should find an existing user', function(done) {
      passport.deserializeUser(user._id, function(err, result) {
        if (err) return done(err);
        expect(result).not.to.be.undefined;
        expect(result).not.to.be.null;
        expect(result.name).to.eql(user.name);
        expect(result.email).to.eql(user.email);
        done();
      });
    });

    it('should yield an error if user was not found', function(done) {
      var err = Error('user not found');

      sinon.stub(User, 'findById').yields(err);
      passport.deserializeUser(user._id, function(err, result) {
        expect(err).to.equal(err);
        User.findById.restore();
        done();
      });
    });
  });

});

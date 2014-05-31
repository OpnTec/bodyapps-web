var request = require('supertest')
    , express = require('express');

  var app = require('../js/server.js').server;

  describe('GET / all the measurements', function(){
    it('respond with plain text', function(done){
      request(app)
        .get('/user/:user_id/measurements')
        .expect(200, done);
    })
  })

    describe('GET / a measurement record', function(){
    it('respond with plain text', function(done){
      request(app)
        .get('/user/:user_id/measurements/:measurement_id')
        .expect(200, done);
    })
  })

	describe("POST test with supertest", function (){
	it("posts a new user to /user", function(done){
    	var user = { name: "vishv2", age: "22", dob:"12/10/1990", emailId:"vishv1brahmbhatt@yahoo.com"};
		request("http://localhost:8020")
		.post("/user")
		.send(user)
		.expect(200)
		.expect("already exist", done); // Some modifications are required here
  });
});
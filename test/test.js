var request = require('supertest')
    , express = require('express');

  var app = require('../js/server.js').server;

  describe('GET / all the measurements', function(){
    it('respond with plain text', function(done){
      request(app)
        .get('/user/:user_id/measurements')
        .expect('Content-Type', /json/)
        .expect(200, done);
    })
  })

    describe('GET / a measurement record', function(){
    it('respond with plain text', function(done){
      request(app)
        .get('/user/:user_id/measurements/:measurement_id')
        .expect('Content-Type', /json/)
        .expect(200, done);
    })
  })

	describe("POST test with supertest", function (){
	it("posts a new user to /user", function(done){
    var user = { name: "vishv2", age: "22", dob:"12/10/1990", emailId:"vishv6brahmbhatt@yahoo.com"};
  	request("http://localhost:8020")
  	.post("/user")
  	.send(user)
  	.expect(200)
  	.expect("already exist", done); // Some modifications are required here
  })
})

  describe("POST test with supertest", function (){
  it("posts a new user to /user/:user_id/measurements", function(done){
    var measurement = { "m_unit": "cm", "mid_neck_girth" : "10", "bust__girth" :"10", "waist_girth" : "10", 
    "hip_girth" : "10", "across_back_shoulder_width" : "10", "shoulder_drop" : "10", 
    "shoulder_slope_degrees" :"10", "arm_length" :"10", "wrist_girth" : "10", "upper_arm_girth" : "10", 
    "armscye_girth" : "10", "height" : "10", "hip_height" :"10", "user_id" : "5388eca27e87d361063e7dc4", 
    "person.name": "San", "person.emailId":"san@hotmail.com", "person.dob": "12/10/1990"};
    request("http://localhost:8020")
    .post("/user/:user_id/measurements")
    .send(measurement)
    .expect(200,done); //few assertion checks are left in REST calls
  });
});
/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Testing of the bodyapps backend services.
 * It test every type of REST calls associated
 * with the backend
 */

var request = require('supertest');
var express = require('express');

var app = require('../server.js');

  describe('GET / all the measurements', function(){
    it('respond with users all measurements', function(done){
      request(app)
        .get('/user/:user_id/measurements')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
  });

    describe('GET / a measurement record', function(){
    it('respond with a measurement record', function(done){
      request(app)
        .get('/user/:user_id/measurements/:measurement_id')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
  });

  describe("POST / a user", function (){
  it("creates a new user via /user", function(done){
    var user = { name: "vishv2", age: "22", dob:"12/10/1990",
      email:"vishv6brahmbhatt@yahoo.com"};
    request("http://localhost:3000")
    .post("/user")
    .send(user)
    .expect(200, done);
  });
});

  describe("POST / a measurement record", function (){
  it("creates a new measurement via /user/measurements", function(done){
    var measurement = { "m_unit": "cm", "mid_neck_girth" : "10", 
    "bust_girth" :"10", "waist_girth" : "10", 
    "hip_girth" : "10", "across_back_shoulder_width" : "10", 
    "shoulder_drop" : "10", "shoulder_slope_degrees" :"10", 
    "arm_length" :"10", "wrist_girth" : "10", "upper_arm_girth" : "10", 
    "armscye_girth" : "10", "height" : "10", "hip_height" :"10", 
    "user_id" : "5388eca27e87d361063e7dc4", "person.name": "San", 
    "person.email":"san@hotmail.com", "person.dob": "12/10/1990"};
    request("http://localhost:3000")
    .post("/user/measurements")
    .send(measurement)
    .expect(200, done);
  });
});

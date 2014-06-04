# bodyapps-service

Web service and web application components of #bodyapps project

## Installation Guide

* First install 'NodeJs' and 'mongoDb'in your maschine. 
* Then run 'npm install' in this directory and all the dependencies will be automatically downloaded.

## Run the server

* To start the server, run 'node server.js'

## Test

* Test file is in the 'test' directory. So you can run 'mocha test/test.js' to check the test.

## Few Curl Protocols for fast testing

* curl -i -X POST -H 'Content-Type: application/json' -d '{ "name": "vishv2", "age": "22", "dob":"12/10/1990", "email_id":"vishv1brahmbhatt@yahoo.com" }' http://localhost:8020/user

* curl -i -X POST -H 'Content-Type: application/json' -d '{"m_unit": "cm", "mid_neck_girth" : "10", "bust_girth" :"10", "waist_girth" : "10", "hip_girth" : "10", "across_back_shoulder_width" : "10", "shoulder_drop" : "10", "shoulder_slope_degrees" :"10", "arm_length" :"10", "wrist_girth" : "10", "upper_arm_girth" : "10", "armscye_girth" : "10", "height" : "10", "hip_height" :"10", "user_id" : "5388eca27e87d361063e7dc4", "person.name": "San", "person.email_id":"san@hotmail.com", "person.dob": "12/10/1990"}' http://localhost:8020/user/:user_id/measurements

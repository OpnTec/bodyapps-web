# Features
This file contains all features to be implemented during the summer 2015
###Introduction
BodyApps Service is a web based app which allows the user to take measurements and keep a track of all the measurements.Additionally the user can view the body in a 3D model which is customisable by the user.
###Issues

  - User Interface is not intuitve and user friendly.
  - The web app is not mobile first.So does not operate well with mobile users.
  - There is no help provided on taking measurements which users did not like.

The plan of action this year will be to implement following features so that more people can use the webapp.  As of now the  [webapp] looks like this.

####Features to be implemented
  - User Friendly Interaction Layer : The web app should be redesigned to be as user intutive as can be.
  - Make it mobile first so that users don't have to log in through PC.
  - Most importatnt is to provide help texts and animations for each measurement explaing to user how to take measurements.This is the main aim to increase the user base.
  - Add social media sharing and activity option so that users can share their activity on different social media platforms.
  - Login through Facebook and Twitter.Currently only Google is supported.
  
###Implementation of RealSense
[Intel RealSense] is one of the latest technologies with perceptual computing which is going to own the future.Our aim in phase II of the development is to incorporate Intel RealSense with BodyApps.This is in higher priority than phase I.

####Technology Stack 
The BodyApps has three components :
- BodyApps Web Service
- BodyApps Android App
- BodyApps 3D Visualiser

Talking about the BodyApps Web Service it is developed in complete JavaScript using NodeJs for backend and BackboneJS for front-end.However this year we are going to refactor the frontend code to AngularJS.So to summarise :
- Front End : AngularJS with Bootstrap 3 on HTML5
- Back End : NodeJS with MongoDB



[webapp]:http://freelayers.org/
[Intel RealSense]:http://www.intel.in/content/www/in/en/architecture-and-technology/realsense-overview.html


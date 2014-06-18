/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Grunt configuration file for project.
 */

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.initConfig({
    watch: {
      options: {
        serverreload: true,
      },
      express: {
        files:  ['server.js', 'app.js', 'routes/**/*', 'models/**/*'],
        tasks:  ['express:dev'],
        options: {
          spawn: true
        }
      }
    },

    express: {
      options: {
        port: process.env.PORT || 3000,
      },
      dev: {
        options: {
          script: 'server.js'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [ 'test/test.js' ]
      }
    }

  });

  grunt.registerTask('run', ['express:dev', 'watch']);
  grunt.registerTask('test', 'mochaTest');

  grunt.registerTask('default', ['run']);
};

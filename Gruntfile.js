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

    env: {
      test: {
        NODE_ENV: 'test'
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      express: {
        files:  ['server.js', 'app.js', 'app/**/*'],
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
      testUnit: {
        options: {
          reporter: 'spec'
        },
        src: ['test/unit/**/*.js']
      },
      testApi: {
        options: {
          reporter: 'spec'
        },
        src: ['test/api/**/*.js']
      }
    }

  });

  grunt.registerTask('run', ['express:dev', 'watch']);
  grunt.registerTask('test', ['env:test', 'mochaTest:testUnit']);
  grunt.registerTask('api-test', ['test', 'mochaTest:testApi']);

  grunt.registerTask('default', ['run']);
};

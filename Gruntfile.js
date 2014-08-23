/*
 * Copyright (c) 2014, Fashiontec (http://fashiontec.org)
 * Licensed under LGPL, Version 3
 */

/*
 * Grunt configuration file for project.
 */
var yaml = require('js-yaml');
var env = readEnvYml();

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.initConfig({

    env: {
      test: {
        NODE_ENV: 'test',
        LOG_LEVEL: 'error',
        GOOGLE_CLIENT_ID: '-',
        GOOGLE_CLIENT_SECRET: '-',
        MONGO_URI: 'mongodb://localhost/bodyapps-service-test'
      },

      dev: {
        NODE_ENV: 'development',
        LOG_LEVEL: 'debug',
        MONGO_URI: env.MONGO_URI,
        SMTP_USER: env.SMTP_USER,
        SMTP_PASS: env.STMP_PASS,
        GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
        MONGO_URI: 'mongodb://localhost/bodyapps-service'
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      express: {
        files:  ['server.js', 'app.js', 'app/**/*.js'],
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

  grunt.registerTask('run', ['env:dev', 'express:dev', 'watch']);
  grunt.registerTask('test', ['env:test', 'mochaTest:testUnit']);
  grunt.registerTask('api-test', ['test', 'mochaTest:testApi']);

  grunt.registerTask('s', ['run']);
  grunt.registerTask('default', ['run']);
};


function readEnvYml() {
  try {
    return yaml.load(grunt.file.read('./.env.yml'));
  } catch (e) {
    return {};
  }
}
  
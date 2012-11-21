/*globals module:true */
module.exports = function( grunt ) {
  'use strict';

  function readOptionalJSON(filepath) {
    var data = {};
    try {
      data = grunt.file.readJSON(filepath);
      grunt.verbose.write('Reading ' + filepath + '...').ok();
    } catch(e) {}
    return data;
  }

  grunt.initConfig({
    pkg: '<json:package.json>',

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      client: {
        files: { src: ['*.js', 'test/spec/*.js'] },
        options: {
          options: readOptionalJSON('.jshintrc')
        }
      }
    },

    concat: {
      dist: {
        src: ['index.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    min: {
      dist: {
        src: ['index.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    doccoh: {
      src: ['index.js']
    }
  });

  // Alias the `test` task to run the `mocha` task instead
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-doccoh');
  grunt.registerTask('test', 'mocha');
  grunt.registerTask('docs', 'doccoh');
  grunt.registerTask('build', 'concat min');
};

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    files: {
      js: {
        main: [
          'asset_resources/js/models/*.js',
          'asset_resources/js/collections/*.js',
          'asset_resources/js/views/*.js',
          'asset_resources/js/*.js'
        ],
        vendor: [
          'asset_resources/js/vendor/jquery-2.1.1.min.js',
          'asset_resources/js/vendor/underscore-min.js',
          'asset_resources/js/vendor/backbone-min.js',
          'asset_resources/js/vendor/*.js',
        ]
      },
      css: {
        main: 'asset_resources/css/main.css',
        all:  ['asset_resources/css/*.css']
      },
      less: ['asset_resources/less/*.less'],

      build: {
        lib: 'public/js/lib.min.js',
        app: 'public/js/app.min.js',
        css: 'public/css/app.css',
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      '<%= files.build.app %>': '<%= files.js.main %>'
    },

    concat: {
      options: {
        separator: ";",
        stripBanners: true
      },
      js: {
        src: '<%= files.js.vendor %>',
        dest: '<%= files.build.lib %>'
      },
      css: {
        src: '<%= files.css.all %>',
        dest: '<%= files.build.css %>'
      }
    },

    jshint: {
      options: {
        curly: true,
        eqnull: true,
        eqeqeq: true,
        boss: true,
        lastsemic: true,
        loopfunc: true,
        trailing: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true
      },
      files: ['Gruntfile.js', '<%= files.js.main %>']
    },

    less: {
      development: {
        options: {
          cleancss: true,
          compress: true,
          report: 'min'
        },
        files: {
          '<%= files.css.main %>': '<%= files.less %>'
        }
      }
    },

    copy: {
      fonts: {
        files: [
          {
            expand: true,
            cwd: 'asset_resources/fonts/',
            src: ['**/*.*'],
            dest:'public/fonts/'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            cwd: 'asset_resources/images/',
            src: ['**/*.*'],
            dest:'public/images/'
          }
        ]
      }
    },

    watch: {
      files: ['<%= files.js.main %>', '<%= files.less %>'],
      tasks: ['jshint', 'uglify', 'less', 'concat', 'copy']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-notify');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'less', 'concat', 'copy']);
  grunt.registerTask('dev', ['watch']);
};
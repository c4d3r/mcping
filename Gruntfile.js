module.exports = function(grunt) {
 
  // configure the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        cwd: 'project',
        src: [ '**' ],
        dest: 'build',
        expand: true
      },
    },
    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/assets/css/<%= pkg.name %>.min.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/assets/js/<%= pkg.name %>.min.js' ]
      },
    },
    cssmin: {
      build: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'build/assets/css/<%= pkg.name %>.min.css': [ 'build/assets/**/*.css' ]
        }
      }
    },
    uglify: {
      build: {
        options: {
          mangle: false,
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'build/assets/js/<%= pkg.name %>.min.js': [
              'build/assets/js/ServerComponent.js',
              'build/assets/js/HubComposite.js',
              'build/assets/js/Server.js',
              'build/assets/js/App.js'
          ]
        }
      }
    },
    watch: {
      stylesheets: {
        files: 'project/assets/css/*.css',
        tasks: [ 'default' ]
      },
      scripts: {
        files: 'project/assets/js/*.js',
        tasks: [ 'default' ]
      },
      copy: {
        files: [ 'project/**', '!project/assets/**/*.js', '!project/assets/**/*.css'],
        tasks: [ 'default' ]
      }
    }
  });
 
  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // define the tasks
  grunt.registerTask(
    'stylesheets', 
    'Compiles the stylesheets.', 
    [ 'cssmin', 'clean:stylesheets']
  );
  grunt.registerTask(
    'scripts', 
    'Compiles the JavaScript files.', 
    [ 'uglify', 'clean:scripts']
  );
  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'clean:build', 'copy', 'stylesheets', 'scripts' ]
  );
  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    [ 'build', 'watch' ]
  );
};
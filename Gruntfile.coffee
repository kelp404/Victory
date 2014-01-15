module.exports = (grunt) ->
    # -----------------------------------
    # Options
    # -----------------------------------
    grunt.config.init
        compass:
            site:
                options:
                    sassDir: './application/static/css'
                    cssDir: './application/static/css'
                    outputStyle: 'compressed'

        coffee:
            source:
                files:
                    './application/static/javascript/victory.js': ['./application/static/coffeescript/*.coffee']

        concat:
            css:
                src: ['./application/static/css/lib/*.css', './application/static/css/main.css']
                dest: './application/static/dist/site.min.css'
            js:
                src: ['./application/static/javascript/*.min.js']
                dest: './application/static/dist/site.min.js'

        uglify:
            options:
                mangle: no
                compress: no
            data:
                files:
                    './application/static/javascript/victory.min.js': './application/static/javascript/victory.js'

        watch:
            compass:
                files: ['./application/static/css/**/*.scss']
                tasks: ['compass', 'concat:css']
                options:
                    spawn: no
            coffee:
                files: ['./application/static/coffeescript/*.coffee']
                tasks: ['coffee', 'uglify', 'concat:js']
                options:
                    spawn: no

    # -----------------------------------
    # register task
    # -----------------------------------
    grunt.registerTask 'dev', ['watch']

    # -----------------------------------
    # Plugins
    # -----------------------------------
    grunt.loadNpmTasks 'grunt-contrib-compass'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
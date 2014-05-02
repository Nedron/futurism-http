'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-shell');


    // Define the configuration for all the tasks
    grunt.initConfig({


        // Auto restart the server when a file changes
        nodemon: {
            dev: {
                script: 'testServer.js'
            },
            options: {
                watch: [
                    'fns/**/*.js',
                    'middleware/**/*.js',
                    'models/**/*.js',
                    'multi/**/*.js',
                    'routes/**/*.js',
                    'config/**/*.js',
                    '*.js',
                    'shared/**/*.js',
                    'validators/**/*.js'
                ]
            }
        },


        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'gruntfile.js',
                'fns/**/*.js',
                'midleware/**/*.js',
                'routes/**/*.js',
                'validators/**/*.js'
            ],
            test: {
                options: {
                    jshintrc: 'spec/.jshintrc'
                },
                src: ['spec/**/*.js']
            }
        },


        // Copy in client files before upload
        // the directories are odd to work around this bug: https://github.com/gruntjs/grunt-contrib-copy/issues/156
        copy: {
            client: {
                files: [
                    {
                        expand: true,
                        src: ['./**'],
                        dest: '../futurism-http/client/',
                        cwd: '../futurism-client/dist',
                    },
                ]
            }
        },
        
        
        // Delete the client files when we're done with them
        clean: [
            'client'
        ],
        
        
        // Shell commands
        shell: {
            
            // build an optimized version of the client
            clientBuild: {
                command: 'grunt build',
                options: {
                    execOptions: {
                        cwd: '../futurism-client'
                    }
                }
            },
            
            // deploy to a staging server
            deploy: {
                command: 'modulus deploy --project-name futurism-http-staging',
            },
            
            // deploy to a production server
            deployLive: {
                command: 'modulus deploy --project-name futurism-http',
            }
        }

    });



    grunt.registerTask('serve', function () {
        grunt.task.run([
            'nodemon'
        ]);
    });


    grunt.registerTask('jshint', function () {
        grunt.task.run([
            'jshint:all'
        ]);
    });


    grunt.registerTask('build', function () {
        grunt.task.run([
            'shell:clientBuild',
            'copy:client'
        ]);
    });


    grunt.registerTask('deploy', function () {
        grunt.task.run([
            //'jshint:all', //broken for some reason
            'shell:clientBuild',
            'copy:client',
            'shell:deploy',
            'clean'
        ]);
    });
    
    
    grunt.registerTask('deployLive', function () {
        grunt.task.run([
            //'jshint:all', //broken for some reason
            'shell:clientBuild',
            'copy:client',
            'shell:deployLive',
            'clean'
        ]);
    });


};
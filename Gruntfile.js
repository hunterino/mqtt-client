module.exports = function (grunt) {

    grunt.initConfig({
        processhtml: {
            dist: {
                files: {
                    'mqtt-client.html': ['src/mqtt-client.html'],
                    'mqtt-client-pub.html': ['src/mqtt-client-pub.html'],
                    'mqtt-client-sub.html': ['src/mqtt-client-sub.html'],
                    'demo/demo-element.html': ['src/demo/demo-element.html'],
                    'demo/index.html': ['src/demo/index.html']
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {src: 'src/mqttws31.js', dest: 'mqttws31.js'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('dist', ['processhtml', 'copy']);

};
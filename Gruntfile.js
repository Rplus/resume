module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-grunticon');

    // Project configuration.
    grunt.initConfig({
        grunticon: {
            icons: {
                files: [{
                    expand: true,
                    cwd: "app/images/inject-svg/",
                    src: ["*.svg"],
                    dest: "app/images/inject-svg/fallbacks/"
                }],
                options: {
                    colors: "#ffffff",
                    defaultWidth: "32px",
                    defaultHeight: "32px"
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['grunticon']);
};

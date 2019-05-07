let argv = require('yargs').argv;
let bin = require('./bin');
let command = require('node-cmd');

// let BrowserSync = require('browser-sync');
// let BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');

// let browserSyncInstance;
let env = argv.e || argv.env || 'local';
let port = argv.p || argv.port || 3000;

module.exports = {
    jigsaw: {
        apply(compiler) {
            compiler.hooks.done.tap('DonePlugin', (compilation) => {
                command.get(bin.path() + ' build -q ' + env, (error, stdout, stderr) => {
                    console.log(error ? stderr : stdout);

                    // if (browserSyncInstance) {
                    //     browserSyncInstance.reload();
                    // }
                });
            });
        }
    },

    watch: function (paths) {
        return new ExtraWatchWebpackPlugin({
            files: paths,
        });
    },

    // browserSync: function (proxy) {
    //     return new BrowserSyncPlugin({
    //         notify: false,
    //         port: port,
    //         proxy: proxy,
    //         server: proxy ? null : { baseDir: 'build_' + env + '/' },
    //     },
    //     {
    //         reload: false,
    //         callback: function() {
    //             browserSyncInstance = BrowserSync.get('bs-webpack-plugin');
    //         },
    //     })
    // },
};

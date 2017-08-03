var hasbin = require('hasbin');
var fs = require('fs');

module.exports = {
    path: function() {
        if (fs.existsSync('./vendor/bin/jigsaw')) {
            return '"./vendor/bin/jigsaw"'
        }

        if (hasbin.sync('jigsaw')) {
            return 'jigsaw';
        }

        console.log('Could not find Jigsaw; please install it via Composer, either locally or globally.');

        process.exit();
    }
};

if (process.env.OXIDE) {
  module.exports = require('./oxide/postcss-plugin.js')
} else {
  module.exports = require('./plugin.js')
}

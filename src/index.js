if (process.env.OXIDE) {
  module.exports = require('./oxide/postcss-plugin')
} else {
  module.exports = require('./plugin')
}

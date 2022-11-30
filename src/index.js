if (process.env.OXIDE) {
  module.exports = require('../oxide/packages/tailwindcss/dist/postcss-plugin.js')
} else {
  module.exports = require('./plugin.js')
}

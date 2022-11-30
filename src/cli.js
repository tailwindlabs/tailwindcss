#!/usr/bin/env node

if (process.env.OXIDE) {
  module.exports = require('../oxide/packages/tailwindcss/dist/cli.js')
} else {
  module.exports = require('./cli/index.js')
}

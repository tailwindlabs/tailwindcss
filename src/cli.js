#!/usr/bin/env node

if (process.env.OXIDE) {
  module.exports = require('./oxide/cli.js')
} else {
  module.exports = require('./cli/index.js')
}

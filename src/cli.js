#!/usr/bin/env node

if (process.env.OXIDE) {
  module.exports = require('./oxide/cli')
} else {
  module.exports = require('./cli/index')
}

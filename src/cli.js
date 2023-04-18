#!/usr/bin/env node

if (__OXIDE__) {
  module.exports = require('./oxide/cli')
} else {
  module.exports = require('./cli/index')
}

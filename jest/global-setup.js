let { execSync } = require('child_process')

module.exports = function () {
  execSync('npm run generate:plugin-list')
}

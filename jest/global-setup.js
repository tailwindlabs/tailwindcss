let { execSync } = require('child_process')

module.exports = function () {
  execSync('npm run build:rust', { stdio: 'ignore' })
  execSync('npm run generate:plugin-list', { stdio: 'ignore' })
}

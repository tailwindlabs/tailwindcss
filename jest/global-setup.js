let { execSync } = require('child_process')

let state = { ran: false }
module.exports = function () {
  if (state.ran) return
  execSync('npm run build:rust', { stdio: 'ignore' })
  execSync('npm run generate:plugin-list', { stdio: 'ignore' })
  state.ran = true
}

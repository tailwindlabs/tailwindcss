const _ = require('lodash')

module.exports = function cloneNodes(nodes) {
  return _.map(nodes, node => node.clone())
}

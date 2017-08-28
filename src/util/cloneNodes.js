import _ from 'lodash'

export default function cloneNodes(nodes) {
  return _.map(nodes, node => node.clone())
}

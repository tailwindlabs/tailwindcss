import _ from 'lodash'

export default nodes => _.map(nodes, node => node.clone())

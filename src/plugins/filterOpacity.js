import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterOpacity', [['f-opacity', ['--filter-opacity']]])({ target, ...args })
  }
}

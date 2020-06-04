import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterBlur', [['f-blur', ['--filter-blur']]])({ target, ...args })
  }
}

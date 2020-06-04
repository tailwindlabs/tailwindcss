import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterInvert', [['f-invert', ['--filter-invert']]])({ target, ...args })
  }
}

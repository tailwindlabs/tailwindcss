import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterSaturate', [['f-saturate', ['--filter-saturate']]])({ target, ...args })
  }
}

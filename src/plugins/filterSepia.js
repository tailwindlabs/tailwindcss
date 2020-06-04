import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterSepia', [['f-sepia', ['--filter-sepia']]])({ target, ...args })
  }
}

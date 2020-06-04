import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterContrast', [['f-contrast', ['--filter-contrast']]])({ target, ...args })
  }
}

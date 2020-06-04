import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterBrightness', [['f-brightness', ['--filter-brightness']]])({ target, ...args })
  }
}

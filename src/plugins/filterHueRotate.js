import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterHueRotate', [['f-hue-rotate', ['--filter-hue-rotate']]])({ target, ...args })
  }
}

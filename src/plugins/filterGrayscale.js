import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    createUtilityPlugin('filterGrayscale', [['f-grayscale', ['--filter-grayscale']]])({ target, ...args })
  }
}

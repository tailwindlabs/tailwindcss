import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('placeholderOpacity', [
    ['placeholder-opacity', ['--placeholder-opacity']],
  ])
}

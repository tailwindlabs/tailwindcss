import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('divideOpacity', [['divide-opacity', ['--divide-opacity']]])
}

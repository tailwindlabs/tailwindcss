import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('borderOpacity', [['border-opacity', ['--tw-border-opacity']]])
}

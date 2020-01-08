import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('transitionProperty', [['transition', ['transitionProperty']]])
}

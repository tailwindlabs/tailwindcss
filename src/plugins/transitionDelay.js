import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('transitionDelay', [['delay', ['transitionDelay']]])
}

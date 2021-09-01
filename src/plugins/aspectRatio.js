import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('aspectRatio', [['aspect', ['aspect-ratio']]])
}

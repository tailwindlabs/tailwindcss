import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('gap', [
    ['gap', ['gap']],
    ['gap-x', ['columnGap']],
    ['gap-y', ['rowGap']],
  ])
}

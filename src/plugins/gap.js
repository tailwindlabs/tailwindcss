import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('gap', [
    ['gap', ['gridGap', 'gap']],
    ['gap-x', ['gridColumnGap', 'columnGap']],
    ['gap-y', ['gridRowGap', 'rowGap']],
  ])
}

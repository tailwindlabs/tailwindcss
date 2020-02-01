import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('gap', [
    ['gap', ['gridGap', 'gap']],
    ['col-gap', ['gridColumnGap', 'columnGap']],
    ['row-gap', ['gridRowGap', 'rowGap']],
  ])
}

import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('gap') === 'ie11') {
      return
    }

    createUtilityPlugin('gap', [
      ['gap', ['gridGap', 'gap']],
      ['col-gap', ['gridColumnGap', 'columnGap']],
      ['row-gap', ['gridRowGap', 'rowGap']],
    ])({ target, ...args })
  }
}

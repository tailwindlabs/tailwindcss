import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ config, ...args }) {
    if (config('target') === 'ie11') {
      return
    }

    createUtilityPlugin('gap', [
      ['gap', ['gridGap', 'gap']],
      ['col-gap', ['gridColumnGap', 'columnGap']],
      ['row-gap', ['gridRowGap', 'rowGap']],
    ])({ config, ...args })
  }
}

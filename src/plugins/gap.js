import createUtilityPlugin from '../util/createUtilityPlugin'
import { flagEnabled } from '../featureFlags'

export default function() {
  return function({ target, config, ...args }) {
    if (target('gap') === 'ie11') {
      return
    }

    if (flagEnabled(config(), 'removeDeprecatedGapUtilities')) {
      createUtilityPlugin('gap', [
        ['gap', ['gridGap', 'gap']],
        ['gap-x', ['gridColumnGap', 'columnGap']],
        ['gap-y', ['gridRowGap', 'rowGap']],
      ])({ target, config, ...args })
    } else {
      createUtilityPlugin('gap', [
        ['gap', ['gridGap', 'gap']],
        ['col-gap', ['gridColumnGap', 'columnGap']],
        ['gap-x', ['gridColumnGap', 'columnGap']],
        ['row-gap', ['gridRowGap', 'rowGap']],
        ['gap-y', ['gridRowGap', 'rowGap']],
      ])({ target, config, ...args })
    }
  }
}

import { flagEnabled } from '../featureFlags'

export default function () {
  return function ({ addUtilities, variants, config }) {
    addUtilities(
      {
        '.break-normal': {
          'overflow-wrap': 'normal',
          'word-break': 'normal',
        },
        '.break-words': {
          'overflow-wrap': 'break-word',
        },
        '.break-all': { 'word-break': 'break-all' },

        ...(!flagEnabled(config(), 'moveTruncateToTextOverflow')
          ? {
              '.truncate': {
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
              },
            }
          : {}),
      },
      variants('wordBreak')
    )
  }
}

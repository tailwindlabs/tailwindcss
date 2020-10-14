import { flagEnabled } from '../featureFlags'

export default function() {
  return function({ addUtilities, variants, config }) {
    addUtilities(
      {
        ...(flagEnabled(config(), 'moveTruncateToTextOverflow')
          ? {
              '.truncate': {
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
              },
            }
          : {}),
        '.overflow-ellipsis': { 'text-overflow': 'ellipsis' },
        '.overflow-clip': { 'text-overflow': 'clip' },
      },
      variants('textOverflow')
    )
  }
}

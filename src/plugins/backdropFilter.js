import postcss from 'postcss'
import parseObjectStyles from '../util/parseObjectStyles'

let baseRulesKey = Symbol()

export function addBaseSelector(memory, selector) {
  let baseRoot = memory.get(baseRulesKey)

  if (baseRoot.nodes.length === 0) {
    baseRoot.append(
      parseObjectStyles({
        [selector]: {
          '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-backdrop-filter': [
            'var(--tw-backdrop-blur)',
            'var(--tw-backdrop-brightness)',
            'var(--tw-backdrop-contrast)',
            'var(--tw-backdrop-grayscale)',
            'var(--tw-backdrop-hue-rotate)',
            'var(--tw-backdrop-invert)',
            'var(--tw-backdrop-opacity)',
            'var(--tw-backdrop-saturate)',
            'var(--tw-backdrop-sepia)',
          ].join(' '),
        },
      })
    )
  } else {
    baseRoot.nodes[0].selectors = [...baseRoot.nodes[0].selectors, selector]
  }
}
export default function () {
  return function ({ config, matchUtilities, addBase, addUtilities, variants, memory }) {
    if (config('mode') === 'jit') {
      let baseRoot = postcss.root()
      memory.set(baseRulesKey, baseRoot)
      addBase(baseRoot)

      matchUtilities(
        {
          'backdrop-filter': (value, { selector }) => {
            if (value !== 'none') {
              addBaseSelector(memory, selector)
            }

            return {
              'backdrop-filter': value,
            }
          },
        },
        {
          values: { DEFAULT: 'var(--tw-backdrop-filter)', none: 'none' },
          variants: variants('backdropFilter'),
          type: 'any',
        }
      )
    } else {
      addUtilities(
        {
          '.backdrop-filter': {
            '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
            'backdrop-filter': [
              'var(--tw-backdrop-blur)',
              'var(--tw-backdrop-brightness)',
              'var(--tw-backdrop-contrast)',
              'var(--tw-backdrop-grayscale)',
              'var(--tw-backdrop-hue-rotate)',
              'var(--tw-backdrop-invert)',
              'var(--tw-backdrop-opacity)',
              'var(--tw-backdrop-saturate)',
              'var(--tw-backdrop-sepia)',
            ].join(' '),
          },
          '.backdrop-filter-none': { 'backdrop-filter': 'none' },
        },
        variants('backdropFilter')
      )
    }
  }
}

import postcss from 'postcss'
import parseObjectStyles from '../util/parseObjectStyles'

let baseRulesKey = Symbol()

export function addBaseSelector(memory, selector) {
  let baseRoot = memory.get(baseRulesKey)

  if (baseRoot.nodes.length === 0) {
    baseRoot.append(
      parseObjectStyles({
        [selector]: {
          '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-filter': [
            'var(--tw-blur)',
            'var(--tw-brightness)',
            'var(--tw-contrast)',
            'var(--tw-grayscale)',
            'var(--tw-hue-rotate)',
            'var(--tw-invert)',
            'var(--tw-saturate)',
            'var(--tw-sepia)',
            'var(--tw-drop-shadow)',
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
          filter: (value, { selector }) => {
            if (value !== 'none') {
              addBaseSelector(memory, selector)
            }

            return {
              filter: value,
            }
          },
        },
        {
          values: { DEFAULT: 'var(--tw-filter)', none: 'none' },
          variants: variants('filter'),
          type: 'any',
        }
      )
    } else {
      addUtilities(
        {
          '.filter': {
            '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
            '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
            filter: [
              'var(--tw-blur)',
              'var(--tw-brightness)',
              'var(--tw-contrast)',
              'var(--tw-grayscale)',
              'var(--tw-hue-rotate)',
              'var(--tw-invert)',
              'var(--tw-saturate)',
              'var(--tw-sepia)',
              'var(--tw-drop-shadow)',
            ].join(' '),
          },
          '.filter-none': { filter: 'none' },
        },
        variants('filter')
      )
    }
  }
}

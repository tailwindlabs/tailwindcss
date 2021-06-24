import postcss from 'postcss'
import parseObjectStyles from '../util/parseObjectStyles'

let baseRulesKey = Symbol()

export function addBaseSelector(memory, selector) {
  let baseRoot = memory.get(baseRulesKey)

  if (baseRoot.nodes.length === 0) {
    baseRoot.append(
      parseObjectStyles({
        [selector]: {
          '--tw-translate-x': '0',
          '--tw-translate-y': '0',
          '--tw-rotate': '0',
          '--tw-skew-x': '0',
          '--tw-skew-y': '0',
          '--tw-scale-x': '1',
          '--tw-scale-y': '1',
          '--tw-transform': [
            'translateX(var(--tw-translate-x))',
            'translateY(var(--tw-translate-y))',
            'rotate(var(--tw-rotate))',
            'skewX(var(--tw-skew-x))',
            'skewY(var(--tw-skew-y))',
            'scaleX(var(--tw-scale-x))',
            'scaleY(var(--tw-scale-y))',
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
          transform: (value, { selector }) => {
            if (value !== 'none') {
              addBaseSelector(memory, selector)
            }

            return {
              transform: value,
            }
          },
        },
        {
          values: {
            DEFAULT: 'var(--tw-transform)',
            cpu: [
              'translateX(var(--tw-translate-x))',
              'translateY(var(--tw-translate-y))',
              'rotate(var(--tw-rotate))',
              'skewX(var(--tw-skew-x))',
              'skewY(var(--tw-skew-y))',
              'scaleX(var(--tw-scale-x))',
              'scaleY(var(--tw-scale-y))',
            ].join(' '),
            gpu: [
              'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)',
              'rotate(var(--tw-rotate))',
              'skewX(var(--tw-skew-x))',
              'skewY(var(--tw-skew-y))',
              'scaleX(var(--tw-scale-x))',
              'scaleY(var(--tw-scale-y))',
            ].join(' '),
            none: 'none',
          },
          variants: variants('transform'),
          type: 'any',
        }
      )
    } else {
      addUtilities(
        {
          '.transform': {
            '--tw-translate-x': '0',
            '--tw-translate-y': '0',
            '--tw-rotate': '0',
            '--tw-skew-x': '0',
            '--tw-skew-y': '0',
            '--tw-scale-x': '1',
            '--tw-scale-y': '1',
            transform: [
              'translateX(var(--tw-translate-x))',
              'translateY(var(--tw-translate-y))',
              'rotate(var(--tw-rotate))',
              'skewX(var(--tw-skew-x))',
              'skewY(var(--tw-skew-y))',
              'scaleX(var(--tw-scale-x))',
              'scaleY(var(--tw-scale-y))',
            ].join(' '),
          },
          '.transform-gpu': {
            '--tw-translate-x': '0',
            '--tw-translate-y': '0',
            '--tw-rotate': '0',
            '--tw-skew-x': '0',
            '--tw-skew-y': '0',
            '--tw-scale-x': '1',
            '--tw-scale-y': '1',
            transform: [
              'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)',
              'rotate(var(--tw-rotate))',
              'skewX(var(--tw-skew-x))',
              'skewY(var(--tw-skew-y))',
              'scaleX(var(--tw-scale-x))',
              'scaleY(var(--tw-scale-y))',
            ].join(' '),
          },
          '.transform-none': { transform: 'none' },
        },
        variants('transform')
      )
    }
  }
}

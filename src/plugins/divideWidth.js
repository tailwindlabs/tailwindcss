import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const generators = [
      (_size, modifier) => {
        const size = _size === '0' ? '0px' : _size
        return {
          [`${nameClass('divide-y', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
            '--tw-divide-y-reverse': '0',
            'border-top-width': `calc(${size} * calc(1 - var(--tw-divide-y-reverse)))`,
            'border-bottom-width': `calc(${size} * var(--tw-divide-y-reverse))`,
          },
          [`${nameClass('divide-x', modifier)} > :not([hidden]) ~ :not([hidden])`]: {
            '--tw-divide-x-reverse': '0',
            'border-right-width': `calc(${size} * var(--tw-divide-x-reverse))`,
            'border-left-width': `calc(${size} * calc(1 - var(--tw-divide-x-reverse)))`,
          },
        }
      },
    ]

    const utilities = _.flatMap(generators, (generator) => {
      return [
        ..._.flatMap(theme('divideWidth'), (value, modifier) => {
          return generator(value, modifier)
        }),
        {
          '.divide-y-reverse > :not([hidden]) ~ :not([hidden])': {
            '--tw-divide-y-reverse': '1',
          },
          '.divide-x-reverse > :not([hidden]) ~ :not([hidden])': {
            '--tw-divide-x-reverse': '1',
          },
        },
      ]
    })

    addUtilities(utilities, variants('divideWidth'))
  }
}

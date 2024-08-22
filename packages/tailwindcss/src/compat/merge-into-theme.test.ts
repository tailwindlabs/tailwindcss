import { test } from 'vitest'
import { Theme } from '../theme'
import { mergeIntoTheme } from './merge-into-theme'

test('Config values can be merged into the theme', ({ expect }) => {
  let theme = new Theme()

  mergeIntoTheme(theme, {
    colors: {
      primary: '#c0ffee',
      red: {
        500: 'red',
      },
    },

    fontSize: {
      sm: '0.875rem',
      base: [
        '1rem',
        {
          lineHeight: '1.5',
        },
      ],
    },
  })

  expect(theme.resolve('primary', ['--colors'] as any[])).toEqual('#c0ffee')
  expect(theme.resolve('red-500', ['--colors'] as any[])).toEqual('red')
  expect(theme.resolve('sm', ['--font-size'] as any[])).toEqual('0.875rem')
  expect(theme.resolve('base', ['--font-size'] as any[])).toEqual('1rem')
  expect(theme.get(['--font-size-base--line-height'] as any[])).toEqual('1.5')
})

test('Existing values are not overwritten', ({ expect }) => {
  let theme = new Theme()
  theme.add('--colors-primary', '#c0ffee')

  mergeIntoTheme(theme, {
    colors: {
      primary: '#c0ffee',
      secondary: '#bada55',
    },
  })

  expect(theme.resolve('primary', ['--colors'] as any[])).toEqual('var(--colors-primary, #c0ffee)')
  expect(theme.resolve('secondary', ['--colors'] as any[])).toEqual('#bada55')
})

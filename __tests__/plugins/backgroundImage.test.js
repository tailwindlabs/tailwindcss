import invokePlugin from '../util/invokePlugin'
import plugin from '../../src/plugins/backgroundImage'

test('it creates background-image utilities', () => {
  const config = {
    target: 'relaxed',
    theme: {
      backgroundImage: {
        hero: 'url("./hero.png")',
      },
    },
    variants: {
      backgroundImage: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.bg-hero': {
          'background-image': 'url("./hero.png")',
        },
      },
      [],
    ],
  ])
})

test('it creates background-image utilities in ie11 mode', () => {
  const config = {
    target: 'ie11',
    theme: {
      backgroundImage: {
        hero: 'url("./hero.png")',
      },
    },
    variants: {
      backgroundImage: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.bg-hero': {
          'background-image': 'url("./hero.png")',
        },
      },
      [],
    ],
  ])
})

test('it creates background-image utilities recursively', () => {
  const config = {
    target: 'relaxed',
    theme: {
      backgroundImage: {
        theme: {
          default: {
            background: {
              default: 'url("./theme-default-background.png")',
              alt: 'url("./theme-default-background-alt.png")',
            },
          },
          'not-default': {
            background: {
              default: 'url("./theme-not-default-background.png")',
              alt: 'url("./theme-not-default-background-alt.png")',
              'keep-going': {
                default: 'url("./theme-not-default-background-keep-going.png")',
                alt: 'url("./theme-not-default-background-keep-going-alt.png")',
              },
            },
          },
        },
      },
    },
    variants: {
      backgroundImage: [],
    },
  }

  const { utilities } = invokePlugin(plugin(), config)

  expect(utilities).toEqual([
    [
      {
        '.bg-theme-default-background': {
          'background-image': 'url("./theme-default-background.png")',
        },
        '.bg-theme-default-background-alt': {
          'background-image': 'url("./theme-default-background-alt.png")',
        },
        '.bg-theme-not-default-background': {
          'background-image': 'url("./theme-not-default-background.png")',
        },
        '.bg-theme-not-default-background-alt': {
          'background-image': 'url("./theme-not-default-background-alt.png")',
        },
        '.bg-theme-not-default-background-keep-going': {
          'background-image': 'url("./theme-not-default-background-keep-going.png")',
        },
        '.bg-theme-not-default-background-keep-going-alt': {
          'background-image': 'url("./theme-not-default-background-keep-going-alt.png")',
        },
      },
      [],
    ],
  ])
})

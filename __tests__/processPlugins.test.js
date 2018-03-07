import _ from 'lodash'
import postcss from 'postcss'
import processPlugins from '../src/util/processPlugins'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

function processPluginsWithValidConfig(config) {
  return processPlugins(
    _.defaultsDeep(config, {
      options: {
        prefix: '',
        important: false,
        separator: ':',
      },
    })
  )
}

test('plugins can create utilities with object syntax', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities({
          '.object-fill': {
            'object-fit': 'fill',
          },
          '.object-contain': {
            'object-fit': 'contain',
          },
          '.object-cover': {
            'object-fit': 'cover',
          },
        })
      },
    ],
  })

  expect(components.length).toBe(0)
  expect(css(utilities)).toMatchCss(`
    @variants {
      .object-fill {
        object-fit: fill
      }
      .object-contain {
        object-fit: contain
      }
      .object-cover {
        object-fit: cover
      }
    }
  `)
})

test('plugins can create utilities with arrays of objects', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities([
          {
            '.object-fill': {
              'object-fit': 'fill',
            },
          },
          {
            '.object-contain': {
              'object-fit': 'contain',
            },
          },
          {
            '.object-cover': {
              'object-fit': 'cover',
            },
          },
        ])
      },
    ],
  })

  expect(components.length).toBe(0)
  expect(css(utilities)).toMatchCss(`
    @variants {
      .object-fill {
        object-fit: fill
      }
      .object-contain {
        object-fit: contain
      }
      .object-cover {
        object-fit: cover
      }
    }
  `)
})

test('plugins can create utilities with raw PostCSS nodes', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities([
          postcss.rule({ selector: '.object-fill' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'fill',
            }),
          ]),
          postcss.rule({ selector: '.object-contain' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'contain',
            }),
          ]),
          postcss.rule({ selector: '.object-cover' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'cover',
            }),
          ]),
        ])
      },
    ],
  })

  expect(components.length).toBe(0)
  expect(css(utilities)).toMatchCss(`
    @variants {
      .object-fill {
        object-fit: fill
      }
      .object-contain {
        object-fit: contain
      }
      .object-cover {
        object-fit: cover
      }
    }
  `)
})

test('plugins can create utilities with mixed object styles and PostCSS nodes', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities([
          {
            '.object-fill': {
              objectFit: 'fill',
            },
          },
          postcss.rule({ selector: '.object-contain' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'contain',
            }),
          ]),
          postcss.rule({ selector: '.object-cover' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'cover',
            }),
          ]),
        ])
      },
    ],
  })

  expect(components.length).toBe(0)
  expect(css(utilities)).toMatchCss(`
    @variants {
      .object-fill {
        object-fit: fill
      }
      .object-contain {
        object-fit: contain
      }
      .object-cover {
        object-fit: cover
      }
    }
  `)
})

test('plugins can create utilities with variants', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities(
          {
            '.object-fill': {
              'object-fit': 'fill',
            },
            '.object-contain': {
              'object-fit': 'contain',
            },
            '.object-cover': {
              'object-fit': 'cover',
            },
          },
          ['responsive', 'hover', 'group-hover', 'focus']
        )
      },
    ],
  })

  expect(components.length).toBe(0)
  expect(css(utilities)).toMatchCss(`
    @variants responsive, hover, group-hover, focus {
      .object-fill {
        object-fit: fill
      }
      .object-contain {
        object-fit: contain
      }
      .object-cover {
        object-fit: cover
      }
    }
  `)
})

test('plugins can create components with object syntax', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents({
          '.btn-blue': {
            backgroundColor: 'blue',
            color: 'white',
            padding: '.5rem 1rem',
            borderRadius: '.25rem',
          },
          '.btn-blue:hover': {
            backgroundColor: 'darkblue',
          },
        })
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue;
      color: white;
      padding: .5rem 1rem;
      border-radius: .25rem
    }
    .btn-blue:hover {
      background-color: darkblue
    }
  `)
})

test('plugins can create components with raw PostCSS nodes', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents([
          postcss.rule({ selector: '.btn-blue' }).append([
            postcss.decl({
              prop: 'background-color',
              value: 'blue',
            }),
            postcss.decl({
              prop: 'color',
              value: 'white',
            }),
            postcss.decl({
              prop: 'padding',
              value: '.5rem 1rem',
            }),
            postcss.decl({
              prop: 'border-radius',
              value: '.25rem',
            }),
          ]),
          postcss.rule({ selector: '.btn-blue:hover' }).append([
            postcss.decl({
              prop: 'background-color',
              value: 'darkblue',
            }),
          ]),
        ])
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue;
      color: white;
      padding: .5rem 1rem;
      border-radius: .25rem
    }
    .btn-blue:hover {
      background-color: darkblue
    }
  `)
})

test('plugins can create components with mixed object styles and raw PostCSS nodes', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents([
          postcss.rule({ selector: '.btn-blue' }).append([
            postcss.decl({
              prop: 'background-color',
              value: 'blue',
            }),
            postcss.decl({
              prop: 'color',
              value: 'white',
            }),
            postcss.decl({
              prop: 'padding',
              value: '.5rem 1rem',
            }),
            postcss.decl({
              prop: 'border-radius',
              value: '.25rem',
            }),
          ]),
          {
            '.btn-blue:hover': {
              backgroundColor: 'darkblue',
            },
          },
        ])
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue;
      color: white;
      padding: .5rem 1rem;
      border-radius: .25rem
    }
    .btn-blue:hover {
      background-color: darkblue
    }
  `)
})

test('plugins can create components with media queries with object syntax', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents({
          '.container': {
            width: '100%',
          },
          '@media (min-width: 100px)': {
            '.container': {
              maxWidth: '100px',
            },
          },
          '@media (min-width: 200px)': {
            '.container': {
              maxWidth: '200px',
            },
          },
          '@media (min-width: 300px)': {
            '.container': {
              maxWidth: '300px',
            },
          },
        })
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .container {
      width: 100%
    }
    @media (min-width: 100px) {
      .container {
        max-width: 100px
      }
    }
    @media (min-width: 200px) {
      .container {
        max-width: 200px
      }
    }
    @media (min-width: 300px) {
      .container {
        max-width: 300px
      }
    }
  `)
})

test('media queries can be defined multiple times using objects-in-array syntax', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents([
          {
            '.container': {
              width: '100%',
            },
            '@media (min-width: 100px)': {
              '.container': {
                maxWidth: '100px',
              },
            },
          },
          {
            '.btn': {
              padding: '1rem .5rem',
              display: 'block',
            },
            '@media (min-width: 100px)': {
              '.btn': {
                display: 'inline-block',
              },
            },
          },
        ])
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .container {
      width: 100%
    }
    @media (min-width: 100px) {
      .container {
        max-width: 100px
      }
    }
    .btn {
      padding: 1rem .5rem;
      display: block
    }
    @media (min-width: 100px) {
      .btn {
        display: inline-block
      }
    }
  `)
})

test('plugins can create nested rules', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents({
          '.btn-blue': {
            backgroundColor: 'blue',
            color: 'white',
            padding: '.5rem 1rem',
            borderRadius: '.25rem',
            '&:hover': {
              backgroundColor: 'darkblue',
            },
            '@media (min-width: 500px)': {
              '&:hover': {
                backgroundColor: 'orange',
              },
            },
            '> a': {
              color: 'red',
            },
            'h1 &': {
              color: 'purple',
            },
          },
        })
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue;
      color: white;
      padding: .5rem 1rem;
      border-radius: .25rem;
    }
    .btn-blue:hover {
      background-color: darkblue;
    }
    @media (min-width: 500px) {
      .btn-blue:hover {
        background-color: orange;
      }
    }
    .btn-blue > a {
      color: red;
    }
    h1 .btn-blue {
      color: purple;
    }
  `)
})

test('plugins can create rules with escaped selectors', () => {
  const config = {
    plugins: [
      function({ e, addUtilities }) {
        addUtilities({
          [`.${e('top-1/4')}`]: {
            top: '25%',
          },
        })
      },
    ],
  }

  const [components, utilities] = processPluginsWithValidConfig(config)

  expect(components.length).toBe(0)
  expect(css(utilities)).toMatchCss(`
    @variants {
      .top-1\\/4 {
        top: 25%
      }
    }
  `)
})

test('plugins can access the current config', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    plugins: [
      function({ addComponents, config }) {
        const containerClasses = [
          {
            '.container': {
              width: '100%',
            },
          },
        ]

        _.forEach(config('screens'), breakpoint => {
          containerClasses.push({
            [`@media (min-width: ${breakpoint})`]: {
              '.container': { maxWidth: breakpoint },
            },
          })
        })

        // console.log(containerClasses)

        addComponents(containerClasses)
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .container {
      width: 100%
    }
    @media (min-width: 576px) {
      .container {
        max-width: 576px
      }
    }
    @media (min-width: 768px) {
      .container {
        max-width: 768px
      }
    }
    @media (min-width: 992px) {
      .container {
        max-width: 992px
      }
    }
    @media (min-width: 1200px) {
      .container {
        max-width: 1200px
      }
    }
  `)
})

test('plugins can provide fallbacks to keys missing from the config', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    borderRadius: {
      '1': '1px',
      '2': '2px',
      '4': '4px',
      '8': '8px',
    },
    plugins: [
      function({ addComponents, config }) {
        addComponents({
          '.btn': {
            borderRadius: config('borderRadius.default', '.25rem'),
          },
        })
      },
    ],
  })

  expect(utilities.length).toBe(0)
  expect(css(components)).toMatchCss(`
    .btn {
      border-radius: .25rem
    }
  `)
})

test('variants are optional when adding utilities', () => {
  const [, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities({
          '.border-collapse': {
            'border-collapse': 'collapse',
          },
        })
      },
    ],
  })

  expect(css(utilities)).toMatchCss(`
    @variants {
      .border-collapse {
        border-collapse: collapse
      }
    }
  `)
})

test('plugins can add multiple sets of utilities and components', () => {
  const [components, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities, addComponents }) {
        addComponents({
          '.card': {
            padding: '1rem',
            borderRadius: '.25rem',
          },
        })

        addUtilities({
          '.skew-12deg': {
            transform: 'skewY(-12deg)',
          },
        })

        addComponents({
          '.btn': {
            padding: '1rem .5rem',
            display: 'inline-block',
          },
        })

        addUtilities({
          '.border-collapse': {
            borderCollapse: 'collapse',
          },
        })
      },
    ],
  })

  expect(css(utilities)).toMatchCss(`
    @variants {
      .skew-12deg {
        transform: skewY(-12deg)
      }
    }
    @variants {
      .border-collapse {
        border-collapse: collapse
      }
    }
  `)
  expect(css(components)).toMatchCss(`
    .card {
      padding: 1rem;
      border-radius: .25rem
    }
    .btn {
      padding: 1rem .5rem;
      display: inline-block
    }
  `)
})

test('plugins respect prefix and important options by default when adding utilities', () => {
  const [, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities({
          '.rotate-90': {
            transform: 'rotate(90deg)',
          },
        })
      },
    ],
    options: {
      prefix: 'tw-',
      important: true,
    },
  })

  expect(css(utilities)).toMatchCss(`
    @variants {
      .tw-rotate-90 {
        transform: rotate(90deg) !important
      }
    }
  `)
})

test("component declarations respect the 'prefix' option by default", () => {
  const [components] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents({
          '.btn-blue': {
            backgroundColor: 'blue',
          },
        })
      },
    ],
    options: {
      prefix: 'tw-',
    },
  })

  expect(css(components)).toMatchCss(`
    .tw-btn-blue {
      background-color: blue
    }
  `)
})

test("component declarations can optionally ignore 'prefix' option", () => {
  const [components] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents(
          {
            '.btn-blue': {
              backgroundColor: 'blue',
            },
          },
          { respectPrefix: false }
        )
      },
    ],
    options: {
      prefix: 'tw-',
    },
  })

  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue
    }
  `)
})

test("component declarations are not affected by the 'important' option", () => {
  const [components] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents }) {
        addComponents({
          '.btn-blue': {
            backgroundColor: 'blue',
          },
        })
      },
    ],
    options: {
      important: true,
    },
  })

  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue
    }
  `)
})

test("plugins can apply the user's chosen prefix to components manually", () => {
  const [components] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents, prefix }) {
        addComponents(
          {
            [prefix('.btn-blue')]: {
              backgroundColor: 'blue',
            },
          },
          { respectPrefix: false }
        )
      },
    ],
    options: {
      prefix: 'tw-',
    },
  })

  expect(css(components)).toMatchCss(`
    .tw-btn-blue {
      background-color: blue
    }
  `)
})

test('prefix can optionally be ignored for utilities', () => {
  const [, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities(
          {
            '.rotate-90': {
              transform: 'rotate(90deg)',
            },
          },
          {
            respectPrefix: false,
          }
        )
      },
    ],
    options: {
      prefix: 'tw-',
      important: true,
    },
  })

  expect(css(utilities)).toMatchCss(`
    @variants {
      .rotate-90 {
        transform: rotate(90deg) !important
      }
    }
  `)
})

test('important can optionally be ignored for utilities', () => {
  const [, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities(
          {
            '.rotate-90': {
              transform: 'rotate(90deg)',
            },
          },
          {
            respectImportant: false,
          }
        )
      },
    ],
    options: {
      prefix: 'tw-',
      important: true,
    },
  })

  expect(css(utilities)).toMatchCss(`
    @variants {
      .tw-rotate-90 {
        transform: rotate(90deg)
      }
    }
  `)
})

test('variants can still be specified when ignoring prefix and important options', () => {
  const [, utilities] = processPluginsWithValidConfig({
    plugins: [
      function({ addUtilities }) {
        addUtilities(
          {
            '.rotate-90': {
              transform: 'rotate(90deg)',
            },
          },
          {
            variants: ['responsive', 'hover', 'focus'],
            respectImportant: false,
            respectPrefix: false,
          }
        )
      },
    ],
    options: {
      prefix: 'tw-',
      important: true,
    },
  })

  expect(css(utilities)).toMatchCss(`
    @variants responsive, hover, focus{
      .rotate-90 {
        transform: rotate(90deg)
      }
    }
  `)
})

test('prefix will prefix all classes in a selector', () => {
  const [components] = processPluginsWithValidConfig({
    plugins: [
      function({ addComponents, prefix }) {
        addComponents(
          {
            [prefix('.btn-blue .w-1\\/4 > h1.text-xl + a .bar')]: {
              backgroundColor: 'blue',
            },
          },
          { respectPrefix: false }
        )
      },
    ],
    options: {
      prefix: 'tw-',
    },
  })

  expect(css(components)).toMatchCss(`
    .tw-btn-blue .tw-w-1\\/4 > h1.tw-text-xl + a .tw-bar {
      background-color: blue
    }
  `)
})

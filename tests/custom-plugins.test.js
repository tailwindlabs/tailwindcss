import createPlugin from '../src/public/create-plugin'
import { run, html, css, defaults } from './util/run'

test('plugins can create utilities with object syntax', () => {
  let config = {
    content: [
      {
        raw: html`<div class="custom-object-fill custom-object-contain custom-object-cover"></div>`,
      },
    ],
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.custom-object-fill': {
            'object-fit': 'fill',
          },
          '.custom-object-contain': {
            'object-fit': 'contain',
          },
          '.custom-object-cover': {
            'object-fit': 'cover',
          },
        })
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-object-fill {
        object-fit: fill;
      }
      .custom-object-contain {
        object-fit: contain;
      }
      .custom-object-cover {
        object-fit: cover;
      }
    `)
  })
})

test('plugins can create utilities with arrays of objects', () => {
  let config = {
    content: [
      {
        raw: html`<div class="custom-object-fill custom-object-contain custom-object-cover"></div>`,
      },
    ],
    plugins: [
      function ({ addUtilities }) {
        addUtilities([
          {
            '.custom-object-fill': {
              'object-fit': 'fill',
            },
            '.custom-object-contain': {
              'object-fit': 'contain',
            },
            '.custom-object-cover': {
              'object-fit': 'cover',
            },
          },
        ])
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-object-fill {
        object-fit: fill;
      }
      .custom-object-contain {
        object-fit: contain;
      }
      .custom-object-cover {
        object-fit: cover;
      }
    `)
  })
})

test('plugins can create utilities with raw PostCSS nodes', () => {
  let config = {
    content: [
      {
        raw: html`<div class="custom-object-fill custom-object-contain custom-object-cover"></div>`,
      },
    ],
    plugins: [
      function ({ addUtilities, postcss }) {
        addUtilities([
          postcss.rule({ selector: '.custom-object-fill' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'fill',
            }),
          ]),
          postcss.rule({ selector: '.custom-object-contain' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'contain',
            }),
          ]),
          postcss.rule({ selector: '.custom-object-cover' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'cover',
            }),
          ]),
        ])
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-object-fill {
        object-fit: fill;
      }
      .custom-object-contain {
        object-fit: contain;
      }
      .custom-object-cover {
        object-fit: cover;
      }
    `)
  })
})

test('plugins can create utilities with mixed object styles and PostCSS nodes', () => {
  let config = {
    content: [
      {
        raw: html`<div class="custom-object-fill custom-object-contain custom-object-cover"></div>`,
      },
    ],
    plugins: [
      function ({ addUtilities, postcss }) {
        addUtilities([
          {
            '.custom-object-fill': {
              objectFit: 'fill',
            },
          },
          postcss.rule({ selector: '.custom-object-contain' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'contain',
            }),
          ]),
          postcss.rule({ selector: '.custom-object-cover' }).append([
            postcss.decl({
              prop: 'object-fit',
              value: 'cover',
            }),
          ]),
        ])
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-object-fill {
        object-fit: fill;
      }
      .custom-object-contain {
        object-fit: contain;
      }
      .custom-object-cover {
        object-fit: cover;
      }
    `)
  })
})

test('plugins can create components with object syntax', () => {
  let config = {
    content: [
      {
        raw: html`<button class="btn-blue"></button>`,
      },
    ],
    plugins: [
      function ({ addComponents }) {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .btn-blue {
        color: #fff;
        background-color: #00f;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
      }
      .btn-blue:hover {
        background-color: #00008b;
      }
    `)
  })
})

test('plugins can add base styles with object syntax', () => {
  let config = {
    content: [
      {
        raw: html`<img /><button></button>`,
      },
    ],
    plugins: [
      function ({ addBase }) {
        addBase({
          img: {
            maxWidth: '100%',
          },
          button: {
            fontFamily: 'inherit',
          },
        })
      },
    ],
    corePlugins: { preflight: false },
  }

  return run('@tailwind base', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      img {
        max-width: 100%;
      }
      button {
        font-family: inherit;
      }
      ${defaults}
    `)
  })
})

test('plugins can add base styles with raw PostCSS nodes', () => {
  let config = {
    content: [
      {
        raw: html`<img /><button></button>`,
      },
    ],
    plugins: [
      function ({ addBase, postcss }) {
        addBase([
          postcss.rule({ selector: 'img' }).append([
            postcss.decl({
              prop: 'max-width',
              value: '100%',
            }),
          ]),
          postcss.rule({ selector: 'button' }).append([
            postcss.decl({
              prop: 'font-family',
              value: 'inherit',
            }),
          ]),
        ])
      },
    ],
    corePlugins: { preflight: false },
  }

  return run('@tailwind base', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      img {
        max-width: 100%;
      }
      button {
        font-family: inherit;
      }
      ${defaults}
    `)
  })
})

test('plugins can create components with raw PostCSS nodes', () => {
  let config = {
    content: [
      {
        raw: html`<button class="btn-blue"></button>`,
      },
    ],
    plugins: [
      function ({ addComponents, postcss }) {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .btn-blue {
        color: #fff;
        background-color: #00f;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
      }
      .btn-blue:hover {
        background-color: #00008b;
      }
    `)
  })
})

test('plugins can create components with mixed object styles and raw PostCSS nodes', () => {
  let config = {
    content: [
      {
        raw: html`<button class="btn-blue"></button>`,
      },
    ],
    plugins: [
      function ({ addComponents, postcss }) {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .btn-blue {
        color: #fff;
        background-color: #00f;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
      }
      .btn-blue:hover {
        background-color: #00008b;
      }
    `)
  })
})

test('plugins can create components with media queries with object syntax', () => {
  let config = {
    content: [
      {
        raw: html`<div class="custom-container"></div>`,
      },
    ],
    plugins: [
      function ({ addComponents }) {
        addComponents({
          '.custom-container': {
            width: '100%',
          },
          '@media (min-width: 100px)': {
            '.custom-container': {
              maxWidth: '100px',
            },
          },
          '@media (min-width: 200px)': {
            '.custom-container': {
              maxWidth: '200px',
            },
          },
          '@media (min-width: 300px)': {
            '.custom-container': {
              maxWidth: '300px',
            },
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-container {
        width: 100%;
      }
      @media (min-width: 100px) {
        .custom-container {
          max-width: 100px;
        }
      }
      @media (min-width: 200px) {
        .custom-container {
          max-width: 200px;
        }
      }
      @media (min-width: 300px) {
        .custom-container {
          max-width: 300px;
        }
      }
    `)
  })
})

test('media queries can be defined multiple times using objects-in-array syntax', () => {
  let config = {
    content: [
      {
        raw: html`<div class="custom-container"></div>
          <button class="btn"></button>`,
      },
    ],
    plugins: [
      function ({ addComponents }) {
        addComponents([
          {
            '.custom-container': {
              width: '100%',
            },
            '@media (min-width: 100px)': {
              '.custom-container': {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-container {
        width: 100%;
      }
      @media (min-width: 100px) {
        .custom-container {
          max-width: 100px;
        }
      }
      .btn {
        padding: 1rem 0.5rem;
        display: block;
      }
      @media (min-width: 100px) {
        .btn {
          display: inline-block;
        }
      }
    `)
  })
})

test('plugins can create nested rules', () => {
  let config = {
    content: [{ raw: html`<button class="btn-blue"></button>` }],
    plugins: [
      function ({ addComponents }) {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .btn-blue {
        color: #fff;
        background-color: #00f;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
      }
      .btn-blue:hover {
        background-color: #00008b;
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
})

test('plugins can create rules with escaped selectors', () => {
  let config = {
    content: [{ raw: html`<div class="custom-top-1/4"></div>` }],
    plugins: [
      function ({ e, addUtilities }) {
        addUtilities({
          [`.${e('custom-top-1/4')}`]: {
            top: '25%',
          },
        })
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-top-1\/4 {
        top: 25%;
      }
    `)
  })
})

test('plugins can access the current config', () => {
  let config = {
    content: [{ raw: html`<div class="custom-container"></div>` }],
    plugins: [
      function ({ addComponents, config }) {
        let containerClasses = [
          {
            '.custom-container': {
              width: '100%',
            },
          },
        ]

        for (let maxWidth of Object.values(config('theme.customScreens'))) {
          containerClasses.push({
            [`@media (min-width: ${maxWidth})`]: {
              '.custom-container': { maxWidth },
            },
          })
        }

        addComponents(containerClasses)
      },
    ],
    theme: {
      customScreens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
      },
    },
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-container {
        width: 100%;
      }
      @media (min-width: 576px) {
        .custom-container {
          max-width: 576px;
        }
      }
      @media (min-width: 768px) {
        .custom-container {
          max-width: 768px;
        }
      }
      @media (min-width: 992px) {
        .custom-container {
          max-width: 992px;
        }
      }
      @media (min-width: 1200px) {
        .custom-container {
          max-width: 1200px;
        }
      }
    `)
  })
})

test('plugins can check if corePlugins are enabled', () => {
  let config = {
    content: [{ raw: html`<div class="test"></div>` }],
    plugins: [
      function ({ addUtilities, corePlugins }) {
        addUtilities({
          '.test': {
            'text-color': corePlugins('textColor') ? 'true' : 'false',
            opacity: corePlugins('opacity') ? 'true' : 'false',
          },
        })
      },
    ],
    corePlugins: { textColor: false },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .test {
        text-color: false;
        opacity: true;
      }
    `)
  })
})

test('plugins can check if corePlugins are enabled when using array white-listing', () => {
  let config = {
    content: [{ raw: html`<div class="test"></div>` }],
    plugins: [
      function ({ addUtilities, corePlugins }) {
        addUtilities({
          '.test': {
            'text-color': corePlugins('textColor') ? 'true' : 'false',
            opacity: corePlugins('opacity') ? 'true' : 'false',
          },
        })
      },
    ],
    corePlugins: ['textColor'],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .test {
        text-color: true;
        opacity: false;
      }
    `)
  })
})

test('plugins can provide fallbacks to keys missing from the config', () => {
  let config = {
    content: [{ raw: html`<button class="btn"></button>` }],
    plugins: [
      function ({ addComponents, config }) {
        addComponents({
          '.btn': {
            borderRadius: config('borderRadius.default', '.25rem'),
          },
        })
      },
    ],
    theme: {
      borderRadius: {
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
      },
    },
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .btn {
        border-radius: 0.25rem;
      }
    `)
  })
})

test('plugins can add multiple sets of utilities and components', () => {
  let config = {
    content: [
      {
        raw: html`<button class="btn"></button>
          <div class="card custom-skew-12deg custom-border-collapse"></div>`,
      },
    ],
    plugins: [
      function ({ addUtilities, addComponents }) {
        addComponents({
          '.card': {
            padding: '1rem',
            borderRadius: '.25rem',
          },
        })

        addUtilities({
          '.custom-skew-12deg': {
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
          '.custom-border-collapse': {
            borderCollapse: 'collapse',
          },
        })
      },
    ],
  }

  return run('@tailwind components; @tailwind utilities;', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .card {
        border-radius: 0.25rem;
        padding: 1rem;
      }
      .btn {
        padding: 1rem 0.5rem;
        display: inline-block;
      }
      .custom-skew-12deg {
        transform: skewY(-12deg);
      }
      .custom-border-collapse {
        border-collapse: collapse;
      }
    `)
  })
})

test('plugins respect prefix and important options by default when adding utilities', () => {
  let config = {
    prefix: 'tw-',
    important: true,
    content: [{ raw: html`<div class="tw-custom-rotate-90"></div>` }],
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.custom-rotate-90': {
            transform: 'rotate(90deg)',
          },
        })
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .tw-custom-rotate-90 {
        transform: rotate(90deg) !important;
      }
    `)
  })
})

test('when important is a selector it is used to scope utilities instead of adding !important', () => {
  let config = {
    prefix: 'tw-',
    important: '#app',
    content: [{ raw: html`<div class="tw-custom-rotate-90"></div>` }],
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.custom-rotate-90': {
            transform: 'rotate(90deg)',
          },
        })
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      #app .tw-custom-rotate-90 {
        transform: rotate(90deg);
      }
    `)
  })
})

test('when important is a selector it scopes all selectors in a rule, even though defining utilities like this is stupid', () => {
  let config = {
    important: '#app',
    content: [{ raw: html`<div class="custom-rotate-90 custom-rotate-1/4"></div>` }],
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.custom-rotate-90, .custom-rotate-1\\/4': {
            transform: 'rotate(90deg)',
          },
        })
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      #app .custom-rotate-90,
      #app .custom-rotate-1\/4 {
        transform: rotate(90deg);
      }
    `)
  })
})

test('important utilities are not made double important when important option is used', () => {
  let config = {
    important: true,
    content: [{ raw: html`<div class="custom-rotate-90"></div>` }],
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.custom-rotate-90': {
            transform: 'rotate(90deg) !important',
          },
        })
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-rotate-90 {
        transform: rotate(90deg) !important;
      }
    `)
  })
})

test("component declarations respect the 'prefix' option by default", () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<button class="tw-btn-blue"></button>` }],
    plugins: [
      function ({ addComponents }) {
        addComponents({
          '.btn-blue': {
            backgroundColor: 'blue',
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .tw-btn-blue {
        background-color: #00f;
      }
    `)
  })
})

test('all selectors in a rule are prefixed', () => {
  let config = {
    prefix: 'tw-',
    content: [
      {
        raw: html`<button class="tw-btn-blue tw-btn-red"></button>
          <div class="tw-custom-rotate-90 tw-custom-rotate-1/4"></div>`,
      },
    ],
    plugins: [
      function ({ addUtilities, addComponents }) {
        addUtilities({
          '.custom-rotate-90, .custom-rotate-1\\/4': {
            transform: 'rotate(90deg)',
          },
        })
        addComponents({
          '.btn-blue, .btn-red': {
            padding: '10px',
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .tw-btn-blue,
      .tw-btn-red {
        padding: 10px;
      }
    `)
  })
})

test("component declarations can optionally ignore 'prefix' option", () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<button class="btn-blue"></button>` }],
    plugins: [
      function ({ addComponents }) {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .btn-blue {
        background-color: #00f;
      }
    `)
  })
})

test("component declarations are not affected by the 'important' option", () => {
  let config = {
    important: true,
    content: [{ raw: html`<button class="btn-blue"></button>` }],
    plugins: [
      function ({ addComponents }) {
        addComponents({
          '.btn-blue': {
            backgroundColor: 'blue',
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .btn-blue {
        background-color: #00f;
      }
    `)
  })
})

test("plugins can apply the user's chosen prefix to components manually", () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<button class="tw-btn-blue"></button>` }],
    plugins: [
      function ({ addComponents, prefix }) {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .tw-btn-blue {
        background-color: #00f;
      }
    `)
  })
})

test('prefix can optionally be ignored for utilities', () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<div class="custom-rotate-90"></div>` }],
    plugins: [
      function ({ addUtilities }) {
        addUtilities(
          {
            '.custom-rotate-90': {
              transform: 'rotate(90deg)',
            },
          },
          { respectPrefix: false }
        )
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-rotate-90 {
        transform: rotate(90deg);
      }
    `)
  })
})

test('important can optionally be ignored for utilities', () => {
  let config = {
    important: true,
    content: [{ raw: html`<div class="custom-rotate-90"></div>` }],
    plugins: [
      function ({ addUtilities }) {
        addUtilities(
          {
            '.custom-rotate-90': {
              transform: 'rotate(90deg)',
            },
          },
          { respectImportant: false }
        )
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-rotate-90 {
        transform: rotate(90deg);
      }
    `)
  })
})

test('prefix will prefix all classes in a selector', () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<div class="tw-btn-blue tw-w-1/4"></div>` }],
    plugins: [
      function ({ addComponents, prefix }) {
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
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .tw-btn-blue .tw-w-1\/4 > h1.tw-text-xl + a .tw-bar {
        background-color: #00f;
      }
    `)
  })
})

test('plugins can be provided as an object with a handler function', () => {
  let config = {
    content: [
      {
        raw: html`<div class="custom-object-fill custom-object-contain custom-object-cover"></div>`,
      },
    ],
    plugins: [
      {
        handler({ addUtilities }) {
          addUtilities({
            '.custom-object-fill': {
              'object-fit': 'fill',
            },
            '.custom-object-contain': {
              'object-fit': 'contain',
            },
            '.custom-object-cover': {
              'object-fit': 'cover',
            },
          })
        },
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .custom-object-fill {
        object-fit: fill;
      }
      .custom-object-contain {
        object-fit: contain;
      }
      .custom-object-cover {
        object-fit: cover;
      }
    `)
  })
})

test('plugins can provide a config but no handler', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="tw-custom-object-fill tw-custom-object-contain tw-custom-object-cover"
        ></div>`,
      },
    ],
    plugins: [
      {
        config: {
          prefix: 'tw-',
        },
      },
      {
        handler({ addUtilities }) {
          addUtilities({
            '.custom-object-fill': {
              'object-fit': 'fill',
            },
            '.custom-object-contain': {
              'object-fit': 'contain',
            },
            '.custom-object-cover': {
              'object-fit': 'cover',
            },
          })
        },
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .tw-custom-object-fill {
        object-fit: fill;
      }
      .tw-custom-object-contain {
        object-fit: contain;
      }
      .tw-custom-object-cover {
        object-fit: cover;
      }
    `)
  })
})

test('plugins can be created using the `createPlugin` function', () => {
  let config = {
    content: [{ raw: html`<div class="test-sm test-md test-lg hover:test-sm sm:test-sm"></div>` }],
    corePlugins: [],
    theme: {
      screens: {
        sm: '400px',
      },
    },
    plugins: [
      createPlugin(
        function ({ addUtilities, theme }) {
          addUtilities(
            Object.fromEntries(
              Object.entries(theme('testPlugin')).map(([k, v]) => [
                `.test-${k}`,
                { testProperty: v },
              ])
            )
          )
        },
        {
          theme: {
            testPlugin: {
              sm: '1rem',
              md: '2rem',
              lg: '3rem',
            },
          },
        }
      ),
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .test-sm {
        test-property: 1rem;
      }
      .test-md {
        test-property: 2rem;
      }
      .test-lg {
        test-property: 3rem;
      }
      .hover\:test-sm:hover {
        test-property: 1rem;
      }
      @media (min-width: 400px) {
        .sm\:test-sm {
          test-property: 1rem;
        }
      }
    `)
  })
})

test('plugins with extra options can be created using the `createPlugin.withOptions` function', () => {
  let plugin = createPlugin.withOptions(
    function ({ className }) {
      return function ({ addUtilities, theme }) {
        addUtilities(
          Object.fromEntries(
            Object.entries(theme('testPlugin')).map(([k, v]) => [
              `.${className}-${k}`,
              { testProperty: v },
            ])
          )
        )
      }
    },
    function () {
      return {
        theme: {
          testPlugin: {
            sm: '1rem',
            md: '2rem',
            lg: '3rem',
          },
        },
      }
    }
  )

  let config = {
    content: [
      {
        raw: html`<div class="banana-sm banana-md banana-lg hover:banana-sm sm:banana-sm"></div>`,
      },
    ],
    corePlugins: [],
    theme: {
      screens: {
        sm: '400px',
      },
    },
    plugins: [plugin({ className: 'banana' })],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .banana-sm {
        test-property: 1rem;
      }
      .banana-md {
        test-property: 2rem;
      }
      .banana-lg {
        test-property: 3rem;
      }
      .hover\:banana-sm:hover {
        test-property: 1rem;
      }
      @media (min-width: 400px) {
        .sm\:banana-sm {
          test-property: 1rem;
        }
      }
    `)
  })
})

test('plugins should cache correctly', () => {
  let plugin = createPlugin.withOptions(({ className = 'banana' } = {}) => ({ addComponents }) => {
    addComponents({ [`.${className}`]: { position: 'absolute' } })
  })

  let config = {
    content: [{ raw: html`<div class="banana sm:banana apple sm:apple"></div>` }],
    corePlugins: [],
    theme: {
      screens: {
        sm: '400px',
      },
    },
  }

  function internalRun(options = {}) {
    return run('@tailwind components', {
      ...config,
      plugins: [plugin(options)],
    })
  }

  return Promise.all([internalRun(), internalRun({ className: 'apple' })]).then(
    ([result1, result2]) => {
      let expected1 = css`
        .banana {
          position: absolute;
        }
        @media (min-width: 400px) {
          .sm\:banana {
            position: absolute;
          }
        }
      `

      let expected2 = css`
        .apple {
          position: absolute;
        }
        @media (min-width: 400px) {
          .sm\:apple {
            position: absolute;
          }
        }
      `

      expect(result1.css).toMatchCss(expected1)
      expect(result2.css).toMatchCss(expected2)
    }
  )
})

test('plugins created using `createPlugin.withOptions` do not need to be invoked if the user wants to use the default options', () => {
  let plugin = createPlugin.withOptions(
    function ({ className } = { className: 'banana' }) {
      return function ({ addUtilities, theme }) {
        addUtilities(
          Object.fromEntries(
            Object.entries(theme('testPlugin')).map(([k, v]) => [
              `.${className}-${k}`,
              { testProperty: v },
            ])
          )
        )
      }
    },
    function () {
      return {
        theme: {
          testPlugin: {
            sm: '1rem',
            md: '2rem',
            lg: '3rem',
          },
        },
      }
    }
  )

  let config = {
    content: [
      {
        raw: html`<div class="banana-sm banana-md banana-lg hover:banana-sm sm:banana-sm"></div>`,
      },
    ],
    corePlugins: [],
    theme: {
      screens: {
        sm: '400px',
      },
    },
    plugins: [plugin],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .banana-sm {
        test-property: 1rem;
      }
      .banana-md {
        test-property: 2rem;
      }
      .banana-lg {
        test-property: 3rem;
      }
      .hover\:banana-sm:hover {
        test-property: 1rem;
      }
      @media (min-width: 400px) {
        .sm\:banana-sm {
          test-property: 1rem;
        }
      }
    `)
  })
})

test('the configFunction parameter is optional when using the `createPlugin.withOptions` function', () => {
  let plugin = createPlugin.withOptions(function ({ className }) {
    return function ({ addUtilities, theme }) {
      addUtilities(
        Object.fromEntries(
          Object.entries(theme('testPlugin')).map(([k, v]) => [
            `.${className}-${k}`,
            { testProperty: v },
          ])
        )
      )
    }
  })

  let config = {
    content: [
      {
        raw: html`<div class="banana-sm banana-md banana-lg hover:banana-sm sm:banana-sm"></div>`,
      },
    ],
    corePlugins: [],
    theme: {
      screens: {
        sm: '400px',
      },
      testPlugin: {
        sm: '1px',
        md: '2px',
        lg: '3px',
      },
    },
    plugins: [plugin({ className: 'banana' })],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .banana-sm {
        test-property: 1px;
      }
      .banana-md {
        test-property: 2px;
      }
      .banana-lg {
        test-property: 3px;
      }
      .hover\:banana-sm:hover {
        test-property: 1px;
      }
      @media (min-width: 400px) {
        .sm\:banana-sm {
          test-property: 1px;
        }
      }
    `)
  })
})

test('keyframes are not escaped', () => {
  let config = {
    content: [{ raw: html`<div class="foo-[abc] md:foo-[def]"></div>` }],
    corePlugins: { preflight: false },
    plugins: [
      function ({ matchUtilities }) {
        matchUtilities({
          foo: (value) => {
            return {
              [`@keyframes ${value}`]: {
                '25.001%': {
                  color: 'black',
                },
              },
              animation: `${value} 1s infinite`,
            }
          },
        })
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @keyframes abc {
        25.001% {
          color: #000;
        }
      }
      .foo-\[abc\] {
        animation: 1s infinite abc;
      }
      @media (min-width: 768px) {
        @keyframes def {
          25.001% {
            color: #000;
          }
        }
        .md\:foo-\[def\] {
          animation: 1s infinite def;
        }
      }
    `)
  })
})

test('font sizes are retrieved without default line-heights or letter-spacing using theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      fontSize: {
        sm: ['14px', '20px'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            fontSize: theme('fontSize.sm'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        font-size: 14px;
      }
    `)
  })
})

test('outlines are retrieved without outline-offset using theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      outline: {
        black: ['2px dotted black', '4px'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            outline: theme('outline.black'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        outline: 2px dotted #000;
      }
    `)
  })
})

test('box-shadow values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      boxShadow: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            boxShadow: theme('boxShadow.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        box-shadow: width, height;
      }
    `)
  })
})

test('transition-property values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      transitionProperty: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            transitionProperty: theme('transitionProperty.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        transition-property: width, height;
      }
    `)
  })
})

test('transition-duration values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      transitionDuration: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            transitionDuration: theme('transitionDuration.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        transition-duration: width, height;
      }
    `)
  })
})

test('transition-delay values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      transitionDuration: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            transitionDuration: theme('transitionDuration.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        transition-duration: width, height;
      }
    `)
  })
})

test('transition-timing-function values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      transitionTimingFunction: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            transitionTimingFunction: theme('transitionTimingFunction.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        transition-timing-function: width, height;
      }
    `)
  })
})

test('background-image values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      backgroundImage: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            backgroundImage: theme('backgroundImage.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        background-image: width, height;
      }
    `)
  })
})

test('background-size values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      backgroundSize: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            backgroundSize: theme('backgroundSize.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        background-size: width, height;
      }
    `)
  })
})

test('background-color values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      backgroundColor: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            backgroundColor: theme('backgroundColor.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        background-color: width, height;
      }
    `)
  })
})

test('cursor values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      cursor: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            cursor: theme('cursor.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        cursor: width, height;
      }
    `)
  })
})

test('animation values are joined when retrieved using the theme function', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: [],
    theme: {
      animation: {
        lol: ['width', 'height'],
      },
    },
    plugins: [
      function ({ addComponents, theme }) {
        addComponents({
          '.foo': {
            animation: theme('animation.lol'),
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        animation: width, height;
      }
    `)
  })
})

test('custom properties are not converted to kebab-case when added to base layer', () => {
  let config = {
    content: [],
    plugins: [
      function ({ addBase }) {
        addBase({
          ':root': {
            '--colors-primaryThing-500': '0, 0, 255',
          },
        })
      },
    ],
  }

  return run('@tailwind base', config).then((result) => {
    expect(result.css).toContain(`--colors-primaryThing-500: 0, 0, 255;`)
  })
})

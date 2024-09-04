import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import plugin from '../src/lib/evaluateTailwindFunctions'
import { run as runFull, html, css } from './util/run'

function run(input, opts = {}) {
  return postcss([
    plugin({
      tailwindConfig: opts,
      markInvalidUtilityNode() {
        // no op
      },
    }),
  ]).process(input, { from: undefined })
}

test('it looks up values in the theme using dot notation', () => {
  let input = css`
    .banana {
      color: theme('colors.yellow');
    }
  `

  let output = css`
    .banana {
      color: #f7cc50;
    }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it looks up values in the theme using bracket notation', () => {
  let input = css`
    .banana {
      color: theme('colors[yellow]');
    }
  `

  let output = css`
    .banana {
      color: #f7cc50;
    }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it looks up values in the theme using consecutive bracket notation', () => {
  let input = css`
    .banana {
      color: theme('colors[yellow][100]');
    }
  `

  let output = css`
    .banana {
      color: #f7cc50;
    }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: {
          100: '#f7cc50',
        },
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it looks up values in the theme using bracket notation that have dots in them', () => {
  let input = css`
    .banana {
      padding-top: theme('spacing[1.5]');
    }
  `

  let output = css`
    .banana {
      padding-top: 0.375rem;
    }
  `

  return run(input, {
    theme: {
      spacing: {
        '1.5': '0.375rem',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('theme with mismatched brackets throws an error ', async () => {
  let config = {
    theme: {
      spacing: {
        '1.5': '0.375rem',
      },
    },
  }

  let input = (path) => css`
    .banana {
      padding-top: theme('${path}');
    }
  `

  await expect(run(input('spacing[1.5]]'), config)).rejects.toThrowError(
    `Path is invalid. Has unbalanced brackets: spacing[1.5]]`
  )

  await expect(run(input('spacing[[1.5]'), config)).rejects.toThrowError(
    `Path is invalid. Has unbalanced brackets: spacing[[1.5]`
  )

  await expect(run(input('spacing[a['), config)).rejects.toThrowError(
    `Path is invalid. Has unbalanced brackets: spacing[a[`
  )
})

test('color can be a function', () => {
  let input = css`
    .backgroundColor {
      color: theme('backgroundColor.fn');
    }
    .borderColor {
      color: theme('borderColor.fn');
    }
    .caretColor {
      color: theme('caretColor.fn');
    }
    .colors {
      color: theme('colors.fn');
    }
    .divideColor {
      color: theme('divideColor.fn');
    }
    .fill {
      color: theme('fill.fn');
    }
    .gradientColorStops {
      color: theme('gradientColorStops.fn');
    }
    .placeholderColor {
      color: theme('placeholderColor.fn');
    }
    .ringColor {
      color: theme('ringColor.fn');
    }
    .ringOffsetColor {
      color: theme('ringOffsetColor.fn');
    }
    .stroke {
      color: theme('stroke.fn');
    }
    .textColor {
      color: theme('textColor.fn');
    }
  `

  let output = css`
    .backgroundColor {
      color: #f00;
    }
    .borderColor {
      color: #f00;
    }
    .caretColor {
      color: #f00;
    }
    .colors {
      color: #f00;
    }
    .divideColor {
      color: #f00;
    }
    .fill {
      color: #f00;
    }
    .gradientColorStops {
      color: #f00;
    }
    .placeholderColor {
      color: #f00;
    }
    .ringColor {
      color: #f00;
    }
    .ringOffsetColor {
      color: #f00;
    }
    .stroke {
      color: #f00;
    }
    .textColor {
      color: #f00;
    }
  `

  let fn = () => `#f00`

  return run(input, {
    theme: {
      backgroundColor: { fn },
      borderColor: { fn },
      caretColor: { fn },
      colors: { fn },
      divideColor: { fn },
      fill: { fn },
      gradientColorStops: { fn },
      placeholderColor: { fn },
      ringColor: { fn },
      ringOffsetColor: { fn },
      stroke: { fn },
      textColor: { fn },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('quotes are optional around the lookup path', () => {
  let input = css`
    .banana {
      color: theme(colors.yellow);
    }
  `

  let output = css`
    .banana {
      color: #f7cc50;
    }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('a default value can be provided', () => {
  let input = css`
    .cookieMonster {
      color: theme('colors.blue', #0000ff);
    }
  `

  let output = css`
    .cookieMonster {
      color: #0000ff;
    }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the default value can use the theme function', () => {
  let input = css`
    .cookieMonster {
      color: theme('colors.blue', theme('colors.yellow'));
    }
  `

  let output = css`
    .cookieMonster {
      color: #f7cc50;
    }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('quotes are preserved around default values', () => {
  let input = css`
    .heading {
      font-family: theme('fontFamily.sans', 'Helvetica Neue');
    }
  `

  let output = css`
    .heading {
      font-family: 'Helvetica Neue';
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        serif: 'Constantia',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('an unquoted list is valid as a default value', () => {
  let input = css`
    .heading {
      font-family: theme('fontFamily.sans', Helvetica, Arial, sans-serif);
    }
  `

  let output = css`
    .heading {
      font-family: Helvetica, Arial, sans-serif;
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        serif: 'Constantia',
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('a missing root theme value throws', () => {
  let input = css`
    .heading {
      color: theme('colours.gray.100');
    }
  `

  return expect(
    run(input, {
      theme: {
        colors: {
          yellow: '#f7cc50',
        },
      },
    })
  ).rejects.toThrowError(
    `'colours.gray.100' does not exist in your theme config. Your theme has the following top-level keys: 'colors'`
  )
})

test('a missing nested theme property throws', () => {
  let input = css`
    .heading {
      color: theme('colors.red');
    }
  `

  return expect(
    run(input, {
      theme: {
        colors: {
          blue: 'blue',
          yellow: '#f7cc50',
        },
      },
    })
  ).rejects.toThrowError(
    `'colors.red' does not exist in your theme config. 'colors' has the following valid keys: 'blue', 'yellow'`
  )
})

test('a missing nested theme property with a close alternative throws with a suggestion', () => {
  let input = css`
    .heading {
      color: theme('colors.yellw');
    }
  `

  return expect(
    run(input, {
      theme: {
        colors: {
          yellow: '#f7cc50',
        },
      },
    })
  ).rejects.toThrowError(
    `'colors.yellw' does not exist in your theme config. Did you mean 'colors.yellow'?`
  )
})

test('a path through a non-object throws', () => {
  let input = css`
    .heading {
      color: theme('colors.yellow.100');
    }
  `

  return expect(
    run(input, {
      theme: {
        colors: {
          yellow: '#f7cc50',
        },
      },
    })
  ).rejects.toThrowError(
    `'colors.yellow.100' does not exist in your theme config. 'colors.yellow' is not an object.`
  )
})

test('a path which exists but is not a string throws', () => {
  let input = css`
    .heading {
      color: theme('colors.yellow');
    }
  `

  return expect(
    run(input, {
      theme: {
        colors: {
          yellow: Symbol(),
        },
      },
    })
  ).rejects.toThrowError(`'colors.yellow' was found but does not resolve to a string.`)
})

test('a path which exists but is invalid throws', () => {
  let input = css`
    .heading {
      color: theme('colors');
    }
  `

  return expect(
    run(input, {
      theme: {
        colors: {},
      },
    })
  ).rejects.toThrowError(`'colors' was found but does not resolve to a string.`)
})

test('a path which is an object throws with a suggested key', () => {
  let input = css`
    .heading {
      color: theme('colors');
    }
  `

  return expect(
    run(input, {
      theme: {
        colors: {
          yellow: '#f7cc50',
        },
      },
    })
  ).rejects.toThrowError(
    `'colors' was found but does not resolve to a string. Did you mean something like 'colors.yellow'?`
  )
})

test('array values are joined by default', () => {
  let input = css`
    .heading {
      font-family: theme('fontFamily.sans');
    }
  `

  let output = css`
    .heading {
      font-family: Inter, Helvetica, sans-serif;
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'sans-serif'],
      },
    },
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font sizes are retrieved without default line-heights or letter-spacing', () => {
  let input = css`
    .heading-1 {
      font-size: theme('fontSize.lg');
    }
    .heading-2 {
      font-size: theme('fontSize.xl');
    }
  `

  let output = css`
    .heading-1 {
      font-size: 20px;
    }
    .heading-2 {
      font-size: 24px;
    }
  `

  return run(input, {
    theme: {
      fontSize: {
        lg: ['20px', '28px'],
        xl: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('outlines are retrieved without default outline-offset', () => {
  let input = css`
    .element {
      outline: theme('outline.black');
    }
  `

  let output = css`
    .element {
      outline: 2px dotted #000;
    }
  `

  return run(input, {
    theme: {
      outline: {
        black: ['2px dotted black', '4px'],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font-family values are retrieved without font-variation-settings', () => {
  let input = css`
    .heading-1 {
      font-family: theme('fontFamily.sans');
    }
    .heading-2 {
      font-family: theme('fontFamily.serif');
    }
    .heading-3 {
      font-family: theme('fontFamily.mono');
    }
  `

  let output = css`
    .heading-1 {
      font-family: Inter;
    }
    .heading-2 {
      font-family: Times, serif;
    }
    .heading-3 {
      font-family: Menlo, monospace;
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        sans: ['Inter', { fontVariationSettings: '"opsz" 32' }],
        serif: [['Times', 'serif'], { fontVariationSettings: '"opsz" 32' }],
        mono: ['Menlo, monospace', { fontVariationSettings: '"opsz" 32' }],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font-variation-settings values can be retrieved', () => {
  let input = css`
    .heading {
      font-family: theme('fontFamily.sans');
      font-variation-settings: theme('fontFamily.sans[1].fontVariationSettings');
    }
  `

  let output = css`
    .heading {
      font-family: Inter;
      font-variation-settings: 'opsz' 32;
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        sans: ['Inter', { fontVariationSettings: "'opsz' 32" }],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font-family values are joined when an array', () => {
  let input = css`
    .element {
      font-family: theme('fontFamily.sans');
    }
  `

  let output = css`
    .element {
      font-family: Helvetica, Arial, sans-serif;
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font-family values are retrieved without font-feature-settings', () => {
  let input = css`
    .heading-1 {
      font-family: theme('fontFamily.sans');
    }
    .heading-2 {
      font-family: theme('fontFamily.serif');
    }
    .heading-3 {
      font-family: theme('fontFamily.mono');
    }
  `

  let output = css`
    .heading-1 {
      font-family: Inter;
    }
    .heading-2 {
      font-family: Times, serif;
    }
    .heading-3 {
      font-family: Menlo, monospace;
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        sans: ['Inter', { fontFeatureSettings: '"cv11"' }],
        serif: [['Times', 'serif'], { fontFeatureSettings: '"cv11"' }],
        mono: ['Menlo, monospace', { fontFeatureSettings: '"cv11"' }],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font-feature-settings values can be retrieved', () => {
  let input = css`
    .heading {
      font-family: theme('fontFamily.sans');
      font-feature-settings: theme('fontFamily.sans[1].fontFeatureSettings');
    }
  `

  let output = css`
    .heading {
      font-feature-settings: 'cv11';
      font-family: Inter;
    }
  `

  return run(input, {
    theme: {
      fontFamily: {
        sans: ['Inter', { fontFeatureSettings: "'cv11'" }],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('box-shadow values are joined when an array', () => {
  let input = css`
    .element {
      box-shadow: theme('boxShadow.wtf');
    }
  `

  let output = css`
    .element {
      box-shadow: 0 0 2px #000, 1px 2px 3px #fff;
    }
  `

  return run(input, {
    theme: {
      boxShadow: {
        wtf: ['0 0 2px black', '1px 2px 3px white'],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('transition-property values are joined when an array', () => {
  let input = css`
    .element {
      transition-property: theme('transitionProperty.colors');
    }
  `

  let output = css`
    .element {
      transition-property: color, fill;
    }
  `

  return run(input, {
    theme: {
      transitionProperty: {
        colors: ['color', 'fill'],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('transition-duration values are joined when an array', () => {
  let input = css`
    .element {
      transition-duration: theme('transitionDuration.lol');
    }
  `

  let output = css`
    .element {
      transition-duration: 1s, 2s;
    }
  `

  return run(input, {
    theme: {
      transitionDuration: {
        lol: ['1s', '2s'],
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('basic screen function calls are expanded', () => {
  let input = css`
    @media screen(sm) {
      .foo {
        color: red;
      }
    }
  `

  let output = css`
    @media (min-width: 600px) {
      .foo {
        color: red;
      }
    }
  `

  return run(input, {
    theme: { screens: { sm: '600px' } },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('screen function supports max-width screens', () => {
  let input = css`
    @media screen(sm) {
      .foo {
        color: red;
      }
    }
  `

  let output = css`
    @media (max-width: 600px) {
      .foo {
        color: red;
      }
    }
  `

  return run(input, {
    theme: { screens: { sm: { max: '600px' } } },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('screen function supports min-width screens', () => {
  let input = css`
    @media screen(sm) {
      .foo {
        color: red;
      }
    }
  `

  let output = css`
    @media (min-width: 600px) {
      .foo {
        color: red;
      }
    }
  `

  return run(input, {
    theme: { screens: { sm: { min: '600px' } } },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('screen function supports min-width and max-width screens', () => {
  let input = css`
    @media screen(sm) {
      .foo {
        color: red;
      }
    }
  `

  let output = css`
    @media (min-width: 600px) and (max-width: 700px) {
      .foo {
        color: red;
      }
    }
  `

  return run(input, {
    theme: { screens: { sm: { min: '600px', max: '700px' } } },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('screen function supports raw screens', () => {
  let input = css`
    @media screen(mono) {
      .foo {
        color: red;
      }
    }
  `

  let output = css`
    @media monochrome {
      .foo {
        color: red;
      }
    }
  `

  return run(input, {
    theme: { screens: { mono: { raw: 'monochrome' } } },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('screen arguments can be quoted', () => {
  let input = css`
    @media screen('sm') {
      .foo {
        color: red;
      }
    }
  `

  let output = css`
    @media (min-width: 600px) {
      .foo {
        color: red;
      }
    }
  `

  return run(input, {
    theme: { screens: { sm: '600px' } },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (1)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / 50%);
    }
  `

  let output = css`
    .foo {
      color: #3b82f680;
    }
  `

  return run(input, {
    theme: {
      colors: { blue: { 500: '#3b82f6' } },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (2)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / 0.5);
    }
  `

  let output = css`
    .foo {
      color: #3b82f680;
    }
  `

  return run(input, {
    theme: {
      colors: { blue: { 500: '#3b82f6' } },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (3)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / var(--my-alpha));
    }
  `

  let output = css`
    .foo {
      color: rgb(59 130 246 / var(--my-alpha));
    }
  `

  return run(input, {
    theme: {
      colors: { blue: { 500: '#3b82f6' } },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (4)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / 50%);
    }
  `

  let output = css`
    .foo {
      color: #3c83f680;
    }
  `

  return run(input, {
    theme: {
      colors: {
        blue: { 500: 'hsl(217, 91%, 60%)' },
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (5)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / 0.5);
    }
  `

  let output = css`
    .foo {
      color: #3c83f680;
    }
  `

  return run(input, {
    theme: {
      colors: {
        blue: { 500: 'hsl(217, 91%, 60%)' },
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (6)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / var(--my-alpha));
    }
  `

  let output = css`
    .foo {
      color: hsl(217 91% 60% / var(--my-alpha));
    }
  `

  return run(input, {
    theme: {
      colors: {
        blue: { 500: 'hsl(217, 91%, 60%)' },
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (7)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / var(--my-alpha));
    }
  `

  let output = css`
    .foo {
      color: rgb(var(--foo) / var(--my-alpha));
    }
  `

  return runFull(input, {
    theme: {
      colors: {
        blue: {
          500: 'rgb(var(--foo) / <alpha-value>)',
        },
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme function can extract alpha values for colors (8)', () => {
  let input = css`
    .foo {
      color: theme(colors.blue.500 / theme(opacity.myalpha));
    }
  `

  let output = css`
    .foo {
      color: rgb(var(--foo) / 50%);
    }
  `

  return runFull(input, {
    theme: {
      colors: {
        blue: {
          500: 'rgb(var(--foo) / <alpha-value>)',
        },
      },

      opacity: {
        myalpha: '50%',
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme functions replace the alpha value placeholder even with no alpha provided', () => {
  let input = css`
    .foo {
      background: theme(colors.blue.400);
      color: theme(colors.blue.500);
    }
  `

  let output = css`
    .foo {
      color: rgb(var(--foo) / 1);
      background: #00f;
    }
  `

  return runFull(input, {
    theme: {
      colors: {
        blue: {
          400: 'rgb(0 0 255 / <alpha-value>)',
          500: 'rgb(var(--foo) / <alpha-value>)',
        },
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme functions can reference values with slashes in brackets', () => {
  let input = css`
    .foo1 {
      color: theme(colors[a/b]);
    }
    .foo2 {
      color: theme(colors[a/b]/50%);
    }
  `

  let output = css`
    .foo1 {
      color: #000;
    }
    .foo2 {
      color: #00000080;
    }
  `

  return runFull(input, {
    theme: {
      colors: {
        'a/b': '#000000',
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme functions with alpha value inside quotes', () => {
  let input = css`
    .foo {
      color: theme('colors.yellow / 50%');
    }
  `

  let output = css`
    .foo {
      color: #f7cc5080;
    }
  `

  return runFull(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('Theme functions with alpha with quotes value around color only', () => {
  let input = css`
    .foo {
      color: theme('colors.yellow' / 50%);
    }
  `

  let output = css`
    .foo {
      color: #f7cc5080;
    }
  `

  return runFull(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

it('can find values with slashes in the theme key while still allowing for alpha values ', () => {
  let input = css`
    .foo00 {
      color: theme(colors.foo-5);
    }
    .foo01 {
      color: theme(colors.foo-5/10);
    }
    .foo02 {
      color: theme(colors.foo-5/10/25);
    }
    .foo03 {
      color: theme(colors.foo-5 / 10);
    }
    .foo04 {
      color: theme(colors.foo-5/10 / 25);
    }
  `

  return runFull(input, {
    theme: {
      colors: {
        'foo-5': '#050000',
        'foo-5/10': '#051000',
        'foo-5/10/25': '#051025',
      },
    },
  }).then((result) => {
    expect(result.css).toMatchCss(css`
      .foo00 {
        color: #050000;
      }
      .foo01 {
        color: #051000;
      }
      .foo02 {
        color: #051025;
      }
      .foo03 {
        color: #050000;
      }
      .foo04 {
        color: #051000;
      }
    `)
  })
})

describe('context dependent', () => {
  let configPath = path.resolve(__dirname, './evaluate-tailwind-functions.tailwind.config.js')
  let filePath = path.resolve(__dirname, './evaluate-tailwind-functions.test.html')
  let config = {
    content: [filePath],
    corePlugins: { preflight: false },
  }

  // Rebuild the config file for each test
  beforeEach(() => fs.promises.writeFile(configPath, `module.exports = ${JSON.stringify(config)};`))
  afterEach(() => fs.promises.unlink(configPath))

  test('should not generate when theme fn doesnt resolve', async () => {
    await fs.promises.writeFile(
      filePath,
      html`
        <div class="underline [--box-shadow:theme('boxShadow.doesnotexist')]"></div>
        <div class="bg-[theme('boxShadow.doesnotexist')]"></div>
      `
    )

    // TODO: We need a way to reuse the context in our test suite without requiring writing to files
    // It should be an explicit thing tho — like we create a context and pass it in or something
    let result = await runFull('@tailwind utilities', configPath)

    // 1. On first run it should work because it's been removed from the class cache
    expect(result.css).toMatchCss(css`
      .underline {
        text-decoration-line: underline;
      }
    `)

    // 2. But we get a warning in the console
    expect().toHaveBeenWarnedWith(['invalid-theme-key-in-class'])

    // 3. The second run should work fine because it's been removed from the class cache
    result = await runFull('@tailwind utilities', configPath)

    expect(result.css).toMatchCss(css`
      .underline {
        text-decoration-line: underline;
      }
    `)

    // 4. But we've not received any further logs about it
    expect().toHaveBeenWarnedWith(['invalid-theme-key-in-class'])
  })

  test('it works mayhaps', async () => {
    let input = css`
      .test {
        /* prettier-ignore */
        inset: calc(-1 * (2*theme("spacing.4")));
        /* prettier-ignore */
        padding: calc(-1 * (2* theme("spacing.4")));
      }
    `

    let output = css`
      .test {
        /* prettier-ignore */
        inset: calc(-1 * (2*1rem));
        /* prettier-ignore */
        padding: calc(-1 * (2* 1rem));
      }
    `

    return run(input, {
      theme: {
        spacing: {
          4: '1rem',
        },
      },
    }).then((result) => {
      expect(result.css).toMatchCss(output)
      expect(result.warnings().length).toBe(0)
    })
  })
})

test('it should handle square brackets inside `theme`, inside arbitrary properties', () => {
  let config = {
    content: [
      {
        raw: html` <div class="bg-[--color] sm:[--color:_theme(colors.green[400])]"></div> `,
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  return runFull(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-\[--color\] {
        background-color: var(--color);
      }
      @media (min-width: 640px) {
        .sm\:\[--color\:_theme\(colors\.green\[400\]\)\] {
          --color: #4ade80;
        }
      }
    `)
  })
})

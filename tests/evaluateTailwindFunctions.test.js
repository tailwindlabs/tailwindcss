import postcss from 'postcss'
import plugin from '../src/lib/evaluateTailwindFunctions'
import tailwind from '../src/index'
import { css } from './util/run'

function run(input, opts = {}) {
  return postcss([plugin({ tailwindConfig: opts })]).process(input, { from: undefined })
}

function runFull(input, config) {
  return postcss([tailwind(config)]).process(input, { from: undefined })
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
      outline: 2px dotted black;
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

test('box-shadow values are joined when an array', () => {
  let input = css`
    .element {
      box-shadow: theme('boxShadow.wtf');
    }
  `

  let output = css`
    .element {
      box-shadow: 0 0 2px black, 1px 2px 3px white;
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
      }
    }
  `

  let output = css`
    @media (min-width: 600px) {
      .foo {
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
      }
    }
  `

  let output = css`
    @media (max-width: 600px) {
      .foo {
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
      }
    }
  `

  let output = css`
    @media (min-width: 600px) {
      .foo {
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
      }
    }
  `

  let output = css`
    @media (min-width: 600px) and (max-width: 700px) {
      .foo {
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
      }
    }
  `

  let output = css`
    @media monochrome {
      .foo {
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
      }
    }
  `

  let output = css`
    @media (min-width: 600px) {
      .foo {
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
      color: rgb(59 130 246 / 50%);
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
      color: rgb(59 130 246 / 0.5);
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
      color: hsl(217 91% 60% / 50%);
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
      color: hsl(217 91% 60% / 0.5);
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

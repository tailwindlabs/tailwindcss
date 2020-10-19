import postcss from 'postcss'
import plugin from '../src/lib/evaluateTailwindFunctions'

function run(input, opts = {}) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

test('it looks up values in the theme using dot notation', () => {
  const input = `
    .banana { color: theme('colors.yellow'); }
  `

  const output = `
    .banana { color: #f7cc50; }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('quotes are optional around the lookup path', () => {
  const input = `
    .banana { color: theme(colors.yellow); }
  `

  const output = `
    .banana { color: #f7cc50; }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('a default value can be provided', () => {
  const input = `
    .cookieMonster { color: theme('colors.blue', #0000ff); }
  `

  const output = `
    .cookieMonster { color: #0000ff; }
  `

  return run(input, {
    theme: {
      colors: {
        yellow: '#f7cc50',
      },
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('quotes are preserved around default values', () => {
  const input = `
    .heading { font-family: theme('fonts.sans', "Helvetica Neue"); }
  `

  const output = `
    .heading { font-family: "Helvetica Neue"; }
  `

  return run(input, {
    theme: {
      fonts: {
        serif: 'Constantia',
      },
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('an unquoted list is valid as a default value', () => {
  const input = `
    .heading { font-family: theme('fonts.sans', Helvetica, Arial, sans-serif); }
  `

  const output = `
    .heading { font-family: Helvetica, Arial, sans-serif; }
  `

  return run(input, {
    theme: {
      fonts: {
        serif: 'Constantia',
      },
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('array values are joined by default', () => {
  const input = `
    .heading { font-family: theme('fontFamily.sans'); }
  `

  const output = `
    .heading { font-family: Inter, Helvetica, sans-serif; }
  `

  return run(input, {
    theme: {
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'sans-serif'],
      },
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font sizes are retrieved without default line-heights or letter-spacing', () => {
  const input = `
    .heading-1 { font-size: theme('fontSize.lg'); }
    .heading-2 { font-size: theme('fontSize.xl'); }
  `

  const output = `
    .heading-1 { font-size: 20px; }
    .heading-2 { font-size: 24px; }
  `

  return run(input, {
    theme: {
      fontSize: {
        lg: ['20px', '28px'],
        xl: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
      },
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('outlines are retrieved without default outline-offset', () => {
  const input = `
    .element { outline: theme('outline.black'); }
  `

  const output = `
    .element { outline: 2px dotted black; }
  `

  return run(input, {
    theme: {
      outline: {
        black: ['2px dotted black', '4px'],
      },
    },
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

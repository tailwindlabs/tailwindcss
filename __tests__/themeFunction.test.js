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
  }).then((result) => {
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
  }).then((result) => {
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
  }).then((result) => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('quotes are preserved around default values', () => {
  const input = `
    .heading { font-family: theme('fontFamily.sans', "Helvetica Neue"); }
  `

  const output = `
    .heading { font-family: "Helvetica Neue"; }
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
  const input = `
    .heading { font-family: theme('fontFamily.sans', Helvetica, Arial, sans-serif); }
  `

  const output = `
    .heading { font-family: Helvetica, Arial, sans-serif; }
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
  const input = `
    .heading { color: theme('colours.gray.100'); }
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
  const input = `
    .heading { color: theme('colors.red'); }
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
  const input = `
    .heading { color: theme('colors.yellw'); }
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
  const input = `
    .heading { color: theme('colors.yellow.100'); }
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
  const input = `
    .heading { color: theme('colors.yellow'); }
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
  const input = `
    .heading { color: theme('colors'); }
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
  const input = `
    .heading { color: theme('colors'); }
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
  }).then((result) => {
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
  }).then((result) => {
    expect(result.css).toMatchCss(output)
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
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('font-family values are joined when an array', () => {
  const input = `
    .element { font-family: theme('fontFamily.sans'); }
  `

  const output = `
    .element { font-family: Helvetica, Arial, sans-serif; }
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
  const input = `
    .element { box-shadow: theme('boxShadow.wtf'); }
  `

  const output = `
    .element { box-shadow: 0 0 2px black, 1px 2px 3px white; }
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
  const input = `
    .element { transition-property: theme('transitionProperty.colors'); }
  `

  const output = `
    .element { transition-property: color, fill; }
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
  const input = `
    .element { transition-duration: theme('transitionDuration.lol'); }
  `

  const output = `
    .element { transition-duration: 1s, 2s; }
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

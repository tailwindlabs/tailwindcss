import postcss from 'postcss'
import plugin from '../src/lib/evaluateTailwindFunctions'

function run(input, opts = {}) {
  return postcss([plugin(() => opts)]).process(input, { from: undefined })
}

test('it looks up values in the config using dot notation', () => {
  const input = `
    .banana { color: config('colors.yellow'); }
  `

  const output = `
    .banana { color: #f7cc50; }
  `

  return run(input, {
    colors: {
      yellow: '#f7cc50',
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('quotes are optional around the lookup path', () => {
  const input = `
    .banana { color: config(colors.yellow); }
  `

  const output = `
    .banana { color: #f7cc50; }
  `

  return run(input, {
    colors: {
      yellow: '#f7cc50',
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('a default value can be provided', () => {
  const input = `
    .cookieMonster { color: config('colors.blue', #0000ff); }
  `

  const output = `
    .cookieMonster { color: #0000ff; }
  `

  return run(input, {
    colors: {
      yellow: '#f7cc50',
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('quotes are preserved around default values', () => {
  const input = `
    .heading { font-family: config('fonts.sans', "Helvetica Neue"); }
  `

  const output = `
    .heading { font-family: "Helvetica Neue"; }
  `

  return run(input, {
    fonts: {
      serif: 'Constantia',
    },
  }).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

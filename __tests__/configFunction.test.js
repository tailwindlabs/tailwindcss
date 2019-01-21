import _ from 'lodash'
import postcss from 'postcss'
import config from '../defaultConfig.stub.js'
import plugin from '../src/lib/evaluateTailwindFunctions'
import processPlugins from '../src/util/processPlugins'

function run(input, opts = config) {
  return postcss([
    plugin(opts, processPlugins(_.get(opts, 'plugins', []), opts).configValues),
  ]).process(input, {
    from: undefined,
  })
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

test('plugins can register values that should be available to the config function', () => {
  const input = `
    .banana { color: config('banana.sandwich'); }
  `

  const output = `
    .banana { color: blue; }
  `

  return run(input, {
    plugins: [
      function({ addConfig }) {
        addConfig('banana', {
          sandwich: 'blue',
        })
      },
    ],
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('plugin config values do not override first-class config values', () => {
  const input = `
    .banana { color: config('separator'); }
  `

  const output = `
    .banana { color: _; }
  `

  return run(input, {
    separator: '_',
    plugins: [
      function({ addConfig }) {
        addConfig('separator', '+')
      },
    ],
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

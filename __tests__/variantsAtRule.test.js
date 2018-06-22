import postcss from 'postcss'
import plugin from '../src/lib/substituteVariantsAtRules'
import config from '../defaultConfig.stub.js'

function run(input, opts = () => config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

test('it can generate hover variants', () => {
  const input = `
    @variants hover {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .hover\\:banana:hover { color: yellow; }
      .hover\\:chocolate:hover { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it can generate active variants', () => {
  const input = `
    @variants active {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .active\\:banana:active { color: yellow; }
      .active\\:chocolate:active { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it can generate focus variants', () => {
  const input = `
    @variants focus {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .focus\\:banana:focus { color: yellow; }
      .focus\\:chocolate:focus { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it can generate group-hover variants', () => {
  const input = `
    @variants group-hover {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .group:hover .group-hover\\:banana { color: yellow; }
      .group:hover .group-hover\\:chocolate { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it can generate hover, active and focus variants', () => {
  const input = `
    @variants group-hover, hover, focus, active {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .group:hover .group-hover\\:banana { color: yellow; }
      .group:hover .group-hover\\:chocolate { color: brown; }
      .hover\\:banana:hover { color: yellow; }
      .hover\\:chocolate:hover { color: brown; }
      .focus\\:banana:focus { color: yellow; }
      .focus\\:chocolate:focus { color: brown; }
      .active\\:banana:active { color: yellow; }
      .active\\:chocolate:active { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it wraps the output in a responsive at-rule if responsive is included as a variant', () => {
  const input = `
    @variants responsive, hover, focus {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
    @responsive {
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .hover\\:banana:hover { color: yellow; }
      .hover\\:chocolate:hover { color: brown; }
      .focus\\:banana:focus { color: yellow; }
      .focus\\:chocolate:focus { color: brown; }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('variants are generated in the order specified', () => {
  const input = `
    @variants focus, active, hover {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .focus\\:banana:focus { color: yellow; }
      .focus\\:chocolate:focus { color: brown; }
      .active\\:banana:active { color: yellow; }
      .active\\:chocolate:active { color: brown; }
      .hover\\:banana:hover { color: yellow; }
      .hover\\:chocolate:hover { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('plugin variants work', () => {
  const input = `
    @variants first-child {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .first-child\\:banana:first-child { color: yellow; }
      .first-child\\:chocolate:first-child { color: brown; }
  `

  return run(input, () => ({
    ...config,
    plugins: [
      ...config.plugins,
      function({ addVariant }) {
        addVariant('first-child', ({ className, separator }) => {
          return `.first-child${separator}${className}:first-child`
        })
      },
    ],
  })).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

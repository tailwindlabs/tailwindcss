import postcss from 'postcss'
import plugin from '../src/lib/substituteVariantsAtRules'
import config from '../defaultConfig.stub.js'
import processPlugins from '../src/util/processPlugins'

function run(input, opts = config) {
  return postcss([plugin(opts, processPlugins(opts.plugins, opts))]).process(input, { from: undefined })
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

test('it can generate focus-within variants', () => {
  const input = `
    @variants focus-within {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .focus-within\\:banana:focus-within { color: yellow; }
      .focus-within\\:chocolate:focus-within { color: brown; }
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

test('it can generate hover, active and focus variants for multiple classes in one rule', () => {
  const input = `
    @variants hover, focus, active {
      .banana, .lemon { color: yellow; }
      .chocolate, .coconut { color: brown; }
    }
  `

  const output = `
      .banana, .lemon { color: yellow; }
      .chocolate, .coconut { color: brown; }
      .hover\\:banana:hover, .hover\\:lemon:hover { color: yellow; }
      .hover\\:chocolate:hover, .hover\\:coconut:hover { color: brown; }
      .focus\\:banana:focus, .focus\\:lemon:focus { color: yellow; }
      .focus\\:chocolate:focus, .focus\\:coconut:focus { color: brown; }
      .active\\:banana:active, .active\\:lemon:active { color: yellow; }
      .active\\:chocolate:active, .active\\:coconut:active { color: brown; }
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

  return run(input, {
    ...config,
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('plugin variants can modify rules using the raw PostCSS API', () => {
  const input = `
    @variants important {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      .\\!banana { color: yellow !important; }
      .\\!chocolate { color: brown !important; }
  `

  return run(input, {
    ...config,
    plugins: [
      ...config.plugins,
      function({ addVariant }) {
        addVariant('important', ({ container }) => {
          container.walkRules(rule => {
            rule.selector = `.\\!${rule.selector.slice(1)}`
            rule.walkDecls(decl => {
              decl.important = true
            })
          })
        })
      },
    ],
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('plugin variants can modify selectors with a simplified API', () => {
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

  return run(input, {
    ...config,
    plugins: [
      ...config.plugins,
      function({ addVariant }) {
        addVariant('first-child', ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.first-child${separator}${className}:first-child`
          })
        })
      },
    ],
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('plugin variants can wrap rules in another at-rule using the raw PostCSS API', () => {
  const input = `
    @variants supports-grid {
      .banana { color: yellow; }
      .chocolate { color: brown; }
    }
  `

  const output = `
      .banana { color: yellow; }
      .chocolate { color: brown; }
      @supports (display: grid) {
        .supports-grid\\:banana { color: yellow; }
        .supports-grid\\:chocolate { color: brown; }
      }
  `

  return run(input, {
    ...config,
    plugins: [
      ...config.plugins,
      function({ addVariant }) {
        addVariant('supports-grid', ({ container, separator }) => {
          const supportsRule = postcss.atRule({ name: 'supports', params: '(display: grid)' })
          supportsRule.nodes = container.nodes
          container.nodes = [supportsRule]
          supportsRule.walkRules(rule => {
            rule.selector = `.supports-grid${separator}${rule.selector.slice(1)}`
          })
        })
      },
    ],
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

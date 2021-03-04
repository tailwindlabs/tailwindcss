import postcss from 'postcss'
import variantsAtRulesPlugin from '../src/lib/substituteVariantsAtRules'
import responsiveAtRulesPlugin from '../src/lib/substituteResponsiveAtRules'
import processPlugins from '../src/util/processPlugins'
import resolveConfig from '../src/util/resolveConfig'
import config from '../stubs/defaultConfig.stub.js'

function run(input, opts = config) {
  const resolved = resolveConfig([opts])
  return postcss([
    variantsAtRulesPlugin(resolved, processPlugins(resolved.plugins, resolved)),
    responsiveAtRulesPlugin(resolved),
  ]).process(input, {
    from: undefined,
  })
}

test('the dark variant uses the last class as target by default when the mode is set to media', () => {
  const input = `
    @variants dark {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    @media (prefers-color-scheme: dark) {
      .banana .dark\\:peel { color: yellow; }
    }
  `

  return run(input, { darkMode: 'media' }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the dark variant uses the last class as target by default when the mode is set to class', () => {
  const input = `
    @variants dark {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .dark .banana .dark\\:peel { color: yellow; }
  `

  return run(input, { darkMode: 'class' }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the motion-safe variant uses the last class as target by default', () => {
  const input = `
    @variants motion-safe {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    @media (prefers-reduced-motion: no-preference) {
      .banana .motion-safe\\:peel { color: yellow; }
    }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the motion-reduce variant uses the last class as target by default', () => {
  const input = `
    @variants motion-reduce {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    @media (prefers-reduced-motion: reduce) {
      .banana .motion-reduce\\:peel { color: yellow; }
    }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the hover variant uses the last class as target by default', () => {
  const input = `
    @variants hover {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .hover\\:peel:hover { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the focus variant uses the last class as target by default', () => {
  const input = `
    @variants focus {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .focus\\:peel:focus { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the focus-within variant uses the last class as target by default', () => {
  const input = `
    @variants focus-within {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .focus-within\\:peel:focus-within { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the focus-visible variant uses the last class as target by default', () => {
  const input = `
    @variants focus-visible {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .focus-visible\\:peel:focus-visible { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the active variant uses the last class as target by default', () => {
  const input = `
    @variants active {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .active\\:peel:active { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the visited variant uses the last class as target by default', () => {
  const input = `
    @variants visited {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .visited\\:peel:visited { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the disabled variant uses the last class as target by default', () => {
  const input = `
    @variants disabled {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .disabled\\:peel:disabled { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the checked variant uses the last class as target by default', () => {
  const input = `
    @variants checked {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .checked\\:peel:checked { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the first variant uses the last class as target by default', () => {
  const input = `
    @variants first {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .first\\:peel:first-child { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the last variant uses the last class as target by default', () => {
  const input = `
    @variants last {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .last\\:peel:last-child { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the odd variant uses the last class as target by default', () => {
  const input = `
    @variants odd {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .odd\\:peel:nth-child(odd) { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the even variant uses the last class as target by default', () => {
  const input = `
    @variants even {
      .banana .peel { color: yellow; }
    }
  `

  const output = `
    .banana .peel { color: yellow; }
    .banana .even\\:peel:nth-child(even) { color: yellow; }
  `

  return run(input).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('the responsive variant uses the last class as target by default', () => {
  const input = `
    @responsive {
      .banana .peel { color: yellow; }
    }

    @tailwind screens;
  `

  const output = `
    .banana .peel { color: yellow; }
    @media (min-width: 500px) {
      .banana .sm\\:peel { color: yellow; }
    }
    @media (min-width: 750px) {
      .banana .md\\:peel { color: yellow; }
    }
    @media (min-width: 1000px) {
      .banana .lg\\:peel { color: yellow; }
    }
  `

  return run(input, {
    theme: {
      screens: {
        sm: '500px',
        md: '750px',
        lg: '1000px',
      },
    },
    separator: ':',
  }).then((result) => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

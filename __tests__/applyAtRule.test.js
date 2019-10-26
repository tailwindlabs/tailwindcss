import postcss from 'postcss'
import substituteClassApplyAtRules from '../src/lib/substituteClassApplyAtRules'
import processPlugins from '../src/util/processPlugins'
import resolveConfig from '../src/util/resolveConfig'
import corePlugins from '../src/corePlugins'
import defaultConfig from '../stubs/defaultConfig.stub.js'

const resolvedDefaultConfig = resolveConfig([defaultConfig])

const { utilities: defaultUtilities } = processPlugins(
  corePlugins(resolvedDefaultConfig),
  resolvedDefaultConfig
)

function run(input, config = resolvedDefaultConfig, utilities = defaultUtilities) {
  return postcss([substituteClassApplyAtRules(config, utilities)]).process(input, {
    from: undefined,
  })
}

test("it copies a class's declarations into itself", () => {
  const output = '.a { color: red; } .b { color: red; }'

  return run('.a { color: red; } .b { @apply .a; }').then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('selectors with invalid characters do not need to be manually escaped', () => {
  const input = `
    .a\\:1\\/2 { color: red; }
    .b { @apply .a:1/2; }
  `

  const expected = `
    .a\\:1\\/2 { color: red; }
    .b { color: red; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('it removes important from applied classes by default', () => {
  const input = `
    .a { color: red !important; }
    .b { @apply .a; }
  `

  const expected = `
    .a { color: red !important; }
    .b { color: red; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('applied rules can be made !important', () => {
  const input = `
    .a { color: red; }
    .b { @apply .a !important; }
  `

  const expected = `
    .a { color: red; }
    .b { color: red !important; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('cssnext custom property sets are preserved', () => {
  const input = `
    .a {
      color: red;
    }
    .b {
      @apply .a --custom-property-set;
    }
  `

  const expected = `
    .a {
      color: red;
    }
    .b {
      color: red;
      @apply --custom-property-set;
    }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('it fails if the class does not exist', () => {
  return run('.b { @apply .a; }').catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('applying classes that are defined in a media query is not supported', () => {
  const input = `
    @media (min-width: 300px) {
      .a { color: blue; }
    }

    .b {
      @apply .a;
    }
  `
  expect.assertions(1)
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('applying classes that are ever used in a media query is not supported', () => {
  const input = `
    .a {
      color: red;
    }

    @media (min-width: 300px) {
      .a { color: blue; }
    }

    .b {
      @apply .a;
    }
  `
  expect.assertions(1)
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('it does not match classes that include pseudo-selectors', () => {
  const input = `
    .a:hover {
      color: red;
    }

    .b {
      @apply .a;
    }
  `
  expect.assertions(1)
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('it does not match classes that have multiple rules', () => {
  const input = `
    .a {
      color: red;
    }

    .b {
      @apply .a;
    }

    .a {
      color: blue;
    }
  `
  expect.assertions(1)
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('you can apply utility classes that do not actually exist as long as they would exist if utilities were being generated', () => {
  const input = `
    .foo { @apply .mt-4; }
  `

  const expected = `
    .foo { margin-top: 1rem; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply utility classes without using the given prefix', () => {
  const input = `
    .foo { @apply .tw-mt-4 .mb-4; }
  `

  const expected = `
    .foo { margin-top: 1rem; margin-bottom: 1rem; }
  `

  const config = resolveConfig([
    {
      ...defaultConfig,
      prefix: 'tw-',
    },
  ])

  return run(input, config, processPlugins(corePlugins(config), config).utilities).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply utility classes without using the given prefix when using a function for the prefix', () => {
  const input = `
    .foo { @apply .tw-mt-4 .mb-4; }
  `

  const expected = `
    .foo { margin-top: 1rem; margin-bottom: 1rem; }
  `

  const config = resolveConfig([
    {
      ...defaultConfig,
      prefix: () => {
        return 'tw-'
      },
    },
  ])

  return run(input, config, processPlugins(corePlugins(config), config).utilities).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply utility classes without specificity prefix even if important (selector) is used', () => {
  const input = `
    .foo { @apply .mt-8 .mb-8; }
  `

  const expected = `
    .foo { margin-top: 2rem; margin-bottom: 2rem; }
  `

  const config = resolveConfig([
    {
      ...defaultConfig,
      important: '#app',
    },
  ])

  return run(input, config, processPlugins(corePlugins(config), config).utilities).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply utility classes without using the given prefix even if important (selector) is used', () => {
  const input = `
    .foo { @apply .tw-mt-4 .mb-4; }
  `

  const expected = `
    .foo { margin-top: 1rem; margin-bottom: 1rem; }
  `

  const config = resolveConfig([
    {
      ...defaultConfig,
      prefix: 'tw-',
      important: '#app',
    },
  ])

  return run(input, config, processPlugins(corePlugins(config), config).utilities).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

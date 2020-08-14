import postcss from 'postcss'
import substituteClassApplyAtRules from '../src/lib/substituteClassApplyAtRules'
import processPlugins from '../src/util/processPlugins'
import resolveConfig from '../src/util/resolveConfig'
import corePlugins from '../src/corePlugins'
import defaultConfig from '../stubs/defaultConfig.stub.js'
import cloneNodes from '../src/util/cloneNodes'

const resolvedDefaultConfig = resolveConfig([defaultConfig])

const defaultProcessedPlugins = processPlugins(
  [...corePlugins(resolvedDefaultConfig), ...resolvedDefaultConfig.plugins],
  resolvedDefaultConfig
)

const defaultGetProcessedPlugins = function() {
  return {
    ...defaultProcessedPlugins,
    base: cloneNodes(defaultProcessedPlugins.base),
    components: cloneNodes(defaultProcessedPlugins.components),
    utilities: cloneNodes(defaultProcessedPlugins.utilities),
  }
}

function run(
  input,
  config = resolvedDefaultConfig,
  getProcessedPlugins = () =>
    config === resolvedDefaultConfig
      ? defaultGetProcessedPlugins()
      : processPlugins(corePlugins(config), config)
) {
  config.experimental = {
    applyComplexClasses: true,
  }
  return postcss([substituteClassApplyAtRules(config, getProcessedPlugins)]).process(input, {
    from: undefined,
  })
}

test('it copies class declarations into itself', () => {
  const output = '.a { color: red; } .b { color: red; }'

  return run('.a { color: red; } .b { @apply a; }').then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('selectors with invalid characters do not need to be manually escaped', () => {
  const input = `
    .a\\:1\\/2 { color: red; }
    .b { @apply a:1/2; }
  `

  const expected = `
    .a\\:1\\/2 { color: red; }
    .b { color: red; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('it removes important from applied classes by default', () => {
  const input = `
    .a { color: red !important; }
    .b { @apply a; }
  `

  const expected = `
    .a { color: red !important; }
    .b { color: red; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('applied rules can be made !important', () => {
  const input = `
    .a { color: red; }
    .b { @apply a !important; }
  `

  const expected = `
    .a { color: red; }
    .b { color: red !important; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('cssnext custom property sets are no longer supported', () => {
  const input = `
    .a {
      color: red;
    }
    .b {
      @apply a --custom-property-set;
    }
  `

  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('it fails if the class does not exist', () => {
  return run('.b { @apply a; }').catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('applying classes that are defined in a media query is supported', () => {
  const input = `
    @media (min-width: 300px) {
      .a { color: blue; }
    }

    .b {
      @apply a;
    }
  `

  const output = `
    @media (min-width: 300px) {
      .a { color: blue; }
    }
    @media (min-width: 300px) {
      .b { color: blue; }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('applying classes that are used in a media query is supported', () => {
  const input = `
    .a {
      color: red;
    }

    @media (min-width: 300px) {
      .a { color: blue; }
    }

    .b {
      @apply a;
    }
  `

  const output = `
    .a {
      color: red;
    }

    @media (min-width: 300px) {
      .a { color: blue; }
    }

    .b {
      color: red;
    }

    @media (min-width: 300px) {
      .b { color: blue; }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it matches classes that include pseudo-selectors', () => {
  const input = `
    .a:hover {
      color: red;
    }

    .b {
      @apply a;
    }
  `

  const output = `
    .a:hover {
      color: red;
    }

    .b:hover {
      color: red;
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it matches classes that have multiple rules', () => {
  const input = `
    .a {
      color: red;
    }

    .b {
      @apply a;
    }

    .a {
      color: blue;
    }
  `

  const output = `
    .a {
      color: red;
    }

    .b {
      color: red;
      color: blue;
    }

    .a {
      color: blue;
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply utility classes that do not actually exist as long as they would exist if utilities were being generated', () => {
  const input = `
    .foo { @apply mt-4; }
  `

  const expected = `
    .foo { margin-top: 1rem; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('the shadow lookup is only used if no @tailwind rules were in the source tree', () => {
  const input = `
    @tailwind base;
    .foo { @apply mt-4; }
  `

  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('you can apply a class that is defined in multiple rules', () => {
  const input = `
    .foo {
      color: red;
    }
    .bar {
      @apply foo;
    }
    .foo {
      opacity: .5;
    }
  `
  const expected = `
    .foo {
      color: red;
    }
    .bar {
      color: red;
      opacity: .5;
    }
    .foo {
      opacity: .5;
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply a class that is defined in a media query', () => {
  const input = `
    .foo {
      @apply sm:text-center;
    }
  `
  const expected = `
    @media (min-width: 640px) {
      .foo {
        text-align: center
      }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply pseudo-class variant utilities', () => {
  const input = `
    .foo {
      @apply hover:opacity-50;
    }
  `
  const expected = `
    .foo:hover {
      opacity: 0.5
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply responsive pseudo-class variant utilities', () => {
  const input = `
    .foo {
      @apply sm:hover:opacity-50;
    }
  `
  const expected = `
    @media (min-width: 640px) {
      .foo:hover {
        opacity: 0.5
      }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply the container component', () => {
  const input = `
    .foo {
      @apply container;
    }
  `
  const expected = `
    .foo {
      width: 100%;
    }
    @media (min-width: 640px) {
      .foo {
        max-width: 640px;
      }
    }
    @media (min-width: 768px) {
      .foo {
        max-width: 768px;
      }
    }
    @media (min-width: 1024px) {
      .foo {
        max-width: 1024px;
      }
    }
    @media (min-width: 1280px) {
      .foo {
        max-width: 1280px;
      }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('classes are applied according to CSS source order, not apply order', () => {
  const input = `
    .foo {
      color: red;
    }
    .bar {
      color: blue;
    }
    .baz {
      @apply bar foo;
    }
  `
  const expected = `
    .foo {
      color: red;
    }
    .bar {
      color: blue;
    }
    .baz {
      color: red;
      color: blue;
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply utilities with multi-class selectors like group-hover variants', () => {
  const input = `
    .foo {
      @apply group-hover:bar;
    }
    .bar {
      color: blue;
    }
    .group:hover .group-hover\\:bar {
      color: blue;
    }
  `
  const expected = `
    .group:hover .foo {
      color: blue;
    }
    .bar {
      color: blue;
    }
    .group:hover .group-hover\\:bar {
      color: blue;
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply classes recursively', () => {
  const input = `
    .foo {
      @apply bar;
    }
    .bar {
      @apply baz;
    }
    .baz {
      color: blue;
    }
  `
  const expected = `
    .foo {
      color: blue;
    }
    .bar {
      color: blue;
    }
    .baz {
      color: blue;
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('applied classes are always inserted before subsequent declarations in the same rule, even if it means moving those subsequent declarations to a new rule', () => {
  const input = `
    .foo {
      background: blue;
      @apply opacity-50 hover:opacity-100 text-right sm:align-middle;
      color: red;
    }
  `
  const expected = `
    .foo {
      background: blue;
      opacity: 0.5;
    }
    .foo:hover {
      opacity: 1;
    }
    .foo {
      text-align: right;
    }
    @media (min-width: 640px) {
      .foo {
        vertical-align: middle;
      }
    }
    .foo {
      color: red;
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('adjacent rules are collapsed after being applied', () => {
  const input = `
    .foo {
      @apply hover:bg-white hover:opacity-50 absolute text-right sm:align-middle sm:text-center;
    }
  `
  const expected = `
    .foo:hover {
      --bg-opacity: 1;
      background-color: #fff;
      background-color: rgba(255, 255, 255, var(--bg-opacity));
      opacity: 0.5;
    }
    .foo {
      position: absolute;
      text-align: right;
    }
    @media (min-width: 640px) {
      .foo {
        text-align: center;
        vertical-align: middle;
      }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('applying a class applies all instances of that class, even complex selectors', () => {
  const input = `
    h1 > p:hover .banana:first-child * {
      @apply bar;
    }
    .bar {
      color: blue;
    }
    @media (print) {
      @supports (display: grid) {
        .baz .bar:hover {
          text-align: right;
          float: left;
        }
      }
    }
    `
  const expected = `
    h1 > p:hover .banana:first-child * {
      color: blue;
    }
    @media (print) {
      @supports (display: grid) {
        .baz h1 > p:hover .banana:first-child *:hover {
          text-align: right;
          float: left;
        }
      }
    }
    .bar {
      color: blue;
    }
    @media (print) {
      @supports (display: grid) {
        .baz .bar:hover {
          text-align: right;
          float: left;
        }
      }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('you can apply classes to rules within at-rules', () => {
  const input = `
    @supports (display: grid) {
      .baz .bar {
        @apply text-right float-left hover:opacity-50 md:float-right;
      }
    }
  `
  const expected = `
    @supports (display: grid) {
      .baz .bar {
        float: left;
      }
      .baz .bar:hover {
        opacity: 0.5;
      }
      .baz .bar {
        text-align: right;
      }
      @media (min-width: 768px) {
        .baz .bar {
          float: right;
        }
      }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

describe('using apply with the prefix option', () => {
  test('applying a class including the prefix', () => {
    const input = `
      .foo { @apply tw-mt-4; }
    `

    const expected = `
      .foo { margin-top: 1rem; }
    `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: 'tw-',
      },
    ])

    return run(input, config).then(result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    })
  })

  test('applying a class including the prefix when using a prefix function', () => {
    const input = `
      .foo { @apply tw-func-mt-4; }
    `

    const expected = `
      .foo { margin-top: 1rem; }
    `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: () => {
          return 'tw-func-'
        },
      },
    ])

    return run(input, config).then(result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    })
  })

  test('applying a class without the prefix fails', () => {
    const input = `
      .foo { @apply mt-4; }
    `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: 'tw-',
      },
    ])

    return run(input, config).catch(e => {
      expect(e).toMatchObject({ name: 'CssSyntaxError' })
    })
  })

  test('custom classes with no prefix can be applied', () => {
    const input = `
      .foo { @apply mt-4; }
      .mt-4 { color: red; }
    `

    const expected = `
      .foo { color: red; }
      .mt-4 { color: red; }
    `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: 'tw-',
      },
    ])

    return run(input, config).then(result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    })
  })

  test('built-in prefixed utilities can be extended and applied', () => {
    const input = `
      .foo { @apply tw-mt-4; }
      .tw-mt-4 { color: red; }
    `

    const expected = `
      .foo { margin-top: 1rem; color: red; }
      .tw-mt-4 { color: red; }
    `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: 'tw-',
      },
    ])

    return run(input, config).then(result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    })
  })

  test('a helpful error message is provided if it appears the user forgot to include their prefix', () => {
    const input = `
        .foo { @apply mt-4; }
      `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: 'tw-',
      },
    ])

    expect.assertions(1)

    return run(input, config).catch(e => {
      expect(e).toMatchObject({
        name: 'CssSyntaxError',
        reason: 'The `mt-4` class does not exist, but `tw-mt-4` does. Did you forget the prefix?',
      })
    })
  })

  test('you can apply classes with important and a prefix enabled', () => {
    const input = `
      .foo { @apply tw-mt-4; }
    `

    const expected = `
      .foo { margin-top: 1rem; }
    `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: 'tw-',
        important: true,
      },
    ])

    return run(input, config).then(result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    })
  })

  test('you can apply classes with an important selector and a prefix enabled', () => {
    const input = `
      .foo { @apply tw-mt-4; }
    `

    const expected = `
      .foo { margin-top: 1rem; }
    `

    const config = resolveConfig([
      {
        ...defaultConfig,
        prefix: 'tw-',
        important: '#app',
      },
    ])

    return run(input, config).then(result => {
      expect(result.css).toMatchCss(expected)
      expect(result.warnings().length).toBe(0)
    })
  })
})

test('you can apply utility classes when a selector is used for the important option', () => {
  const input = `
    .foo {
      @apply mt-8 mb-8;
    }
  `

  const expected = `
    .foo {
      margin-top: 2rem;
      margin-bottom: 2rem;
    }
  `

  const config = resolveConfig([
    {
      ...defaultConfig,
      important: '#app',
    },
  ])

  return run(input, config).then(result => {
    expect(result.css).toMatchCss(expected)
    expect(result.warnings().length).toBe(0)
  })
})

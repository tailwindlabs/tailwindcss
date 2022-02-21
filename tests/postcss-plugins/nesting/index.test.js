import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import plugin from '../../../src/postcss-plugins/nesting'
import { visitorSpyPlugin } from './plugins.js'

it('should be possible to load a custom nesting plugin', async () => {
  let input = css`
    .foo {
      color: black;
      @screen md {
        color: blue;
      }
    }
  `

  expect(
    await run(input, function (root) {
      root.walkRules((rule) => {
        rule.selector += '-modified'
      })
    })
  ).toMatchCss(css`
    .foo-modified {
      color: black;
      @media screen(md) {
        color: blue;
      }
    }
  `)
})

it('should be possible to load a custom nesting plugin by name (string) instead', async () => {
  let input = css`
    .foo {
      color: black;
      @screen md {
        color: blue;
      }
    }
  `

  expect(await run(input, 'postcss-nested')).toMatchCss(css`
    .foo {
      color: black;
    }

    @media screen(md) {
      .foo {
        color: blue;
      }
    }
  `)
})

it('should default to the bundled postcss-nested plugin (no options)', async () => {
  let input = css`
    .foo {
      color: black;
      @screen md {
        color: blue;
      }
    }
  `

  expect(await run(input)).toMatchCss(css`
    .foo {
      color: black;
    }

    @media screen(md) {
      .foo {
        color: blue;
      }
    }
  `)
})

it('should default to the bundled postcss-nested plugin (empty options)', async () => {
  let input = css`
    .foo {
      color: black;
      @screen md {
        color: blue;
      }
    }
  `

  expect(await run(input, {})).toMatchCss(css`
    .foo {
      color: black;
    }

    @media screen(md) {
      .foo {
        color: blue;
      }
    }
  `)
})

it('should be possible to use postcss-nested plugin with options', async () => {
  let input = css`
    .foo {
      color: black;
      @screen md {
        color: blue;
      }
    }
  `

  expect(await run(input, postcssNested({ noIsPseudoSelector: true }))).toMatchCss(css`
    .foo {
      color: black;
    }

    @media screen(md) {
      .foo {
        color: blue;
      }
    }
  `)
})

test('@screen rules are replaced with media queries', async () => {
  let input = css`
    .foo {
      color: black;
      @screen md {
        color: blue;
      }
    }
  `

  expect(await run(input, postcssNested)).toMatchCss(css`
    .foo {
      color: black;
    }

    @media screen(md) {
      .foo {
        color: blue;
      }
    }
  `)
})

test('@screen rules can work with `@apply`', async () => {
  let input = css`
    .foo {
      @apply bg-black;
      @screen md {
        @apply bg-blue-500;
      }
    }
  `

  expect(await run(input, postcssNested)).toMatchCss(css`
    .foo {
      @apply bg-black;
    }

    @media screen(md) {
      .foo {
        @apply bg-blue-500;
      }
    }
  `)
})

test('nesting does not break downstream plugin visitors', async () => {
  let input = css`
    .foo {
      color: black;
    }
    @suppoerts (color: blue) {
      .foo {
        color: blue;
      }
    }
    /* Comment */
  `

  let spyPlugin = visitorSpyPlugin()

  let plugins = [plugin(postcssNested), spyPlugin.plugin]

  let result = await run(input, plugins)

  expect(result).toMatchCss(css`
    .foo {
      color: black;
    }
    @suppoerts (color: blue) {
      .foo {
        color: blue;
      }
    }
    /* Comment */
  `)

  expect(spyPlugin.spies.Once).toHaveBeenCalled()
  expect(spyPlugin.spies.OnceExit).toHaveBeenCalled()
  expect(spyPlugin.spies.Root).toHaveBeenCalled()
  expect(spyPlugin.spies.Rule).toHaveBeenCalled()
  expect(spyPlugin.spies.AtRule).toHaveBeenCalled()
  expect(spyPlugin.spies.Comment).toHaveBeenCalled()
  expect(spyPlugin.spies.Declaration).toHaveBeenCalled()
})

// ---

function indentRecursive(node, indent = 0) {
  node.each &&
    node.each((child, i) => {
      if (!child.raws.before || child.raws.before.includes('\n')) {
        child.raws.before = `\n${node.type !== 'rule' && i > 0 ? '\n' : ''}${'  '.repeat(indent)}`
      }
      child.raws.after = `\n${'  '.repeat(indent)}`
      indentRecursive(child, indent + 1)
    })
}

function formatNodes(root) {
  indentRecursive(root)
  if (root.first) {
    root.first.raws.before = ''
  }
}

async function run(input, options) {
  let plugins = []

  if (Array.isArray(options)) {
    plugins = options
  } else {
    plugins.push(options === undefined ? plugin : plugin(options))
  }

  plugins.push(formatNodes)

  let result = await postcss(plugins).process(input, {
    from: undefined,
  })

  return result.toString()
}

function css(templates) {
  return templates.join('')
}

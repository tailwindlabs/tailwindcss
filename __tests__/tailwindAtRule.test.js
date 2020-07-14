import postcss from 'postcss'
import plugin from '../src/lib/substituteTailwindAtRules'
import processPlugins from '../src/util/processPlugins'
import config from '../stubs/defaultConfig.stub.js'

function run(input, opts = config) {
  const plugins = [
    function({ addBase, addComponents, addUtilities }) {
      addBase({ base: { property: 'test' } })
      addComponents({ '.components': { property: 'test' } })
      addUtilities({ '.utilities': { property: 'test' } })
    },
  ]
  return postcss([plugin(opts, processPlugins(plugins, opts))]).process(input, {
    from: undefined,
  })
}

test('tailwind directives are replaced with their underlying CSS rules', () => {
  const input = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  const output = `
    /* tailwind start base */
    base { property: test }
    /* tailwind end base */
    /* tailwind start components */
    .components { property: test }
    /* tailwind end components */
    /* tailwind start screens components */
    @screens components;
    /* tailwind end screens components */
    /* tailwind start utilities */
    @variants {
      .utilities { property: test }
    }
    /* tailwind end utilities */
    /* tailwind start screens utilities */
    @screens utilities;
    /* tailwind end screens utilities */
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('root-level component classes are not part of the components group', () => {
  const input = `
    @tailwind base;
    @tailwind components;
    .btn { background: blue }
    @tailwind utilities;
    `

  const output = `
    /* tailwind start base */
    base { property: test }
    /* tailwind end base */

    /* tailwind start components */
    .components { property: test }
    /* tailwind end components */

    /* tailwind start screens components */
    @screens components;
    /* tailwind end screens components */

    .btn { background: blue }

    /* tailwind start utilities */
    @variants {
      .utilities { property: test }
    }
    /* tailwind end utilities */

    /* tailwind start screens utilities */
    @screens utilities;
    /* tailwind end screens utilities */
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('nested rules are included in the corresponding bucket', () => {
  const input = `
    @tailwind base {
      html { font-size: 20px }
    }
    @tailwind components {
      .btn { background: blue }
    }
    @tailwind utilities {
      .tabular-nums { font-variant-numeric: tabular-nums }
    }
    `

  const output = `
    /* tailwind start base */
    base { property: test }
    html { font-size: 20px }
    /* tailwind end base */

    /* tailwind start components */
    .components { property: test }
    .btn { background: blue }
    /* tailwind end components */

    /* tailwind start screens components */
    @screens components;
    /* tailwind end screens components */

    /* tailwind start utilities */
    @variants {
      .utilities { property: test }
    }
    .tabular-nums { font-variant-numeric: tabular-nums }
    /* tailwind end utilities */

    /* tailwind start screens utilities */
    @screens utilities
    /* tailwind end screens utilities */
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('nested responsive component classes have the components argument added automatically', () => {
  const input = `
    @tailwind base;
    @tailwind components {
      @responsive {
        .btn { background: blue }
      }
    }
    @tailwind utilities;
    `

  const output = `
    /* tailwind start base */
    base { property: test }
    /* tailwind end base */

    /* tailwind start components */
    .components { property: test }
    @responsive components {
      .btn { background: blue }
    }
    /* tailwind end components */

    /* tailwind start screens components */
    @screens components;
    /* tailwind end screens components */

    /* tailwind start utilities */
    @variants {
      .utilities { property: test }
    }
    /* tailwind end utilities */

    /* tailwind start screens utilities */
    @screens utilities;
    /* tailwind end screens utilities */
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('nested responsive component classes authored using the variants syntax have the components argument added automatically', () => {
  const input = `
    @tailwind base;
    @tailwind components {
      @variants responsive {
        .btn { background: blue }
      }
    }
    @tailwind utilities;
    `

  const output = `
    /* tailwind start base */
    base { property: test }
    /* tailwind end base */

    /* tailwind start components */
    .components { property: test }
    @responsive components {
      @variants {
        .btn { background: blue }
      }
    }
    /* tailwind end components */

    /* tailwind start screens components */
    @screens components;
    /* tailwind end screens components */

    /* tailwind start utilities */
    @variants {
      .utilities { property: test }
    }
    /* tailwind end utilities */

    /* tailwind start screens utilities */
    @screens utilities;
    /* tailwind end screens utilities */
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

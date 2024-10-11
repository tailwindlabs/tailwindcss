import dedent from 'dedent'
import { describe, expect, test } from 'vitest'
import { extractStaticImportMap, findSimplePlugins } from './extract-static-imports'

const js = dedent

describe('findSimplePlugins', () => {
  test('parses all export styles', () => {
    expect(
      findSimplePlugins(js`
        import plugin1 from './plugin1'
        import * as plugin2 from './plugin2'

        export default {
          plugins: [plugin1, plugin2, 'plugin3']
        }
    `),
    ).toEqual(['./plugin1', './plugin2', 'plugin3'])

    expect(
      findSimplePlugins(js`
        import plugin1 from './plugin1'
        import * as plugin2 from './plugin2'

        export default {
          plugins: [plugin1, plugin2, 'plugin3']
        } as any
    `),
    ).toEqual(['./plugin1', './plugin2', 'plugin3'])

    expect(
      findSimplePlugins(js`
        import plugin1 from './plugin1'
        import * as plugin2 from './plugin2'

        export default {
          plugins: [plugin1, plugin2, 'plugin3']
        } satisfies any
    `),
    ).toEqual(['./plugin1', './plugin2', 'plugin3'])

    expect(
      findSimplePlugins(js`
        import plugin1 from './plugin1'
        import * as plugin2 from './plugin2'

        module.exports =  {
          plugins: [plugin1, plugin2, 'plugin3']
        } as any
    `),
    ).toEqual(['./plugin1', './plugin2', 'plugin3'])

    expect(
      findSimplePlugins(js`
        import plugin1 from './plugin1'
        import * as plugin2 from './plugin2'

        module.exports =  {
          plugins: [plugin1, plugin2, 'plugin3']
        } satisfies any
    `),
    ).toEqual(['./plugin1', './plugin2', 'plugin3'])

    expect(
      findSimplePlugins(js`
      import plugin1 from './plugin1'
      import * as plugin2 from './plugin2'

      module.exports =  {
        plugins: [plugin1, plugin2, 'plugin3']
      }
    `),
    ).toEqual(['./plugin1', './plugin2', 'plugin3'])
  })

  test('bails out on inline plugins', () => {
    expect(
      findSimplePlugins(js`
      import plugin1 from './plugin1'

      export default {
        plugins: [plugin1, () => {} ]
      }
    `),
    ).toEqual(null)

    expect(
      findSimplePlugins(js`
      let plugin1 = () => {}

      export default {
        plugins: [plugin1]
      }
    `),
    ).toEqual(null)
  })

  test('bails out on named imports for plugins', () => {
    expect(
      findSimplePlugins(js`
      import {plugin1} from './plugin1'

      export default {
        plugins: [plugin1]
      }
    `),
    ).toEqual(null)
  })

  test('returns no plugins if none are exported', () => {
    expect(
      findSimplePlugins(js`
      export default {
        plugins: []
      }
    `),
    ).toEqual([])

    expect(
      findSimplePlugins(js`
      export default {}
    `),
    ).toEqual([])
  })
})

describe('extractStaticImportMap', () => {
  test('extracts different kind of imports from an ESM file', () => {
    let extracted = extractStaticImportMap(js`
    import plugin1 from './plugin1'
    import * as plugin2 from './plugin2'
    import plugin6, { plugin3, plugin4, default as plugin5 } from './plugin3'
    import plugin8, * as plugin7 from './plugin7'
  `)

    expect(extracted).toEqual({
      plugin1: { module: './plugin1', export: null },
      plugin2: { module: './plugin2', export: '*' },
      plugin3: { module: './plugin3', export: 'plugin3' },
      plugin4: { module: './plugin3', export: 'plugin4' },
      plugin5: { module: './plugin3', export: 'default' },
      plugin6: { module: './plugin3', export: null },
      plugin7: { module: './plugin7', export: '*' },
      plugin8: { module: './plugin7', export: null },
    })
  })
})

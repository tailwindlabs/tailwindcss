import prettier from 'prettier'
import { corePlugins } from '../src/corePlugins'
import colors from '../src/public/colors'
import defaultTheme from '../src/public/default-theme'
import fs from 'fs'
import path from 'path'

fs.writeFileSync(
  path.join(process.cwd(), 'types', 'generated', 'corePluginList.d.ts'),
  `export type CorePluginList = ${Object.keys(corePlugins)
    .map((p) => `'${p}'`)
    .join(' | ')}`
)

let colorsWithoutDeprecatedColors = Object.fromEntries(
  Object.entries(Object.getOwnPropertyDescriptors(colors))
    .filter(([_, { value }]) => {
      return typeof value !== 'undefined'
    })
    .map(([name, definition]) => [name, definition.value])
)

let deprecatedColors = Object.entries(Object.getOwnPropertyDescriptors(colors))
  .filter(([_, { value }]) => {
    return typeof value === 'undefined'
  })
  .map(([name, definition]) => {
    let warn = console.warn
    let messages = []
    console.warn = (...args) => messages.push(args.pop())
    definition.get()
    console.warn = warn
    let message = messages.join(' ').trim()
    let newColor = message.match(/renamed to `(.*)`/)[1]
    return `/** @deprecated ${message} */${name}: DefaultColors['${newColor}'],`
  })
  .join('\n')

fs.writeFileSync(
  path.join(process.cwd(), 'types', 'generated', 'colors.d.ts'),
  prettier.format(
    `export interface DefaultColors { ${JSON.stringify(colorsWithoutDeprecatedColors).slice(
      1,
      -1
    )}\n${deprecatedColors}\n}`,
    {
      semi: false,
      singleQuote: true,
      printWidth: 100,
      parser: 'typescript',
    }
  )
)

function typeCoveringAllValues(value) {
  let union = (values) => [...new Set(values.map((v) => typeCoveringAllValues(v)))].join(' | ')

  if (Array.isArray(value)) {
    return `(${union(value)})[]`
  }

  if (typeof value === 'object') {
    return union(Object.values(value))
  }

  if (typeof value === 'string') {
    return `string`
  }

  return `any`
}

const defaultThemeTypes = Object.entries(defaultTheme)
  .map(([name, value]) => {
    if (typeof value === 'string') {
      return [name, `string`]
    }

    if (typeof value === 'function') {
      return [name, null]
    }

    if (typeof value === 'object') {
      if (Object.keys(value).length === 0) {
        return [name, null]
      }

      let keyType = Object.keys(value)
        .map((key) => `'${key}'`)
        .join(' | ')
      let valueType = typeCoveringAllValues(value)

      return [name, `Record<${keyType}, ${valueType}>`]
    }

    return [name, `unknown`]
  })
  .filter(([, type]) => type !== null)
  .map(([name, type]) => `${name}: ${type}`)
  .join('\n')

fs.writeFileSync(
  path.join(process.cwd(), 'types', 'generated', 'default-theme.d.ts'),
  prettier.format(
    `
    import { Config } from '../../types'
    export type DefaultTheme = Config['theme'] & { ${defaultThemeTypes} }
  `,
    {
      semi: false,
      singleQuote: true,
      printWidth: 100,
      parser: 'typescript',
    }
  )
)

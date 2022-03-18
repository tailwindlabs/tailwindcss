import prettier from 'prettier'
import { corePlugins } from '../src/corePlugins'
import colors from '../src/public/colors'
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

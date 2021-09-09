import * as corePlugins from '../src/corePlugins'
import fs from 'fs'
import path from 'path'

let corePluginList = Object.keys(corePlugins).filter((plugin) => !plugin.includes('Variants'))

fs.writeFileSync(
  path.join(process.cwd(), 'src', 'corePluginList.js'),
  `export default ${JSON.stringify(corePluginList)}`
)

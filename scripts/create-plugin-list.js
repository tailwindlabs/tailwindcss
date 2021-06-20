import * as corePlugins from '../src/plugins'
import fs from 'fs'
import path from 'path'

const corePluginList = Object.keys(corePlugins)

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'corePluginList.js'),
  `export default ${JSON.stringify(corePluginList)}`
)

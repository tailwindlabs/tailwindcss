import fs from 'fs'
import path from 'path'
import { corePlugins } from '../../src/corePlugins'

test('all core plugins have a dedicated test file', async () => {
  let currentFile = path.basename(__filename)

  let corePluginList = Object.keys(corePlugins).sort((a, z) => a.localeCompare(z))
  let testedPluginList = (
    await fs.promises.readdir(path.resolve(__dirname, './'), {
      withFileTypes: true,
    })
  )
    .filter(
      (dirent) => dirent.isFile() && dirent.name.endsWith('.test.js') && dirent.name !== currentFile
    )
    .map((dirent) => dirent.name.slice(0, dirent.name.indexOf('.')))
    .sort((a, z) => a.localeCompare(z))

  let missingTests = corePluginList.filter((plugin) => !testedPluginList.includes(plugin))
  let additionalTests = testedPluginList.filter((plugin) => !corePluginList.includes(plugin))

  if (missingTests.length > 0 || additionalTests.length > 0) {
    throw new Error(
      `The following \`corePlugins\` are not covered by tests in the \`./tests/plugins/\` folder:\n${
        missingTests.map((x) => `\t- ${x}`).join('\n') || '\t- None'
      }\n\nAdditional tests found that don't correspond to any of the \`corePlugins\`:\n${
        additionalTests.map((x) => `\t- ${x}`).join('\n') || '\t- None'
      }\n\nCovered: ${testedPluginList.length - additionalTests.length}/${
        corePluginList.length
      }, missing: ${missingTests.length}`
    )
  }
})

import fs from 'fs'
import path from 'path'
import { variantPlugins } from '../../../src/corePlugins'

test('all variant plugins have a dedicated test file', async () => {
  let currentFile = path.basename(__filename)

  let variantPluginList = Object.keys(variantPlugins).sort((a, z) => a.localeCompare(z))
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

  let missingTests = variantPluginList.filter((plugin) => !testedPluginList.includes(plugin))
  let additionalTests = testedPluginList.filter((plugin) => !variantPluginList.includes(plugin))

  if (missingTests.length > 0 || additionalTests.length > 0) {
    throw new Error(
      `The following \`variantPlugins\` are not covered by tests in the \`./tests/plugins/\` folder:\n${
        missingTests.map((x) => `\t- ${x}`).join('\n') || '\t- None'
      }\n\nAdditional tests found that don't correspond to any of the \`variantPlugins\`:\n${
        additionalTests.map((x) => `\t- ${x}`).join('\n') || '\t- None'
      }\n\nCovered: ${testedPluginList.length - additionalTests.length}/${
        variantPluginList.length
      }, missing: ${missingTests.length}`
    )
  }
})

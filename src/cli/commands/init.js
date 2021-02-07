import * as constants from '../../constants'
import * as colors from '../colors'
import * as emoji from '../emoji'
import * as utils from '../utils'

export const usage = 'init [file]'
export const description =
  'Creates Tailwind config file. Default: ' +
  colors.file(utils.getSimplePath(constants.defaultConfigFile))

export const options = [
  {
    usage: '--full',
    description: 'Generate complete configuration file.',
  },
  {
    usage: '-p',
    description: 'Generate PostCSS config file.',
  },
]

export const optionMap = {
  full: ['full'],
  postcss: ['p'],
}

/**
 * Runs the command.
 *
 * @param {string[]} cliParams
 * @param {object} cliOptions
 * @return {Promise}
 */
export function run(cliParams, cliOptions) {
  return new Promise((resolve) => {
    utils.header()

    const isModule = utils.isModule()
    const full = cliOptions.full
    const file = cliParams[0] || (isModule ? constants.cjsConfigFile : constants.defaultConfigFile)
    const simplePath = utils.getSimplePath(file)

    utils.exists(file) && utils.die(colors.file(simplePath), 'already exists.')

    const stubFile = full ? constants.defaultConfigStubFile : constants.simpleConfigStubFile
    const stubFileContents = utils
      .readFile(stubFile, 'utf-8')
      .replace('../colors', 'tailwindcss/colors')

    utils.writeFile(file, stubFileContents)

    utils.log()
    utils.log(emoji.yes, 'Created Tailwind config file:', colors.file(simplePath))

    if (cliOptions.postcss) {
      const postCssConfigFile = isModule
        ? constants.cjsPostCssConfigFile
        : constants.defaultPostCssConfigFile
      const path = utils.getSimplePath(postCssConfigFile)
      utils.exists(constants.defaultPostCssConfigFile) &&
        utils.die(colors.file(path), 'already exists.')
      utils.copyFile(constants.defaultPostCssConfigStubFile, postCssConfigFile)
      utils.log(emoji.yes, 'Created PostCSS config file:', colors.file(path))
    }

    utils.footer()

    resolve()
  })
}

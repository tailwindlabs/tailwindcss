// @ts-check

import fs from 'fs'
import path from 'path'

function isESM() {
  const pkgPath = path.resolve('./package.json')

  try {
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    return pkg.type && pkg.type === 'module'
  } catch (err) {
    return false
  }
}

export function init(args, configs) {
  let messages = []

  let syntax = args['--ts'] ? 'ts' : args['--esm'] ? 'js' : isESM() ? 'js' : 'cjs'
  let extension = args['--ts'] ? 'ts' : 'js'

  let tailwindConfigLocation = path.resolve(args['_'][1] ?? `./tailwind.config.${extension}`)

  if (fs.existsSync(tailwindConfigLocation)) {
    messages.push(`${path.basename(tailwindConfigLocation)} already exists.`)
  } else {
    let stubContentsFile = fs.readFileSync(
      args['--full']
        ? path.resolve(__dirname, '../../../stubs/full.js')
        : path.resolve(__dirname, '../../../stubs/simple.js'),
      'utf8'
    )

    let stubFile = fs.readFileSync(
      path.resolve(__dirname, `../../../stubs/tailwind.config.${syntax}`),
      'utf8'
    )

    // Change colors import
    stubContentsFile = stubContentsFile.replace('../colors', 'tailwindcss/colors')

    // Replace contents of {ts,js,cjs} file with the stub {simple,full}.
    stubFile =
      stubFile
        .replace('__CONFIG__', stubContentsFile.replace('module.exports =', '').trim())
        .trim() + '\n\n'

    fs.writeFileSync(tailwindConfigLocation, stubFile, 'utf8')

    messages.push(`Created Tailwind CSS config file: ${path.basename(tailwindConfigLocation)}`)
  }

  if (args['--postcss']) {
    let postcssConfigLocation = path.resolve(`./${configs.postcss}`)
    if (fs.existsSync(postcssConfigLocation)) {
      messages.push(`${path.basename(postcssConfigLocation)} already exists.`)
    } else {
      let stubFile = fs.readFileSync(
        path.resolve(__dirname, '../../../stubs/defaultPostCssConfig.stub.js'),
        'utf8'
      )

      fs.writeFileSync(postcssConfigLocation, stubFile, 'utf8')

      messages.push(`Created PostCSS config file: ${path.basename(postcssConfigLocation)}`)
    }
  }

  if (messages.length > 0) {
    console.log()
    for (let message of messages) {
      console.log(message)
    }
  }
}

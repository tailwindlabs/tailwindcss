let fs = require('fs/promises')
let { spawn } = require('child_process')
let path = require('path')
let root = process.cwd()

function npmInstall(cwd) {
  return new Promise((resolve) => {
    let childProcess = spawn('npm', ['install'], { cwd })
    childProcess.on('exit', resolve)
  })
}

async function install() {
  let base = path.resolve(root, 'integrations')
  let ignoreFolders = ['node_modules']
  let integrations = (await fs.readdir(base, { withFileTypes: true }))
    .filter((integration) => integration.isDirectory())
    .filter((integration) => !ignoreFolders.includes(integration.name))
    .map((folder) => path.resolve(base, folder.name))
    .concat([base])
    .map((integration) => npmInstall(integration))

  await Promise.all(integrations)
  console.log('Done!')
}

install()

let version = process.env.npm_package_version || require('../package.json').version

let match = /\d+\.\d+\.\d+-(.*)\.\d+/g.exec(version)
if (match) {
  console.log(match[1])
} else {
  console.log('latest')
}

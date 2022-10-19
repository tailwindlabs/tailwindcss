let path = require('path')
let fs = require('fs')

let version = process.argv[2] || require('../package.json').version
let changelog = fs.readFileSync(path.resolve(__dirname, '..', 'CHANGELOG.md'), 'utf8')
let match = new RegExp(
  `## \\[${version}\\] - (.*)\\n\\n([\\s\\S]*?)\\n(?:(?:##\\s)|(?:\\[))`,
  'g'
).exec(changelog)

if (match) {
  let [, date, notes] = match
  console.log(notes.trim())
} else {
  console.log(`Placeholder release notes for version: v${version}`)
}

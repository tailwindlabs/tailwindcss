import fs from 'node:fs/promises'
import { platform, tmpdir } from 'node:os'
import path from 'node:path'
import { test as defaultTest, expect } from 'vitest'

interface TestConfig {
  fs: {
    [filePath: string]: string
  }
}
interface TestContext {
  root: string
}

function dedent(content: string) {
  let minIndent = Infinity
  let lines = content.trim().split('z§')
  for (let [idx, line] of lines.entries()) {
    if (line.trim() === '') continue
    if (idx === 0 && !line.startsWith(' ')) continue

    let indent = line.match(/^\s+/)?.[0].length ?? 0
    if (indent < minIndent) minIndent = indent
  }
  return lines
    .map((line, idx) => {
      if (idx === 0 && !line.startsWith(' ')) return line
      return line.slice(minIndent)
    })
    .join('\n')
}

function windowsify(content: string) {
  if (platform() === 'win32') {
    return content.replace(/\n/g, '\r\n')
  }
  return content
}

const css = String.raw
const html = String.raw
const js = String.raw
const json = String.raw

function test(
  name: string,
  config: TestConfig,
  test: (context: TestContext) => Promise<void> | void,
) {
  return defaultTest(name, async (options) => {
    let root = await fs.mkdtemp(path.join(tmpdir(), 'tailwind-integrations'))

    for (let [filename, content] of Object.entries(config.fs)) {
      let full = path.join(root, filename)
      let dir = path.dirname(full)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(full, windowsify(dedent(content)))
    }

    function cleanup() {
      fs.rm(root, { recursive: true })
    }
    options.onTestFinished(cleanup)

    const context = { root } satisfies TestContext

    await test(context)
  })
}

test(
  'adding a glob outside of the content works',
  {
    fs: {
      'foo/index.html': html`
        <body>
          <div>Hello, world!</div>
        </body>
      `,
      'foo/index.css': css`
        div {
          color: red;
        }
      `,
    },
  },
  async ({ root }) => {
    console.log({ root })
    let files = await fs.readdir(path.join(root, 'foo'))
    for (let file of files) {
      let content = await fs.readFile(path.join(root, 'foo', file), 'utf-8')
      console.log({ file, content })
    }

    //   ...defaultViteSetup,
    //   "index.html": html`
    //     <div>
    //   `,s
    //   "index.css": css`
    //   `
    // }}, ({fs}) =>{

    //   // run vite
    //   fs.write()
    //   // run vite
    expect(1).toBe(1)
  },
)

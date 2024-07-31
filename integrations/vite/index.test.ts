import dedent from 'dedent'
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

function windowsify(content: string) {
  if (platform() === 'win32') {
    return content.replace(/\n/g, '\r\n')
  }
  return content
}

const css = dedent
const html = dedent
const js = dedent
const json = dedent

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
      await fs.writeFile(full, windowsify(content))
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

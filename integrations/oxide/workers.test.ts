import { js, json, test } from '../utils'

test(
  '@tailwindcss/oxide can scan in a Node.js worker and survive worker exit',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/oxide": "workspace:^"
          }
        }
      `,
      'start.js': js`
        let assert = require('node:assert/strict')
        let { Worker } = require('worker_threads')
        let worker = new Worker('./worker.js')
        worker.on('error', (error) => {
          throw error
        })
        worker.on('exit', (code) => {
          assert.equal(code, 0)
          if (process.platform === 'win32') {
            assert.ok(
              process.report
                .getReport()
                .sharedObjects.some((file) => /tailwindcss-oxide.*[.]node$/.test(file)),
              'Oxide must remain mapped after the worker exits',
            )
          }
          setTimeout(() => console.log('parent survived worker exit'), 500)
        })
      `,
      'worker.js': js`
        let assert = require('node:assert/strict')
        let { Scanner } = require('@tailwindcss/oxide')
        let scanner = new Scanner({ sources: [] })
        let candidates = scanner.scanFiles(
          Array.from({ length: 100 }, () => ({
            content: '<div class="flex p-4 text-red-500"></div>',
            extension: 'html',
          })),
        )
        assert.ok(candidates.includes('flex'))
        process.on('exit', () => console.log('worker thread exited'))
      `,
    },
  },
  async ({ exec, expect }) => {
    let output = await exec('node ./start.js').then((out) => out.trim())

    expect(output).toEqual('worker thread exited\nparent survived worker exit')
  },
)

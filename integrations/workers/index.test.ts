import { js, json, test } from '../utils'

test(
  '@tailwindcss/oxide can be loaded into a Node.js worker thread',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/oxide": "workspace:^"
          }
        }
      `,
      'start-worker.js': js`
        const { Worker } = require('worker_threads')
        new Worker('./worker.js')
      `,
      'worker.js': js`
        require('@tailwindcss/oxide')
        console.log('Spawned worker')
      `,
    },
  },
  async ({ exec, expect }) => {
    let output = await exec('node ./start-worker.js')

    expect(output).toContain('Spawned worker')
  },
)

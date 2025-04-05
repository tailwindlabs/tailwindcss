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
      'start.js': js`
        const { Worker } = require('worker_threads')
        new Worker('./worker.js')
      `,
      'worker.js': js`
        require('@tailwindcss/oxide')
        process.on('exit', () => console.log('worker thread exited'))
      `,
    },
  },
  async ({ exec, expect }) => {
    const output = await exec('node ./start.js').then(
      (out) => out.trim(),
      (err) => `${err}`,
    )

    expect(output).toEqual('worker thread exited')
  },
)

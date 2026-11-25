import { json, test, ts } from '../utils'

// https://github.com/tailwindlabs/tailwindcss/issues/20631
test(
  'type declarations only import modules that are shipped',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/node": "workspace:^"
          },
          "devDependencies": {
            "typescript": "^5.9.3"
          }
        }
      `,
      'tsconfig.json': json`
        {
          "compilerOptions": {
            "target": "ESNext",
            "module": "NodeNext",
            "moduleResolution": "NodeNext",
            "strict": true,
            "noEmit": true,
            "skipLibCheck": false
          },
          "include": ["index.ts"]
        }
      `,
      'index.ts': ts`
        import { __unstable__loadDesignSystem, compile } from '@tailwindcss/node'

        let compiler = await compile('@import "tailwindcss";', {
          base: '.',
          onDependency() {},
        })
        compiler.build(['flex'])

        let designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
          base: '.',
        })
        designSystem.candidatesToCss(['flex'])
      `,
    },
  },
  async ({ exec, expect }) => {
    let { stdout, exitCode } = await exec('pnpm tsc --pretty false', {}, { streams: true })

    // `tsc` prints its errors to stdout, so check it first to see them on failure
    expect(stdout.trim()).toBe('')
    expect(exitCode).toBe(0)
  },
)

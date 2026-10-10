import fs from 'node:fs'
import path from 'node:path'
import { candidate, css, html, js, test, ts, yaml } from '../utils'

const DIST = path.resolve(import.meta.dirname, '../../dist')

const resolutions = Object.fromEntries(
  fs
    .readdirSync(DIST)
    .filter((filename) => filename.endsWith('.tgz'))
    .map((filename) => {
      let name =
        filename === 'tailwindcss.tgz'
          ? 'tailwindcss'
          : `@tailwindcss/${filename.slice('tailwindcss-'.length, -'.tgz'.length)}`

      let tarball = path.join(DIST, filename).replaceAll('\\', '/')
      return [name, `file:${tarball}`]
    }),
)

test(
  'Yarn PnP scans a physical workspace package through its virtual peer-dependency path',
  {
    installDependencies: false,
    timeout: 240_000,
    fs: {
      'package.json': JSON.stringify(
        {
          private: true,
          packageManager: 'yarn@4.18.0',
          workspaces: ['packages/*'],
          resolutions,
        },
        null,
        2,
      ),
      '.yarnrc.yml': yaml`
        #
        nodeLinker: pnp
        enableGlobalCache: false
      `,
      'packages/app/package.json': JSON.stringify(
        {
          name: 'app',
          private: true,
          type: 'module',
          dependencies: {
            dep: 'workspace:*',
            react: '19.2.0',
          },
          devDependencies: {
            '@tailwindcss/vite': 'workspace:^',
            tailwindcss: 'workspace:^',
            vite: '^7',
          },
        },
        null,
        2,
      ),
      'packages/app/index.html': html`
        <head>
          <link rel="stylesheet" href="/src/index.css" />
        </head>
        <body>
          <div class="twp:p-10"></div>
        </body>
      `,
      'packages/app/src/index.css': css` @import 'dep/style.css'; `,
      'packages/app/vite.config.ts': ts`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          build: { cssMinify: false },
          plugins: [tailwindcss()],
        })
      `,
      'packages/dep/package.json': JSON.stringify(
        {
          name: 'dep',
          type: 'module',
          exports: {
            './style.css': './style.css',
          },
          devDependencies: {
            tailwindcss: 'workspace:^',
          },
          peerDependencies: {
            react: '>=18',
          },
        },
        null,
        2,
      ),
      'packages/dep/style.css': css`
        @import 'tailwindcss' prefix(twp) source(none);
        @plugin './plugin.js';
        @source './src';
        @source not './src/excluded.ts';
      `,
      'packages/dep/plugin.js': js`
        export default function ({ addUtilities }) {
          addUtilities({
            '.from-virtual-plugin': {
              display: 'block',
            },
          })
        }
      `,
      'packages/dep/src/index.ts': ts` export let classes = 'twp:flex twp:from-virtual-plugin' `,
      'packages/dep/src/excluded.ts': ts` export let classes = 'twp:hidden' `,
    },
  },
  async ({ root, exec, fs, expect }) => {
    await exec('corepack yarn install')

    let resolution = await exec(
      `corepack yarn workspace app node -e "const p=require('pnpapi');const v=p.resolveToUnqualified('dep',process.cwd()+'/');console.log('VIRTUAL='+JSON.stringify({virtual:v.includes('__virtual__'),resolved:p.resolveVirtual(v)}))"`,
    )
    let virtual = JSON.parse(resolution.match(/VIRTUAL=(.*)/)![1])
    expect(virtual.virtual).toBe(true)
    expect(virtual.resolved).toBe(path.join(root, 'packages/dep') + path.sep)

    await exec('corepack yarn workspace app vite build')

    let files = await fs.glob('packages/app/dist/**/*.css')
    expect(files).toHaveLength(1)
    let [filename] = files[0]

    await fs.expectFileToContain(filename, [
      candidate`twp:flex`,
      candidate`twp:from-virtual-plugin`,
    ])
    await fs.expectFileNotToContain(filename, [candidate`twp:hidden`, candidate`twp:p-10`])
  },
)

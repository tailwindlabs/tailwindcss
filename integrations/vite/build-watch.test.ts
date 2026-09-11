import path from 'node:path'
import { candidate, css, js, json, test } from '../utils'

test(
  'build watch ignores a custom output directory',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "@tailwindcss/vite": "workspace:^",
            "tailwindcss": "workspace:^"
          },
          "devDependencies": {
            "vite": "6.2.3"
          }
        }
      `,
      'vite.config.js': js`
        import tailwindcss from '@tailwindcss/vite'
        import { defineConfig } from 'vite'

        export default defineConfig({
          plugins: [tailwindcss()],
          build: {
            outDir: './assets',
            emptyOutDir: false,
            minify: false,
            rollupOptions: {
              input: {
                app: './resources/js/app.js',
                styles: './resources/css/app.css',
              },
              output: {
                dir: './assets',
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].css',
              },
            },
          },
        })
      `,
      'resources/js/app.js': js`
        import '../css/app.css'

        document.body.innerHTML = '<div class="underline">Hello</div>'
      `,
      'resources/css/app.css': css` @import 'tailwindcss'; `,
      'assets/app.js': js` console.log('previous build') `,
      'assets/styles.css': css`
        .previous-build {
          display: block;
        }
      `,
    },
  },
  async ({ root, spawn, exec, fs, expect }) => {
    let version = await exec('pnpm vite --version')
    expect(version).toContain('vite/6.2.3')

    let process = await spawn('pnpm vite build --watch')
    await process.onStdout((message) => message.includes('built in'))

    let output = path.join(root, 'assets/styles.css')
    await fs.expectFileToContain(output, candidate`underline`)

    process.flush()
    let result = await Promise.race([
      process.onStdout((message) => message.includes('built in')).then(() => 'rebuilt'),
      new Promise<'idle'>((resolve) => setTimeout(() => resolve('idle'), 1_500)),
    ])
    expect(result).toBe('idle')

    process.flush()
    await fs.write(
      'resources/js/app.js',
      js`
        import '../css/app.css'

        document.body.innerHTML = '<div class="font-bold underline">Hello</div>'
      `,
    )
    await process.onStdout((message) => message.includes('built in'))
    await fs.expectFileToContain(output, candidate`font-bold`)
  },
)

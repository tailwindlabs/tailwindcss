import { css, html, js, json, test } from '../utils'

test(
  'webpack + PostCSS (watch)',
  {
    fs: {
      'package.json': json`
        {
          "main": "./src/index.js",
          "browser": "./src/index.js",
          "dependencies": {
            "css-loader": "^6",
            "postcss": "^8",
            "postcss-loader": "^7",
            "webpack": "^5",
            "webpack-cli": "^5",
            "mini-css-extract-plugin": "^2",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'postcss.config.js': js`
        /** @type {import('postcss-load-config').Config} */
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'webpack.config.js': js`
        let MiniCssExtractPlugin = require('mini-css-extract-plugin')

        module.exports = {
          output: {
            clean: true,
          },
          plugins: [new MiniCssExtractPlugin()],
          module: {
            rules: [
              {
                test: /.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
              },
            ],
          },
        }
      `,
      'src/index.js': js`import './index.css'`,
      'src/index.html': html`
        <div class="flex"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
      `,
      'src/unrelated.module.css': css`
        .module {
          color: var(--color-blue-500);
        }
      `,
    },
  },
  async ({ fs, spawn, exec, expect }) => {
    // Generate the initial build so output CSS files exist on disk
    await exec('pnpm webpack --mode=development')

    // NOTE: We are writing to an output CSS file which is not being ignored by
    // `.gitignore` nor marked with `@source not`. This should not result in an
    // infinite loop.
    let process = await spawn('pnpm webpack --mode=development --watch')
    await process.onStdout((m) => m.includes('compiled successfully in'))

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/main.css ---
      :root, :host {
        --color-blue-500: oklch(62.3% 0.214 259.815);
      }
      .flex {
        display: flex;
      }
      "
    `)

    await fs.write(
      'src/unrelated.module.css',
      css`
        .module {
          color: var(--color-blue-500);
          background-color: var(--color-red-500);
        }
      `,
    )
    await process.onStdout((m) => m.includes('compiled successfully in'))

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/main.css ---
      :root, :host {
        --color-red-500: oklch(63.7% 0.237 25.331);
        --color-blue-500: oklch(62.3% 0.214 259.815);
      }
      .flex {
        display: flex;
      }
      "
    `)
  },
)

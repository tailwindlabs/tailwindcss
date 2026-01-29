import { css, html, js, json, test } from '../utils'

test(
  '@tailwindcss/webpack loader (build)',
  {
    fs: {
      'package.json': json`
        {
          "main": "./src/index.js",
          "browser": "./src/index.js",
          "dependencies": {
            "css-loader": "^6",
            "webpack": "^5",
            "webpack-cli": "^5",
            "mini-css-extract-plugin": "^2",
            "tailwindcss": "workspace:^",
            "@tailwindcss/webpack": "workspace:^"
          }
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
                use: [MiniCssExtractPlugin.loader, 'css-loader', '@tailwindcss/webpack'],
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
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm webpack --mode=development')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/main.css ---
      .flex {
        display: flex;
      }
      "
    `)
  },
)

test(
  '@tailwindcss/webpack loader (watch)',
  {
    fs: {
      'package.json': json`
        {
          "main": "./src/index.js",
          "browser": "./src/index.js",
          "dependencies": {
            "css-loader": "^6",
            "webpack": "^5",
            "webpack-cli": "^5",
            "mini-css-extract-plugin": "^2",
            "tailwindcss": "workspace:^",
            "@tailwindcss/webpack": "workspace:^"
          }
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
                use: [MiniCssExtractPlugin.loader, 'css-loader', '@tailwindcss/webpack'],
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
    },
  },
  async ({ fs, spawn, exec, expect }) => {
    // Generate the initial build so output CSS files exist on disk
    await exec('pnpm webpack --mode=development')

    let process = await spawn('pnpm webpack --mode=development --watch')
    await process.onStdout((m) => m.includes('compiled successfully in'))

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/main.css ---
      .flex {
        display: flex;
      }
      "
    `)

    // Add a new Tailwind class to the HTML file
    await fs.write('src/index.html', html`
        <div class="flex underline"></div>
      `)
    await process.onStdout((m) => m.includes('compiled successfully in'))

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/main.css ---
      .flex {
        display: flex;
      }
      .underline {
        text-decoration-line: underline;
      }
      "
    `)
  },
)

test(
  '@tailwindcss/webpack loader with @apply',
  {
    fs: {
      'package.json': json`
        {
          "main": "./src/index.js",
          "browser": "./src/index.js",
          "dependencies": {
            "css-loader": "^6",
            "webpack": "^5",
            "webpack-cli": "^5",
            "mini-css-extract-plugin": "^2",
            "tailwindcss": "workspace:^",
            "@tailwindcss/webpack": "workspace:^"
          }
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
                use: [MiniCssExtractPlugin.loader, 'css-loader', '@tailwindcss/webpack'],
              },
            ],
          },
        }
      `,
      'src/index.js': js`import './index.css'`,
      'src/index.css': css`
        @import 'tailwindcss/theme';

        .btn {
          @apply flex items-center px-4 py-2 rounded-md;
        }
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm webpack --mode=development')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/main.css ---
      :root, :host {
        --spacing: 0.25rem;
        --radius-md: 0.375rem;
      }
      .btn {
        display: flex;
        align-items: center;
        border-radius: var(--radius-md);
        padding-inline: calc(var(--spacing) * 4);
        padding-block: calc(var(--spacing) * 2);
      }
      "
    `)
  },
)

test(
  '@tailwindcss/webpack loader with optimization',
  {
    fs: {
      'package.json': json`
        {
          "main": "./src/index.js",
          "browser": "./src/index.js",
          "dependencies": {
            "css-loader": "^6",
            "webpack": "^5",
            "webpack-cli": "^5",
            "mini-css-extract-plugin": "^2",
            "tailwindcss": "workspace:^",
            "@tailwindcss/webpack": "workspace:^"
          }
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
                use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  {
                    loader: '@tailwindcss/webpack',
                    options: {
                      optimize: true,
                    },
                  },
                ],
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
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm webpack --mode=development')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/main.css ---
      .flex{display:flex}
      "
    `)
  },
)

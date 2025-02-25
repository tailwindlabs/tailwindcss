import os from 'node:os'
import path from 'node:path'
import { candidate, css, html, js, json, test } from '../utils'

const STANDALONE_BINARY = (() => {
  switch (os.platform()) {
    case 'win32':
      return 'tailwindcss-windows-x64.exe'
    case 'darwin':
      return os.arch() === 'x64' ? 'tailwindcss-macos-x64' : 'tailwindcss-macos-arm64'
    case 'linux':
      return os.arch() === 'x64' ? 'tailwindcss-linux-x64' : 'tailwindcss-linux-arm64'
    default:
      throw new Error(`Unsupported platform: ${os.platform()} ${os.arch()}`)
  }
})()

test(
  'includes first-party plugins',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div className="prose">
          <h1>Headline</h1>
        </div>
        <input type="text" class="form-input" />
        <div class="aspect-w-16"></div>
      `,
      'src/index.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';

        @plugin '@tailwindcss/forms';
        @plugin '@tailwindcss/typography';
        @plugin '@tailwindcss/aspect-ratio';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec(
      `${path.resolve(__dirname, `../../packages/@tailwindcss-standalone/dist/${STANDALONE_BINARY}`)} --input src/index.css --output dist/out.css`,
    )

    await fs.expectFileToContain('dist/out.css', [
      candidate`form-input`,
      candidate`prose`,
      candidate`aspect-w-16`,
    ])
  },
)

test(
  'includes js APIs for plugins',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {}
        }
      `,
      'index.html': html`
        <div class="underline example1 example2 example3"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss/theme' theme(reference);
        @import 'tailwindcss/utilities';
        @plugin './plugin.js';
        @plugin './plugin.cjs';
        @plugin './plugin.ts';
      `,
      'src/plugin.js': js`
        import plugin from 'tailwindcss/plugin'

        // Make sure all available JS APIs can be imported and used
        import * as tw from 'tailwindcss'
        import colors from 'tailwindcss/colors'
        import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
        import defaultTheme from 'tailwindcss/defaultTheme'
        import * as pkg from 'tailwindcss/package.json'

        export default plugin(function ({ addUtilities }) {
          addUtilities({
            '.example1': {
              '--version': pkg.version,
              '--default-theme': typeof defaultTheme,
              '--flatten-color-palette': typeof flattenColorPalette,
              '--colors': typeof colors,
              '--core': typeof tw,
              color: 'red',
            },
          })
        })
      `,
      'src/plugin.cjs': js`
        const plugin = require('tailwindcss/plugin')

        // Make sure all available JS APIs can be imported and used
        const tw = require('tailwindcss')
        const colors = require('tailwindcss/colors')
        const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette')
        const defaultTheme = require('tailwindcss/defaultTheme')
        const pkg = require('tailwindcss/package.json')

        module.exports = plugin(function ({ addUtilities }) {
          addUtilities({
            '.example2': {
              '--version': pkg.version,
              '--default-theme': typeof defaultTheme,
              '--flatten-color-palette': typeof flattenColorPalette,
              '--colors': typeof colors,
              '--core': typeof tw,
              color: 'red',
            },
          })
        })
      `,
      'src/plugin.ts': js`
        import plugin from 'tailwindcss/plugin'

        // Make sure all available JS APIs can be imported and used
        import * as tw from 'tailwindcss'
        import colors from 'tailwindcss/colors'
        import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
        import defaultTheme from 'tailwindcss/defaultTheme'
        import * as pkg from 'tailwindcss/package.json'

        export interface PluginOptions {
        }

        export default plugin(function ({ addUtilities }) {
          addUtilities({
            '.example3': {
              '--version': pkg.version,
              '--default-theme': typeof defaultTheme,
              '--flatten-color-palette': typeof flattenColorPalette,
              '--colors': typeof colors,
              '--core': typeof tw,
              color: 'red',
            },
          })
        })
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec(
      `${path.resolve(__dirname, `../../packages/@tailwindcss-standalone/dist/${STANDALONE_BINARY}`)} --input src/index.css --output dist/out.css`,
    )

    await fs.expectFileToContain('dist/out.css', [
      candidate`underline`,
      candidate`example1`,
      candidate`example2`,
      candidate`example3`,
    ])
  },
)

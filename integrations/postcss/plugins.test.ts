import { candidate, css, html, js, json, test } from '../utils'

test(
  'builds the `@headlessui/tailwindcss` plugin utilities (CJS)',
  {
    fs: {
      'package.json': json`
        {
          "type": "commonjs",
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^",
            "@headlessui/tailwindcss": "^0.2.1"
          }
        }
      `,
      'postcss.config.cjs': js`
        let tailwindcss = require('@tailwindcss/postcss')
        module.exports = {
          plugins: [tailwindcss()],
        }
      `,
      'index.html': html`
        <div className="ui-open:flex"></div>
      `,
      'src/index.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
        @plugin '@headlessui/tailwindcss';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [candidate`ui-open:flex`])
  },
)

test(
  'builds the `@headlessui/tailwindcss` plugin utilities (ESM)',
  {
    fs: {
      'package.json': json`
        {
          "type": "module",
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^",
            "@headlessui/tailwindcss": "^0.2.1"
          }
        }
      `,
      'postcss.config.mjs': js`
        import tailwindcss from '@tailwindcss/postcss'
        export default {
          plugins: [tailwindcss()],
        }
      `,
      'index.html': html`
        <div className="ui-open:flex"></div>
      `,
      'src/index.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
        @plugin '@headlessui/tailwindcss';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [candidate`ui-open:flex`])
  },
)

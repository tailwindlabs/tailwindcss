import { candidate, css, html, js, json, test } from '../utils'

test(
  'production build',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'postcss.config.js': js`
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'index.html': html`
        <div class="one:underline two:underline"></div>
      `,
      'src/shared.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';
      `,
      'src/root1.css': css`
        @import './shared.css';
        @custom-variant one (&:is([data-root='1']));
      `,
      'src/root2.css': css`
        @import './shared.css';
        @custom-variant two (&:is([data-root='2']));
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm postcss src/*.css -d dist')

    await fs.expectFileToContain('dist/root1.css', [candidate`one:underline`])
    await fs.expectFileNotToContain('dist/root1.css', [candidate`two:underline`])

    await fs.expectFileNotToContain('dist/root2.css', [candidate`one:underline`])
    await fs.expectFileToContain('dist/root2.css', [candidate`two:underline`])
  },
)

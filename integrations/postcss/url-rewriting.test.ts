import { binary, css, js, json, svg, test } from '../utils'

const SIMPLE_IMAGE = `iVBORw0KGgoAAAANSUhEUgAAADAAAAAlAQAAAAAsYlcCAAAACklEQVR4AWMYBQABAwABRUEDtQAAAABJRU5ErkJggg==`

test.debug(
  'can rewrite urls in production builds',
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
      'src/index.css': css`
        @reference 'tailwindcss';
        @import './dir-1/bar.css';
        @import './dir-1/dir-2/baz.css';
        @import './dir-1/dir-2/vector.css';
      `,
      'src/dir-1/bar.css': css`
        .test1 {
          background-image: url('../../resources/image.png');
        }
      `,
      'src/dir-1/dir-2/baz.css': css`
        .test2 {
          background-image: url('../../../resources/image.png');
        }
      `,
      'src/dir-1/dir-2/vector.css': css`
        @import './dir-3/vector.css';
        .test3 {
          background-image: url('../../../resources/vector.svg');
        }
      `,
      'src/dir-1/dir-2/dir-3/vector.css': css`
        .test4 {
          background-image: url('./vector-2.svg');
        }
      `,
      'resources/image.png': binary(SIMPLE_IMAGE),
      'resources/vector.svg': svg`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="red" />
          <circle cx="200" cy="100" r="80" fill="green" />
          <rect width="100%" height="100%" fill="red" />
          <circle cx="200" cy="100" r="80" fill="green" />
        </svg>
      `,
      'src/dir-1/dir-2/dir-3/vector-2.svg': svg`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="blue" />
          <circle cx="200" cy="100" r="80" fill="green" />
          <rect width="100%" height="100%" fill="red" />
          <circle cx="200" cy="100" r="80" fill="pink" />
        </svg>
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css')

    expect(await fs.dumpFiles('dist/out.css')).toMatchInlineSnapshot(`
      "
      --- dist/out.css ---
      .test1 {
        background-image: url('../resources/image.png');
      }
      .test2 {
        background-image: url('../resources/image.png');
      }
      .test4 {
        background-image: url('./dir-1/dir-2/dir-3/vector-2.svg');
      }
      .test3 {
        background-image: url('../resources/vector.svg');
      }
      "
    `)
  },
)

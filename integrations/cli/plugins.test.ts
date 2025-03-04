import { candidate, css, html, json, test } from '../utils'

test(
  'builds the `@tailwindcss/typography` plugin utilities',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/typography": "^0.5.14",
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div className="prose prose-stone prose-invert">
          <h1>Headline</h1>
          <p>
            Until now, trying to style an article, document, or blog post with Tailwind has been a
            tedious task that required a keen eye for typography and a lot of complex custom CSS.
          </p>
        </div>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin '@tailwindcss/typography';
      `,
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    // Verify that `prose-stone` is defined before `prose-invert`
    {
      let contents = await fs.read('dist/out.css')
      let proseInvertIdx = contents.indexOf('.prose-invert')
      let proseStoneIdx = contents.indexOf('.prose-stone')

      expect(proseStoneIdx).toBeLessThan(proseInvertIdx)
    }

    await fs.expectFileToContain('dist/out.css', [
      candidate`prose`,
      ':where(h1):not(:where([class~="not-prose"],[class~="not-prose"] *))',
      ':where(tbody td, tfoot td):not(:where([class~="not-prose"],[class~="not-prose"] *))',
    ])
  },
)

test(
  'builds the `@tailwindcss/forms` plugin utilities',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/forms": "^0.5.7",
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <input type="text" class="form-input" />
        <textarea class="form-textarea"></textarea>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin '@tailwindcss/forms';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`form-input`,
      candidate`form-textarea`,
    ])
    await fs.expectFileNotToContain('dist/out.css', [
      //
      candidate`form-radio`,
    ])
  },
)

test(
  'builds the `@tailwindcss/forms` plugin utilities (with options)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/forms": "^0.5.7",
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <input type="text" class="form-input" />
        <textarea class="form-textarea"></textarea>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin '@tailwindcss/forms' {
          strategy: base;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      //
      `::-webkit-date-and-time-value`,
      `[type='checkbox']:indeterminate`,
    ])

    // No classes are included even though they are used in the HTML
    // because the `base` strategy is used
    await fs.expectFileNotToContain('dist/out.css', [
      //
      candidate`form-input`,
      candidate`form-textarea`,
      candidate`form-radio`,
    ])
  },
)

test(
  'builds the `@tailwindcss/aspect-ratio` plugin utilities',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/aspect-ratio": "^0.4.2",
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="aspect-w-16 aspect-h-9">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin '@tailwindcss/aspect-ratio';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      //
      candidate`aspect-w-16`,
      candidate`aspect-h-9`,
    ])
  },
)

test(
  'builds the `tailwindcss-animate` plugin utilities',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss-animate": "^1.0.7",
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'index.html': html`
        <div class="animate-in fade-in zoom-in duration-350"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss';
        @plugin 'tailwindcss-animate';
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('pnpm tailwindcss --input src/index.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      candidate`animate-in`,
      candidate`fade-in`,
      candidate`zoom-in`,
      candidate`duration-350`,
      'transition-duration: 350ms',
      'animation-duration: 350ms',
      '@keyframes enter {',
    ])
  },
)

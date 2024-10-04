import { css, html, js, json, test } from '../utils'

test(
  `upgrades a v3 project to v4`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
        }
      `,
      'src/index.html': html`
        <h1>🤠👋</h1>
        <div class="!flex sm:!block bg-gradient-to-t bg-[--my-red]"></div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.html',
      html`
        <h1>🤠👋</h1>
        <div class="flex! sm:block! bg-linear-to-t bg-[var(--my-red)]"></div>
      `,
    )

    await fs.expectFileToContain('src/input.css', css`@import 'tailwindcss';`)
  },
)

test(
  `upgrades a v3 project with prefixes to v4`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
          prefix: 'tw__',
        }
      `,
      'src/index.html': html`
        <h1>🤠👋</h1>
        <div class="!tw__flex sm:!tw__block tw__bg-gradient-to-t flex [color:red]"></div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        .btn {
          @apply !tw__rounded-md tw__px-2 tw__py-1 tw__bg-blue-500 tw__text-white;
        }
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.html',
      html`
        <h1>🤠👋</h1>
        <div class="tw:flex! tw:sm:block! tw:bg-linear-to-t flex tw:[color:red]"></div>
      `,
    )

    await fs.expectFileToContain('src/input.css', css` @import 'tailwindcss' prefix(tw); `)
    await fs.expectFileToContain(
      'src/input.css',
      css`
        .btn {
          @apply tw:rounded-md! tw:px-2 tw:py-1 tw:bg-blue-500 tw:text-white;
        }
      `,
    )
  },
)

test(
  'migrate @apply',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'src/index.css': css`
        @import 'tailwindcss';

        .a {
          @apply flex;
        }

        .b {
          @apply !flex;
        }

        .c {
          @apply !flex flex-col! items-center !important;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.css',
      css`
        .a {
          @apply flex;
        }

        .b {
          @apply flex!;
        }

        .c {
          @apply flex! flex-col! items-center!;
        }
      `,
    )
  },
)

test(
  'migrate `@tailwind` directives',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'src/index.css': css`
        @tailwind base;

        html {
          color: #333;
        }

        @tailwind components;

        .btn {
          color: red;
        }

        @tailwind utilities;
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.css',
      css`
        @layer base {
          html {
            color: #333;
          }
        }
      `,
    )
    await fs.expectFileToContain(
      'src/index.css',
      css`
        @layer components {
          .btn {
            color: red;
          }
        }
      `,
    )
  },
)

test(
  'migrate `@layer utilities` and `@layer components`',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'src/index.css': css`
        @import 'tailwindcss';

        @layer components {
          .btn {
            @apply rounded-md px-2 py-1 bg-blue-500 text-white;
          }
        }

        @layer utilities {
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain(
      'src/index.css',
      css`
        @utility btn {
          @apply rounded-md px-2 py-1 bg-blue-500 text-white;
        }

        @utility no-scrollbar {
          &::-webkit-scrollbar {
            display: none;
          }
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
    )
  },
)

import { css, json, test } from '../utils'

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
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain('src/index.css', css` @import 'tailwindcss'; `)
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

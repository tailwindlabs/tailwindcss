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

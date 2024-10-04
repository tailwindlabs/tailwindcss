import { expect } from 'vitest'
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
    await exec('npx @tailwindcss/upgrade -c tailwind.config.js')

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
    await exec('npx @tailwindcss/upgrade -c tailwind.config.js')

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

test(
  'migrate utilities in an imported file',
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
        @import './utilities.css' layer(utilities);
      `,
      'src/utilities.css': css`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade --force')

    await fs.expectFileToContain(
      'src/index.css',
      css`
        @import 'tailwindcss';
        @import './utilities.css';
      `,
    )

    await fs.expectFileToContain(
      'src/utilities.css',
      css`
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

test(
  'wip it',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'src/index.html': html`
        <div class="hover:thing"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss/utilities';
        @import './a.css' layer(utilities);
        @import './b.css' layer(components);
        @import './c.css';
      `,
      'src/a.css': css`
        @import './utilities.css';

        .foo-from-a {
          color: red;
        }
      `,
      'src/utilities.css': css`
        #foo {
          --keep: me;
        }

        .foo-from-import {
          color: blue;
        }
      `,
      'src/b.css': css`
        @import './components.css';

        .bar-from-b {
          color: red;
        }
      `,
      'src/components.css': css`
        .bar-from-import {
          color: blue;
        }
      `,
      'src/c.css': css`
        @import './c-2.css' layer(utilities);
        .baz-from-c {
          color: green;
        }
      `,
      'src/c-2.css': css`
        @import './c-3.css';
        #baz {
          --keep: me;
        }
        .baz-from-import {
          color: yellow;
        }
      `,
      'src/c-3.css': css`
        #baz {
          --keep: me;
        }
        .baz-from-import {
          color: yellow;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.read('src/index.css')).toMatchInlineSnapshot(`
      "@import 'tailwindcss/utilities' layer(utilities);
      @import './a.css' layer(utilities);
      @import "./a.utilities.css";
      @import './b.css' layer(components);
      @import "./b.utilities.css";
      @import './c.css' layer(utilities);
      @import "./c.utilities.css";"
    `)
    expect(await fs.read('src/a.css')).toMatchInlineSnapshot(`"@import './utilities.css'"`)
    expect(await fs.read('src/a.utilities.css')).toMatchInlineSnapshot(`
      "@import "./utilities.utilities.css";
      @utility foo-from-a {
        color: red;
      }"
    `)

    expect(await fs.read('src/utilities.css')).toMatchInlineSnapshot(`
      "#foo {
        --keep: me;
      }"
    `)

    expect(await fs.read('src/utilities.utilities.css')).toMatchInlineSnapshot(`
      "@utility foo-from-import {
        color: blue;
      }"
    `)

    expect(await fs.read('src/b.css')).toMatchInlineSnapshot(`""`)
    expect(await fs.read('src/b.utilities.css')).toMatchInlineSnapshot(`
      "@import "./components.css";
      @utility bar-from-b {
        color: red;
      }"
    `)

    expect(await fs.read('src/c.css')).toMatchInlineSnapshot(`
      "@import './c-2.css' layer(utilities);
      .baz-from-c {
        color: green;
      }"
    `)
    expect(await fs.read('src/c.utilities.css')).toMatchInlineSnapshot(
      `"@import "./c-2.utilities.css""`,
    )

    expect(await fs.read('src/c-2.css')).toMatchInlineSnapshot(`
      "@import './c-3.css';
      #baz {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/c-2.utilities.css')).toMatchInlineSnapshot(`
      "@import "./c-3.utilities.css";
      @utility baz-from-import {
        color: yellow;
      }"
    `)

    expect(await fs.read('src/c-3.css')).toMatchInlineSnapshot(`
      "#baz {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/c-3.utilities.css')).toMatchInlineSnapshot(`
      "@utility baz-from-import {
        color: yellow;
      }"
    `)
  },
)

test(
  'deeply nested imports',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'src/index.html': html`
        <div class="hover:thing"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss/utilities';
        @import './a.1.css' layer(utilities);
      `,
      'src/a.1.css': css`
        @import './a.2.css';

        #from-a-1 {
          --keep: me;
        }

        .from-a-1 {
          color: red;
        }
      `,
      'src/a.2.css': css`
        @import './a.3.css';

        #from-a-2 {
          --keep: me;
        }

        .from-a-2 {
          color: green;
        }
      `,
      'src/a.3.css': css`
        #from-a-3 {
          --keep: me;
        }

        .from-a-3 {
          color: blue;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.read('src/index.css')).toMatchInlineSnapshot(`
      "@import 'tailwindcss/utilities' layer(utilities);
      @import './a.1.css' layer(utilities);
      @import "./a.1.utilities.css";"
    `)
    expect(await fs.read('src/a.1.css')).toMatchInlineSnapshot(`
      "@import './a.2.css';

      #from-a-1 {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/a.1.utilities.css')).toMatchInlineSnapshot(`
      "@import "./a.2.utilities.css";
      @utility from-a-1 {
        color: red;
      }"
    `)
    expect(await fs.read('src/a.2.css')).toMatchInlineSnapshot(`
      "@import './a.3.css';

      #from-a-2 {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/a.2.utilities.css')).toMatchInlineSnapshot(`
      "@import "./a.3.utilities.css";
      @utility from-a-2 {
        color: green;
      }"
    `)
    expect(await fs.read('src/a.3.css')).toMatchInlineSnapshot(`
      "#from-a-3 {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/a.3.utilities.css')).toMatchInlineSnapshot(`
      "@utility from-a-3 {
        color: blue;
      }"
    `)
  },
)

test(
  'deeply nested imports',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "workspace:^",
            "@tailwindcss/cli": "workspace:^",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'src/index.html': html`
        <div class="hover:thing"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss/utilities';
        @import './a.1.css';
      `,
      'src/a.1.css': css`
        @import './a.2.css' layer(utilities);

        #from-a-1 {
          --keep: me;
        }

        .from-a-1 {
          color: red;
        }
      `,
      'src/a.2.css': css`
        @import './a.3.css';

        #from-a-2 {
          --keep: me;
        }

        .from-a-2 {
          color: green;
        }
      `,
      'src/a.3.css': css`
        @import './a.4.css';

        #from-a-3 {
          --keep: me;
        }

        .from-a-3 {
          color: blue;
        }
      `,
      'src/a.4.css': css`
        #from-a-4 {
          --keep: me;
        }

        .from-a-4 {
          color: blue;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.read('src/index.css')).toMatchInlineSnapshot(`
      "@import 'tailwindcss/utilities' layer(utilities);
      @import './a.1.css' layer(utilities);
      @import "./a.1.utilities.css";"
    `)
    expect(await fs.read('src/a.1.css')).toMatchInlineSnapshot(`
      "@import './a.2.css' layer(utilities);

      #from-a-1 {
        --keep: me;
      }

      .from-a-1 {
        color: red;
      }"
    `)
    expect(await fs.read('src/a.1.utilities.css')).toMatchInlineSnapshot(
      `"@import "./a.2.utilities.css""`,
    )
    expect(await fs.read('src/a.2.css')).toMatchInlineSnapshot(`
      "@import './a.3.css';

      #from-a-2 {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/a.2.utilities.css')).toMatchInlineSnapshot(`
      "@import "./a.3.utilities.css";
      @utility from-a-2 {
        color: green;
      }"
    `)
    expect(await fs.read('src/a.3.css')).toMatchInlineSnapshot(`
      "@import './a.4.css';

      #from-a-3 {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/a.3.utilities.css')).toMatchInlineSnapshot(`
      "@import "./a.4.utilities.css";
      @utility from-a-3 {
        color: blue;
      }"
    `)
    expect(await fs.read('src/a.4.css')).toMatchInlineSnapshot(`
      "#from-a-4 {
        --keep: me;
      }"
    `)
    expect(await fs.read('src/a.4.utilities.css')).toMatchInlineSnapshot(`
      "@utility from-a-4 {
        color: blue;
      }"
    `)
  },
)

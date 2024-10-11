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
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <h1>🤠👋</h1>
      <div class="flex! sm:block! bg-linear-to-t bg-[var(--my-red)]"></div>

      --- ./src/input.css ---
      @import 'tailwindcss';

      @source './**/*.{html,js}';
      "
    `)

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
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
        <div
          class="!tw__flex sm:!tw__block tw__bg-gradient-to-t flex [color:red]"
        ></div>
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

    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <div
        class="tw:flex! tw:sm:block! tw:bg-linear-to-t flex tw:[color:red]"
      ></div>

      --- ./src/input.css ---
      @import 'tailwindcss' prefix(tw);

      @source './**/*.{html,js}';

      .btn {
        @apply tw:rounded-md! tw:px-2 tw:py-1 tw:bg-blue-500 tw:text-white;
      }
      "
    `)
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
      'tailwind.config.js': js`module.exports = {}`,
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

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';

      .a {
        @apply flex;
      }

      .b {
        @apply flex!;
      }

      .c {
        @apply flex! flex-col! items-center!;
      }
      "
    `)
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
      'tailwind.config.js': js`module.exports = {}`,
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

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';

      @layer base {
        html {
          color: #333;
        }
      }

      @layer components {
        .btn {
          color: red;
        }
      }
      "
    `)
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
      'tailwind.config.js': js`module.exports = {}`,
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

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';

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
      "
    `)
  },
)

test(
  'migrates a simple postcss setup',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "postcss-import": "^16",
            "autoprefixer": "^10",
            "tailwindcss": "^3",
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
      'postcss.config.js': js`
        module.exports = {
          plugins: {
            'postcss-import': {},
            'tailwindcss/nesting': 'postcss-nesting',
            tailwindcss: {},
            autoprefixer: {},
          },
        }
      `,
      'src/index.html': html`
        <div class="bg-[--my-red]"></div>
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

    await fs.expectFileToContain(
      'postcss.config.js',
      js`
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
    )
    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-[var(--my-red)]"></div>
      `,
    )

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.devDependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringContaining('4.0.0'),
    })
  },
)

test(
  'migrates a postcss setup using package.json config',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "postcss-import": "^16",
            "autoprefixer": "^10",
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "postcss": {
            "plugins": {
              "postcss-import": {},
              "tailwindcss/nesting": "postcss-nesting",
              "tailwindcss": {},
              "autoprefixer": {}
            }
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
        <div class="bg-[--my-red]"></div>
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

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-[var(--my-red)]"></div>
      `,
    )

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.postcss).toMatchInlineSnapshot(`
      {
        "plugins": {
          "@tailwindcss/postcss": {},
        },
      }
    `)

    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.devDependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringContaining('4.0.0'),
    })
  },
)

test(
  'migrates a postcss setup using a json based config file',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "postcss-import": "^16",
            "autoprefixer": "^10",
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      '.postcssrc.json': json`
        {
          "plugins": {
            "postcss-import": {},
            "tailwindcss/nesting": "postcss-nesting",
            "tailwindcss": {},
            "autoprefixer": {}
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
        <div class="bg-[--my-red]"></div>
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

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-[var(--my-red)]"></div>
      `,
    )

    let jsonConfigContent = await fs.read('.postcssrc.json')
    let jsonConfig = JSON.parse(jsonConfigContent)
    expect(jsonConfig).toMatchInlineSnapshot(`
      {
        "plugins": {
          "@tailwindcss/postcss": {},
        },
      }
    `)

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringContaining('4.0.0'),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.devDependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringContaining('4.0.0'),
    })
  },
)

test(
  `migrates prefixes even if other files have unprefixed versions of the candidate`,
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
        <div class="flex"></div>
      `,
      'src/other.html': html`
        <div class="tw__flex"></div>
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

    expect(await fs.dumpFiles('./src/**/*.html')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <div class="flex"></div>

      --- ./src/other.html ---
      <div class="tw:flex"></div>
      "
    `)
  },
)

test(
  `prefixed variants do not cause their unprefixed counterparts to be valid`,
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
        <div class="tw__bg-gradient-to-t"></div>
      `,
      'src/other.html': html`
        <div class="bg-gradient-to-t"></div>
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.html')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <div class="tw:bg-linear-to-t"></div>

      --- ./src/other.html ---
      <div class="bg-gradient-to-t"></div>
      "
    `)
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
      'tailwind.config.js': js`module.exports = {}`,
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

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';
      @import './utilities.css';

      --- ./src/utilities.css ---
      @utility no-scrollbar {
        &::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      "
    `)
  },
)

test(
  'migrate utilities in deep import trees',
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
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.html': html`
        <div class="hover:thing"></div>
      `,
      'src/index.css': css`
        @import 'tailwindcss/utilities';
        @import './a.1.css' layer(utilities);
        @import './b.1.css' layer(components);
        @import './c.1.css';
        @import './d.1.css';
      `,
      'src/a.1.css': css`
        @import './a.1.utilities.css';

        .foo-from-a {
          color: red;
        }
      `,
      'src/a.1.utilities.css': css`
        #foo {
          --keep: me;
        }

        .foo-from-import {
          color: blue;
        }
      `,
      'src/b.1.css': css`
        @import './b.1.components.css';

        .bar-from-b {
          color: red;
        }
      `,
      'src/b.1.components.css': css`
        .bar-from-import {
          color: blue;
        }
      `,
      'src/c.1.css': css`
        @import './c.2.css' layer(utilities);
        .baz-from-c {
          color: green;
        }
      `,
      'src/c.2.css': css`
        @import './c.3.css';
        #baz {
          --keep: me;
        }
        .baz-from-import {
          color: yellow;
        }
      `,
      'src/c.3.css': css`
        #baz {
          --keep: me;
        }
        .baz-from-import {
          color: yellow;
        }
      `,

      // This is a super deep import chain
      // And no `*.utilities.css` files should be created for these
      // because there are no rules that need to be separated
      'src/d.1.css': css`@import './d.2.css' layer(utilities);`,
      'src/d.2.css': css`@import './d.3.css';`,
      'src/d.3.css': css`@import './d.4.css';`,
      'src/d.4.css': css`
        .from-a-4 {
          color: blue;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss/utilities' layer(utilities);
      @import './a.1.css' layer(utilities);
      @import './a.1.utilities.1.css';
      @import './b.1.css';
      @import './c.1.css' layer(utilities);
      @import './c.1.utilities.css';
      @import './d.1.css';

      --- ./src/a.1.css ---
      @import './a.1.utilities.css'

      --- ./src/a.1.utilities.1.css ---
      @import './a.1.utilities.utilities.css';
      @utility foo-from-a {
        color: red;
      }

      --- ./src/a.1.utilities.css ---
      #foo {
        --keep: me;
      }

      --- ./src/a.1.utilities.utilities.css ---
      @utility foo-from-import {
        color: blue;
      }

      --- ./src/b.1.components.css ---
      @utility bar-from-import {
        color: blue;
      }

      --- ./src/b.1.css ---
      @import './b.1.components.css';
      @utility bar-from-b {
        color: red;
      }

      --- ./src/c.1.css ---
      @import './c.2.css' layer(utilities);
      .baz-from-c {
        color: green;
      }

      --- ./src/c.1.utilities.css ---
      @import './c.2.utilities.css'

      --- ./src/c.2.css ---
      @import './c.3.css';
      #baz {
        --keep: me;
      }

      --- ./src/c.2.utilities.css ---
      @import './c.3.utilities.css';
      @utility baz-from-import {
        color: yellow;
      }

      --- ./src/c.3.css ---
      #baz {
        --keep: me;
      }

      --- ./src/c.3.utilities.css ---
      @utility baz-from-import {
        color: yellow;
      }

      --- ./src/d.1.css ---
      @import './d.2.css'

      --- ./src/d.2.css ---
      @import './d.3.css'

      --- ./src/d.3.css ---
      @import './d.4.css'

      --- ./src/d.4.css ---
      @utility from-a-4 {
        color: blue;
      }
      "
    `)
  },
)

test(
  'migrate utility files imported by multiple roots',
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
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.html': html`
        <div class="hover:thing"></div>
      `,
      'src/root.1.css': css`
        @import 'tailwindcss/utilities';
        @import './a.1.css' layer(utilities);
      `,
      'src/root.2.css': css`
        @import 'tailwindcss/utilities';
        @import './a.1.css' layer(components);
      `,
      'src/root.3.css': css`
        @import 'tailwindcss/utilities';
        @import './a.1.css';
      `,
      'src/a.1.css': css`
        .foo-from-a {
          color: red;
        }
      `,
    },
  },
  async ({ fs, exec }) => {
    let output = await exec('npx @tailwindcss/upgrade --force')

    expect(output).toMatch(
      /You have one or more stylesheets that are imported into a utility layer and non-utility layer./,
    )

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/a.1.css ---
      .foo-from-a {
        color: red;
      }

      --- ./src/root.1.css ---
      @import 'tailwindcss/utilities' layer(utilities);
      @import './a.1.css' layer(utilities);

      --- ./src/root.2.css ---
      @import 'tailwindcss/utilities' layer(utilities);
      @import './a.1.css' layer(components);

      --- ./src/root.3.css ---
      @import 'tailwindcss/utilities' layer(utilities);
      @import './a.1.css' layer(utilities);
      "
    `)
  },
)

test(
  'injecting `@config` when a tailwind.config.{js,ts,…} is detected',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': js`
        export default {
          content: ['./src/**/*.{html,js}'],
          plugins: [
            () => {
              // custom stuff which is too complicated to migrate to CSS
            },
          ],
        }
      `,
      'src/index.html': html`
        <div
          class="!flex sm:!block bg-gradient-to-t bg-[--my-red]"
        ></div>
      `,
      'src/root.1.css': css`
        /* Inject missing @config */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      'src/root.2.css': css`
        /* Already contains @config */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config "../tailwind.config.js";
      `,
      'src/root.3.css': css`
        /* Inject missing @config above first @theme */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @variant hocus (&:hover, &:focus);

        @theme {
          --color-red-500: #f00;
        }

        @theme {
          --color-blue-500: #00f;
        }
      `,
      'src/root.4.css': css`
        /* Inject missing @config due to nested imports with tailwind imports */
        @import './root.4/base.css';
        @import './root.4/utilities.css';
      `,
      'src/root.4/base.css': css`@import 'tailwindcss/base';`,
      'src/root.4/utilities.css': css`@import 'tailwindcss/utilities';`,

      'src/root.5.css': css`@import './root.5/tailwind.css';`,
      'src/root.5/tailwind.css': css`
        /* Inject missing @config in this file, due to full import */
        @import 'tailwindcss';
      `,
    },
  },
  async ({ exec, fs }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.{html,css}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <div
        class="flex! sm:block! bg-linear-to-t bg-[var(--my-red)]"
      ></div>

      --- ./src/root.1.css ---
      /* Inject missing @config */
      @import 'tailwindcss';
      @source './**/*.{html,js}';

      --- ./src/root.2.css ---
      /* Already contains @config */
      @import 'tailwindcss';
      @source './**/*.{html,js}';
      @config "../tailwind.config.js";

      --- ./src/root.3.css ---
      /* Inject missing @config above first @theme */
      @import 'tailwindcss';
      @source './**/*.{html,js}';

      @variant hocus (&:hover, &:focus);

      @theme {
        --color-red-500: #f00;
      }

      @theme {
        --color-blue-500: #00f;
      }

      --- ./src/root.4.css ---
      /* Inject missing @config due to nested imports with tailwind imports */
      @import './root.4/base.css';
      @import './root.4/utilities.css';
      @source './**/*.{html,js}';

      --- ./src/root.5.css ---
      @import './root.5/tailwind.css';

      --- ./src/root.4/base.css ---
      @import 'tailwindcss/theme' layer(theme);
      @import 'tailwindcss/preflight' layer(base);

      --- ./src/root.4/utilities.css ---
      @import 'tailwindcss/utilities' layer(utilities);

      --- ./src/root.5/tailwind.css ---
      /* Inject missing @config in this file, due to full import */
      @import 'tailwindcss';
      @source '../**/*.{html,js}';
      "
    `)
  },
)

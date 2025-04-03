import { candidate, css, html, js, json, test, ts } from '../utils'

test(
  'error when no CSS file with @tailwind is used',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
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
      'src/index.html': html`
        <h1>🤠👋</h1>
        <div class="!flex"></div>
      `,
      'src/fonts.css': css`/* Unrelated CSS file */`,
    },
  },
  async ({ fs, exec, expect }) => {
    let output = await exec('npx @tailwindcss/upgrade')
    expect(output).toContain('Cannot find any CSS files that reference Tailwind CSS.')

    // Files should not be modified
    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <h1>🤠👋</h1>
      <div class="!flex"></div>

      --- ./src/fonts.css ---
      /* Unrelated CSS file */
      "
    `)
  },
)

test(
  `upgrades a v3 project to v4`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "devDependencies": {
            "@tailwindcss/cli": "workspace:^"
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
        <div
          class="!flex sm:!block bg-gradient-to-t bg-[--my-red] max-w-screen-md ml-[theme(screens.md)] group-[]:flex"
        ></div>
        <!-- Migrate to sm -->
        <div class="blur shadow rounded inset-shadow drop-shadow"></div>

        <!-- Migrate to xs -->
        <div class="blur-sm shadow-sm rounded-sm inset-shadow-sm drop-shadow-sm"></div>

        <!-- Migrate to 2xs -->
        <div class="shadow-xs inset-shadow-xs"></div>

        <!-- Migrate to -3 -->
        <div class="ring"></div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @variants hover, focus {
          .foo {
            color: red;
          }
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <h1>🤠👋</h1>
      <div
        class="flex! sm:block! bg-linear-to-t bg-(--my-red) max-w-(--breakpoint-md) ml-(--breakpoint-md) in-[.group]:flex"
      ></div>
      <!-- Migrate to sm -->
      <div class="blur-sm shadow-sm rounded-sm inset-shadow-sm drop-shadow-sm"></div>

      <!-- Migrate to xs -->
      <div class="blur-xs shadow-xs rounded-xs inset-shadow-xs drop-shadow-xs"></div>

      <!-- Migrate to 2xs -->
      <div class="shadow-2xs inset-shadow-2xs"></div>

      <!-- Migrate to -3 -->
      <div class="ring-3"></div>

      --- ./src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      @utility foo {
        color: red;
      }
      "
    `)

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringMatching(/^\^4/),
    })

    // Ensure the v4 project compiles correctly
    await exec('npx tailwindcss --input src/input.css --output dist/out.css')

    await fs.expectFileToContain('dist/out.css', [
      candidate`flex!`,
      candidate`sm:block!`,
      candidate`bg-linear-to-t`,
      candidate`bg-(--my-red)`,
      candidate`max-w-(--breakpoint-md)`,
      candidate`ml-(--breakpoint-md)`,
    ])
  },
)

test(
  `upgrades a v3 project with prefixes to v4`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
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
          class="!tw__flex sm:!tw__block tw__bg-gradient-to-t flex [color:red] group-[]:tw__flex"
        ></div>
        <div
          class="tw__group tw__group/foo tw__peer tw__peer/foo group-hover:tw__flex group-hover/foo:tw__flex peer-hover:tw__flex peer-hover/foo:tw__flex"
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <div
        class="tw:flex! tw:sm:block! tw:bg-linear-to-t flex tw:[color:red] tw:in-[.tw\\:group]:flex"
      ></div>
      <div
        class="tw:group tw:group/foo tw:peer tw:peer/foo tw:group-hover:flex tw:group-hover/foo:flex tw:peer-hover:flex tw:peer-hover/foo:flex"
      ></div>

      --- ./src/input.css ---
      @import 'tailwindcss' prefix(tw);

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

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
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss/tailwind.css';

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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

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
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss/tailwind.css';

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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

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
  'migrate imports with `layer(…)`',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import './base.css';
        @import './components.css';
        @import './utilities.css';
        @import './mix.css';

        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      'src/base.css': css`
        html {
          color: red;
        }
      `,
      'src/components.css': css`
        @layer components {
          .foo {
            color: red;
          }
        }
      `,
      'src/utilities.css': css`
        @layer utilities {
          .bar {
            color: red;
          }
        }
      `,
      'src/mix.css': css`
        html {
          color: blue;
        }

        @layer components {
          .foo-mix {
            color: red;
          }
        }

        @layer utilities {
          .bar-mix {
            color: red;
          }
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import './base.css' layer(base);
      @import './components.css';
      @import './utilities.css';
      @import './mix.css' layer(base);
      @import './mix.utilities.css';

      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- ./src/base.css ---
      html {
        color: red;
      }

      --- ./src/components.css ---
      @utility foo {
        color: red;
      }

      --- ./src/mix.css ---
      html {
        color: blue;
      }

      --- ./src/mix.utilities.css ---
      @utility foo-mix {
        color: red;
      }

      @utility bar-mix {
        color: red;
      }

      --- ./src/utilities.css ---
      @utility bar {
        color: red;
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
  async ({ exec, fs, expect }) => {
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
        <div class="bg-(--my-red)"></div>
      `,
    )

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      tailwindcss: expect.stringMatching(/^\^4/),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.dependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringMatching(/^\^4/),
    })
  },
)

test(
  '`@tailwindcss/postcss` should be installed in dependencies when `tailwindcss` exists in dependencies',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
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
            tailwindcss: {},
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.dependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringMatching(/^\^4/),
    })
  },
)

test(
  '`@tailwindcss/postcss` should be installed in devDependencies when `tailwindcss` exists in dev dependencies',
  {
    fs: {
      'package.json': json`
        {
          "devDependencies": {
            "postcss": "^8",
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
            tailwindcss: {},
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    let packageJsonContent = await fs.read('package.json')
    let packageJson = JSON.parse(packageJsonContent)
    expect(packageJson.devDependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringMatching(/^\^4/),
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-(--my-red)"></div>
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
      tailwindcss: expect.stringMatching(/^\^4/),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.dependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringMatching(/^\^4/),
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    await fs.expectFileToContain('src/index.css', css`@import 'tailwindcss';`)
    await fs.expectFileToContain(
      'src/index.html',
      // prettier-ignore
      js`
        <div class="bg-(--my-red)"></div>
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
      tailwindcss: expect.stringMatching(/^\^4/),
    })
    expect(packageJson.dependencies).not.toHaveProperty('autoprefixer')
    expect(packageJson.dependencies).not.toHaveProperty('postcss-import')
    expect(packageJson.dependencies).toMatchObject({
      '@tailwindcss/postcss': expect.stringMatching(/^\^4/),
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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
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
            "tailwindcss": "^3",
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
      'src/index.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      'src/index.html': html`
        <div class="tw__bg-gradient-to-t"></div>
      `,
      'src/other.html': html`
        <div class="bg-gradient-to-t"></div>
      `,
    },
  },
  async ({ exec, fs, expect }) => {
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
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss/tailwind.css';
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';
      @import './utilities.css';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

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
  'migrate utilities in an imported file and keep @utility top-level',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss/utilities';
        @import './utilities.css';
        @import 'tailwindcss/components';
      `,
      'src/utilities.css': css`
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
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss/utilities' layer(utilities);
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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
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
            "tailwindcss": "^3",
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
  async ({ exec, fs, expect }) => {
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
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': js`
        export default {
          content: ['./src/**/*.{html,js}'],
          plugins: [
            () => {}, // custom stuff which is too complicated to migrate to CSS
          ],
        }
      `,
      'src/index.html': html`
        <div
          class="!flex sm:!block bg-gradient-to-t bg-[--my-red]"
        ></div>
      `,
      'src/root.1/index.css': css`
        /* Inject missing @config */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      'src/root.1/tailwind.config.ts': js`
        export default {
          content: ['./src/**/*.{html,js}'],
          plugins: [
            () => {}, // custom stuff which is too complicated to migrate to CSS
          ],
        }
      `,
      'src/root.2/index.css': css`
        /* Already contains @config */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @config "../../tailwind.config.ts";
      `,
      'src/root.3/index.css': css`
        /* Inject missing @config above first @theme */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @custom-variant hocus (&:hover, &:focus);

        @theme {
          --color-red-500: #f00;
        }

        @theme {
          --color-blue-500: #00f;
        }
      `,
      'src/root.3/tailwind.config.ts': js`
        export default {
          content: ['./src/**/*.{html,js}'],
          plugins: [
            () => {}, // custom stuff which is too complicated to migrate to CSS
          ],
        }
      `,
      'src/root.4/index.css': css`
        /* Inject missing @config due to nested imports with tailwind imports */
        @import './base.css';
        @import './utilities.css';
      `,
      'src/root.4/tailwind.config.ts': js`
        export default {
          content: ['./src/**/*.{html,js}'],
          plugins: [
            () => {}, // custom stuff which is too complicated to migrate to CSS
          ],
        }
      `,
      'src/root.4/base.css': css`@import 'tailwindcss/base';`,
      'src/root.4/utilities.css': css`@import 'tailwindcss/utilities';`,

      'src/root.5/index.css': css`@import './tailwind.css';`,
      'src/root.5/tailwind.css': css`
        /* Inject missing @config in this file, due to full import */
        /* Should be located in the root: ../../ */
        @import 'tailwindcss';
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.{html,css}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <div
        class="flex! sm:block! bg-linear-to-t bg-(--my-red)"
      ></div>

      --- ./src/root.1/index.css ---
      /* Inject missing @config */
      @import 'tailwindcss';

      @config './tailwind.config.ts';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- ./src/root.2/index.css ---
      /* Already contains @config */
      @import 'tailwindcss';

      @config "../../tailwind.config.ts";

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- ./src/root.3/index.css ---
      /* Inject missing @config above first @theme */
      @import 'tailwindcss';

      @config './tailwind.config.ts';

      @custom-variant hocus (&:hover, &:focus);

      @theme {
        --color-red-500: #f00;
      }

      @theme {
        --color-blue-500: #00f;
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- ./src/root.4/index.css ---
      /* Inject missing @config due to nested imports with tailwind imports */
      @import './base.css';
      @import './utilities.css';

      @config './tailwind.config.ts';

      --- ./src/root.4/base.css ---
      @import 'tailwindcss/theme' layer(theme);
      @import 'tailwindcss/preflight' layer(base);

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- ./src/root.4/utilities.css ---
      @import 'tailwindcss/utilities' layer(utilities);

      --- ./src/root.5/index.css ---
      @import './tailwind.css';

      --- ./src/root.5/tailwind.css ---
      /* Inject missing @config in this file, due to full import */
      /* Should be located in the root: ../../ */
      @import 'tailwindcss';

      @config '../../tailwind.config.ts';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }
      "
    `)
  },
)

test(
  'multiple CSS roots that resolve to the same Tailwind config file requires manual intervention',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': js`
        export default {
          content: ['./src/**/*.{html,js}'],
          plugins: [
            () => {}, // custom stuff which is too complicated to migrate to CSS
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
        @config "../tailwind.config.ts";
      `,
      'src/root.3.css': css`
        /* Inject missing @config above first @theme */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @custom-variant hocus (&:hover, &:focus);

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
        @import 'tailwindcss/tailwind.css';
      `,
    },
  },
  async ({ exec, expect }) => {
    let output = await exec('npx @tailwindcss/upgrade --force', {}, { ignoreStdErr: true }).catch(
      (e) => e.toString(),
    )

    expect(output).toMatch('Could not determine configuration file for:')
  },
)

test(
  'injecting `@config` in the shared root, when a tailwind.config.{js,ts,…} is detected',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
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
      'src/index.css': css`@import './tailwind-setup.css';`,
      'src/tailwind-setup.css': css`
        @import './base.css';
        @import './components.css';
        @import './utilities.css';
      `,
      'src/base.css': css`
        html {
          color: red;
        }
        @tailwind base;
      `,
      'src/components.css': css`
        @import './typography.css';
        @layer components {
          .foo {
            color: red;
          }
        }
        @tailwind components;
      `,
      'src/typography.css': css`
        .typography {
          color: red;
        }
      `,
      'src/utilities.css': css`
        @layer utilities {
          .bar {
            color: red;
          }
        }
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.{html,css}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import './tailwind-setup.css';

      --- ./src/index.html ---
      <div
        class="flex! sm:block! bg-linear-to-t bg-(--my-red)"
      ></div>

      --- ./src/base.css ---
      @import 'tailwindcss/theme' layer(theme);
      @import 'tailwindcss/preflight' layer(base);

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      @layer base {
        html {
          color: red;
        }
      }

      --- ./src/components.css ---
      @import './typography.css' layer(components);

      @utility foo {
        color: red;
      }

      --- ./src/tailwind-setup.css ---
      @import './base.css';
      @import './components.css';
      @import './utilities.css';

      @config '../tailwind.config.ts';

      --- ./src/typography.css ---
      .typography {
        color: red;
      }

      --- ./src/utilities.css ---
      @import 'tailwindcss/utilities' layer(utilities);

      @utility bar {
        color: red;
      }
      "
    `)
  },
)

test(
  'injecting `@config` in the shared root (+ migrating), when a tailwind.config.{js,ts,…} is detected',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': js`
        export default {
          content: ['./src/**/*.{html,js}'],
          theme: {
            extend: {
              colors: {
                'my-red': 'red',
              },
            },
          },
        }
      `,
      'src/index.html': html`
        <div
          class="!flex sm:!block bg-gradient-to-t bg-[--my-red]"
        ></div>
      `,
      'src/index.css': css`@import './tailwind-setup.css';`,
      'src/tailwind-setup.css': css`
        @import './base.css';
        @import './components.css';
        @import './utilities.css';
      `,
      'src/base.css': css`
        html {
          color: red;
        }
        @tailwind base;
      `,
      'src/components.css': css`
        @import './typography.css';
        @layer components {
          .foo {
            color: red;
          }
        }
        @tailwind components;
      `,
      'src/typography.css': css`
        .typography {
          color: red;
        }
      `,
      'src/utilities.css': css`
        @layer utilities {
          .bar {
            color: red;
          }
        }
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.{html,css}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import './tailwind-setup.css';

      --- ./src/index.html ---
      <div
        class="flex! sm:block! bg-linear-to-t bg-(--my-red)"
      ></div>

      --- ./src/base.css ---
      @import 'tailwindcss/theme' layer(theme);
      @import 'tailwindcss/preflight' layer(base);

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      @layer base {
        html {
          color: red;
        }
      }

      --- ./src/components.css ---
      @import './typography.css' layer(components);

      @utility foo {
        color: red;
      }

      --- ./src/tailwind-setup.css ---
      @import './base.css';
      @import './components.css';
      @import './utilities.css';

      @theme {
        --color-my-red: red;
      }

      --- ./src/typography.css ---
      .typography {
        color: red;
      }

      --- ./src/utilities.css ---
      @import 'tailwindcss/utilities' layer(utilities);

      @utility bar {
        color: red;
      }
      "
    `)
  },
)

test(
  'finds the correct root Tailwind CSS file',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.ts': js`export default {}`,

      /* Considered a Tailwind root because of: `@import 'tailwindcss/components'` */
      'src/index.css': css`
        @import 'base.css';
        @import 'other.css';
        @import 'tailwindcss/components';
        @import 'utilities.css';
      `,

      /* Considered a Tailwind root because of: `@tailwind base` */
      'src/base.css': css`
        html {
          color: red;
        }
        @tailwind base;
      `,
      'src/other.css': css`
        .typography {
          color: red;
        }
      `,

      /* Considered a Tailwind root because of: `@tailwind utilities` */
      'src/utilities.css': css`
        @layer utilities {
          .foo {
            color: red;
          }
        }

        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.{html,css}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import './base.css' layer(components);
      @import './other.css' layer(components);
      @import './utilities.css';

      --- ./src/base.css ---
      @import 'tailwindcss/theme' layer(theme);
      @import 'tailwindcss/preflight' layer(base);

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      @layer base {
        html {
          color: red;
        }
      }

      --- ./src/other.css ---
      .typography {
        color: red;
      }

      --- ./src/utilities.css ---
      @import 'tailwindcss/utilities' layer(utilities);

      @utility foo {
        color: red;
      }
      "
    `)
  },
)

test(
  'relative imports without a relative path prefix are migrated to include a relative path prefix',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss/base';
        @import 'tailwindcss/components';
        @import 'styles/components';
        @import 'tailwindcss/utilities';
      `,
      'src/styles/components.css': css`
        .btn {
          @apply bg-black px-4 py-2 rounded-md text-white font-medium hover:bg-zinc-800;
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import 'tailwindcss';
      @import './styles/components.css' layer(components);

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- ./src/styles/components.css ---
      .btn {
        @apply bg-black px-4 py-2 rounded-md text-white font-medium hover:bg-zinc-800;
      }
      "
    `)
  },
)

test(
  'that it attaches the correct layers to the imported files',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import 'tailwindcss/components';

        /* No layer expected */
        @import './my-components.css';

        /* No layer expected */
        @import './my-utilities.css';

        /* Expecting a layer */
        @import './my-other.css';

        @import 'tailwindcss/utilities';
      `,
      'src/my-components.css': css`
        @layer components {
          .foo {
            color: red;
          }
        }
      `,
      'src/my-utilities.css': css`
        @layer utilities {
          .css {
            color: red;
          }
        }
      `,
      'src/my-other.css': css`
        /* All my fonts! */
        @font-face {
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    expect(await fs.dumpFiles('./src/**/*.css')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      /* No layer expected */
      @import './my-components.css';

      /* No layer expected */
      @import './my-utilities.css';

      /* Expecting a layer */
      @import './my-other.css' layer(components);

      @import 'tailwindcss/utilities' layer(utilities);

      --- ./src/my-components.css ---
      @utility foo {
        color: red;
      }

      --- ./src/my-other.css ---
      /* All my fonts! */
      @font-face {
      }

      --- ./src/my-utilities.css ---
      @utility css {
        color: red;
      }
      "
    `)
  },
)

test(
  'migrating the prettier-plugin-tailwindcss version',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "devDependencies": {
            "prettier-plugin-tailwindcss": "0.5.0"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    let pkg = JSON.parse(await fs.read('package.json'))

    expect(pkg.devDependencies).toMatchObject({
      'prettier-plugin-tailwindcss': expect.any(String),
    })
    expect(pkg.devDependencies['prettier-plugin-tailwindcss']).not.toEqual('0.5.0')
  },
)

test(
  'only migrate legacy classes when it is safe to do so',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "devDependencies": {
            "prettier-plugin-tailwindcss": "0.5.0"
          }
        }
      `,
      'tailwind.config.js': js`
        module.exports = {
          content: ['./*.html'],
          theme: {
            // Overrides the default boxShadow entirely so none of the
            // migrations are safe.
            boxShadow: {
              DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            },

            ringWidth: {
              DEFAULT: '4px',
            },

            extend: {
              // Changes the "before" class definition. 'blur' -> 'blur-sm' is
              // not safe because 'blur' has a custom value.
              //
              // But 'blur-sm' -> 'blur-xs' is safe because 'blur-xs' uses the
              // default value.
              blur: {
                DEFAULT: 'var(--custom-default-blur)',
              },
              backdropBlur: {
                DEFAULT: 'var(--custom-default-blur)',
              },

              // Changes the "after" class definition. 'rounded' -> 'rounded-sm' is
              // not safe because 'rounded-sm' has a custom value.
              borderRadius: {
                sm: 'var(--custom-rounded-sm)',
              },
            },
          },
        }
      `,
      'index.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      'index.html': html`
        <div>
          <div class="shadow shadow-sm shadow-xs"></div>
          <div class="blur blur-sm"></div>
          <div class="backdrop-blur backdrop-blur-sm"></div>
          <div class="rounded rounded-sm"></div>
          <div class="ring"></div>
        </div>
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    // Files should not be modified
    expect(await fs.dumpFiles('./*.{js,css,html}')).toMatchInlineSnapshot(`
      "
      --- index.css ---
      @import 'tailwindcss';

      @theme {
        --shadow-*: initial;
        --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

        --ring-width-*: initial;
        --ring-width: 4px;

        --blur: var(--custom-default-blur);

        --backdrop-blur: var(--custom-default-blur);

        --radius-sm: var(--custom-rounded-sm);
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- index.html ---
      <div>
        <div class="shadow shadow-sm shadow-xs"></div>
        <div class="blur blur-xs"></div>
        <div class="backdrop-blur backdrop-blur-xs"></div>
        <div class="rounded rounded-sm"></div>
        <div class="ring"></div>
      </div>
      "
    `)
  },
)

test(
  'make suffix-less migrations safe (e.g.: `blur`, `rounded`, `shadow`, `ring`)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "devDependencies": {
            "prettier-plugin-tailwindcss": "0.5.0"
          }
        }
      `,
      'tailwind.config.js': js`
        module.exports = {
          content: ['./*.{html,tsx}'],
        }
      `,
      'index.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      'index.html': html`
        <div class="rounded blur shadow ring"></div>
      `,
      'example-component.tsx': ts`
        type Star = [
          x: number,
          y: number,
          dim?: boolean,
          blur?: boolean,
          rounded?: boolean,
          shadow?: boolean,
          ring?: boolean,
        ]

        function Star({ point: [cx, cy, dim, blur, rounded, shadow, ring] }: { point: Star }) {
          return <svg class="rounded shadow blur ring" filter={blur ? 'url(…)' : undefined} />
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade --force')

    // Files should not be modified
    expect(await fs.dumpFiles('./*.{js,css,html,tsx}')).toMatchInlineSnapshot(`
      "
      --- index.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- index.html ---
      <div class="rounded-sm blur-sm shadow-sm ring-3"></div>

      --- example-component.tsx ---
      type Star = [
        x: number,
        y: number,
        dim?: boolean,
        blur?: boolean,
        rounded?: boolean,
        shadow?: boolean,
        ring?: boolean,
      ]

      function Star({ point: [cx, cy, dim, blur, rounded, shadow, ring] }: { point: Star }) {
        return <svg class="rounded-sm shadow-sm blur-sm ring-3" filter={blur ? 'url(…)' : undefined} />
      }
      "
    `)
  },
)

test(
  'passing in a single CSS file should resolve all imports and migrate them',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`module.exports = {}`,
      'src/index.css': css`
        @import './base.css';
        @import './components.css';
        @import './utilities.css';
        @import './generated/ignore-me.css';
      `,
      'src/generated/.gitignore': `
        *
        !.gitignore
      `,
      'src/generated/ignore-me.css': css`
        /* This should not be converted */
        @layer utilities {
          .ignore-me {
            color: red;
          }
        }
      `,
      'src/base.css': css`@import 'tailwindcss/base';`,
      'src/components.css': css`
        @import './typography.css';
        @layer components {
          .foo {
            color: red;
          }
        }
        @tailwind components;
      `,
      'src/utilities.css': css`
        @layer utilities {
          .bar {
            color: blue;
          }
        }
        @tailwind utilities;
      `,
      'src/typography.css': css`
        @layer components {
          .typography {
            color: red;
          }
        }
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade ./src/index.css')

    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.css ---
      @import './base.css';
      @import './components.css';
      @import './utilities.css';
      @import './generated/ignore-me.css';

      --- ./src/base.css ---
      @import 'tailwindcss/theme' layer(theme);
      @import 'tailwindcss/preflight' layer(base);

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }

      --- ./src/components.css ---
      @import './typography.css';

      @utility foo {
        color: red;
      }

      --- ./src/typography.css ---
      @utility typography {
        color: red;
      }

      --- ./src/utilities.css ---
      @import 'tailwindcss/utilities' layer(utilities);

      @utility bar {
        color: blue;
      }

      --- ./src/generated/ignore-me.css ---
      /* This should not be converted */
      @layer utilities {
        .ignore-me {
          color: red;
        }
      }
      "
    `)
  },
)

test(
  'requires Tailwind v3 before attempting an upgrade',
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
      'tailwind.config.ts': js` export default {} `,
      'src/index.html': html`
        <div class="underline"></div>
      `,
      'src/index.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, expect }) => {
    let output = await exec('npx @tailwindcss/upgrade', {}, { ignoreStdErr: true }).catch((e) =>
      e.toString(),
    )

    expect(output).toMatch(
      /Tailwind CSS v.* found. The migration tool can only be run on v3 projects./,
    )
  },
)

test(
  `upgrades opacity namespace values to percentages`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "devDependencies": {
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          theme: {
            opacity: {
              0: '0',
              2.5: '.025',
              5: '.05',
              7.5: 0.075,
              10: 0.1,

              semitransparent: '0.5',
              transparent: 1,

              50: '50%',
              50.5: '50.5%',
              '50.50': '50.5%',
              '75%': '75%',
              '100%': '100%',
            },
          },
          content: ['./src/**/*.{html,js}'],
        }
      `,
      'src/index.html': html`
        <div
          class="text-red-500/0
            text-red-500/2.5
            text-red-500/5
            text-red-500/7.5
            text-red-500/10
            text-red-500/semitransparent
            text-red-500/transparent
            text-red-500/50
            text-red-500/50.5
            text-red-500/50.50
            text-red-500/50%
            text-red-500/100%"
        ></div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      <div
        class="text-red-500/0
          text-red-500/2.5
          text-red-500/5
          text-red-500/7.5
          text-red-500/10
          text-red-500/semitransparent
          text-red-500/transparent
          text-red-500/50
          text-red-500/50.5
          text-red-500/50.50
          text-red-500/50%
          text-red-500/100%"
      ></div>

      --- ./src/input.css ---
      @import 'tailwindcss';

      @theme {
        --opacity-*: initial;
        --opacity-semitransparent: 50%;
        --opacity-transparent: 100%;
        --opacity-50_50: 50.5%;
        --opacity-75\\%: 75%;
        --opacity-100\\%: 100%;
      }

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }
      "
    `)
  },
)

test(
  `can read files with BOM`,
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "devDependencies": {
            "@tailwindcss/cli": "workspace:^"
          }
        }
      `,
      'tailwind.config.js': js`
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: ['./src/**/*.{html,js}'],
        }
      `,
      'src/index.html': withBOM(html`
        <div class="ring"></div>
      `),
      'src/input.css': withBOM(css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `),
    },
  },
  async ({ exec, fs, expect }) => {
    await exec('npx @tailwindcss/upgrade')

    expect(await fs.dumpFiles('./src/**/*.{css,html}')).toMatchInlineSnapshot(`
      "
      --- ./src/index.html ---
      ﻿<div class="ring-3"></div>

      --- ./src/input.css ---
      @import 'tailwindcss';

      /*
        The default border color has changed to \`currentcolor\` in Tailwind CSS v4,
        so we've added these compatibility styles to make sure everything still
        looks the same as it did with Tailwind CSS v3.

        If we ever want to remove these styles, we need to add an explicit border
        color utility to any element that depends on these defaults.
      */
      @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
          border-color: var(--color-gray-200, currentcolor);
        }
      }
      "
    `)
  },
)

function withBOM(text: string): string {
  return '\uFEFF' + text
}

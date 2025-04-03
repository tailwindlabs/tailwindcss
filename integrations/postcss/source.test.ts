import dedent from 'dedent'
import path from 'node:path'
import { candidate, css, html, js, json, test, yaml } from '../utils'

test(
  'auto source detection kitchen sink',
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
      'index.css': css`
        @reference 'tailwindcss/theme';

        /* (1) */
        /* - Only './src' should be auto-scanned, not the current working directory */
        /* - .gitignore'd paths should be ignored (node_modules) */
        /* - Binary extensions should be ignored (jpg, zip) */
        @import 'tailwindcss/utilities' source('./src');

        /* (2) */
        /* - All HTML and JSX files in 'ignored/components' should be scanned */
        /* - All other extensions should be ignored */
        @source "./ignored/components/*.{html,jsx}";

        /* (3) */
        /* - './components' should be auto-scanned in addition to './src' */
        /* - './components/ignored.html' should still be ignored */
        /* - Binary extensions in './components' should be ignored */
        @source "./components";

        /* (4) */
        /* - './pages' should be auto-scanned */
        /* - Only '.html' files should be included */
        /* - './page/ignored.html' will not be ignored because of the specific pattern */
        @source "./pages/**/*.html";
      `,

      '.gitignore': dedent`
        /src/ignored
        /ignored
        /components/ignored.html
        /pages/ignored.html
      `,

      // (1)
      'index.html': 'content-["index.html"] content-["BAD"]', // "Root" source is in `./src`
      'src/index.html': 'content-["src/index.html"]',
      'src/nested/index.html': 'content-["src/nested/index.html"]',
      'src/index.jpg': 'content-["src/index.jpg"] content-["BAD"]',
      'src/nested/index.tar': 'content-["src/nested/index.tar"] content-["BAD"]',
      'src/ignored/index.html': 'content-["src/ignored/index.html"] content-["BAD"]',

      // (2)
      'ignored/components/my-component.html': 'content-["ignored/components/my-component.html"]',
      'ignored/components/my-component.jsx': 'content-["ignored/components/my-component.jsx"]',

      // Ignored and not explicitly listed by (2)
      'ignored/components/my-component.tsx':
        'content-["ignored/components/my-component.tsx"] content-["BAD"]',
      'ignored/components/nested/my-component.html':
        'content-["ignored/components/nested/my-component.html"] content-["BAD"]',

      // (3)
      'components/my-component.tsx': 'content-["components/my-component.tsx"]',
      'components/nested/my-component.tsx': 'content-["components/nested/my-component.tsx"]',
      'components/ignored.html': 'content-["components/ignored.html"] content-["BAD"]',

      // (4)
      'pages/foo.html': 'content-["pages/foo.html"]',
      'pages/nested/foo.html': 'content-["pages/nested/foo.html"]',
      'pages/ignored.html': 'content-["pages/ignored.html"]',
      'pages/foo.jsx': 'content-["pages/foo.jsx"] content-["BAD"]',
      'pages/nested/foo.jsx': 'content-["pages/nested/foo.jsx"] content-["BAD"]',
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm postcss index.css --output dist/out.css')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      @layer properties;
      .content-\\[\\"components\\/my-component\\.tsx\\"\\] {
        --tw-content: "components/my-component.tsx";
        content: var(--tw-content);
      }
      .content-\\[\\"components\\/nested\\/my-component\\.tsx\\"\\] {
        --tw-content: "components/nested/my-component.tsx";
        content: var(--tw-content);
      }
      .content-\\[\\"ignored\\/components\\/my-component\\.html\\"\\] {
        --tw-content: "ignored/components/my-component.html";
        content: var(--tw-content);
      }
      .content-\\[\\"ignored\\/components\\/my-component\\.jsx\\"\\] {
        --tw-content: "ignored/components/my-component.jsx";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/foo\\.html\\"\\] {
        --tw-content: "pages/foo.html";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/ignored\\.html\\"\\] {
        --tw-content: "pages/ignored.html";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/nested\\/foo\\.html\\"\\] {
        --tw-content: "pages/nested/foo.html";
        content: var(--tw-content);
      }
      .content-\\[\\"src\\/index\\.html\\"\\] {
        --tw-content: "src/index.html";
        content: var(--tw-content);
      }
      .content-\\[\\"src\\/nested\\/index\\.html\\"\\] {
        --tw-content: "src/nested/index.html";
        content: var(--tw-content);
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      @layer properties {
        @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
          *, ::before, ::after, ::backdrop {
            --tw-content: "";
          }
        }
      }
      "
    `)
  },
)

test(
  'auto source detection in depth, source(…) and `@source` can be configured to use auto source detection (build + watch mode)',
  {
    fs: {
      'package.json': json`{}`,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - project-a
      `,
      'project-a/package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'project-a/postcss.config.js': js`
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'project-a/src/index.css': css`
        @reference 'tailwindcss/theme';

        /* Run auto-content detection in ../../project-b */
        @import 'tailwindcss/utilities' source('../../project-b');

        /* Explicitly using node_modules in the @source allows git ignored folders */
        @source '../node_modules/{my-lib-1,my-lib-2}/src/**/*.html';

        /* We typically ignore these extensions, but now include them explicitly */
        @source './logo.{jpg,png}';

        /* Project C should apply auto source detection */
        @source '../../project-c';

        /* Project D should apply auto source detection rules, such as ignoring node_modules */
        @source '../../project-d/**/*.{html,js}';
        @source '../../project-d/**/*.bin';

        /* Same as above, but my-lib-2 _should_ be includes */
        @source '../../project-d/node_modules/my-lib-2/src/*.{html,js}';

        /* bar.html is git ignored, but explicitly listed here to scan */
        @source '../../project-d/src/bar.html';
      `,

      // Project A is the current folder, but we explicitly configured
      // `source(project-b)`, therefore project-a should not be included in
      // the output.
      'project-a/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-a/src/index.html']"
        ></div>
      `,

      // Project A explicitly includes an extension we usually ignore,
      // therefore it should be included in the output.
      'project-a/src/logo.jpg': html`
        <div
          class="content-['project-a/src/logo.jpg']"
        ></div>
      `,

      // Project A explicitly includes node_modules/{my-lib-1,my-lib-2},
      // therefore these files should be included in the output.
      'project-a/node_modules/my-lib-1/src/index.html': html`
        <div
          class="content-['project-a/node_modules/my-lib-1/src/index.html']"
        ></div>
      `,
      'project-a/node_modules/my-lib-2/src/index.html': html`
        <div
          class="content-['project-a/node_modules/my-lib-2/src/index.html']"
        ></div>
      `,

      // Project B is the configured `source(…)`, therefore auto source
      // detection should include known extensions and folders in the output.
      'project-b/src/index.html': html`
        <div
          class="content-['project-b/src/index.html']"
        ></div>
      `,

      // Project B is the configured `source(…)`, therefore auto source
      // detection should apply and node_modules should not be included in the
      // output.
      'project-b/node_modules/my-lib-3/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-b/node_modules/my-lib-3/src/index.html']"
        ></div>
      `,

      // Project C should apply auto source detection, therefore known
      // extensions and folders should be included in the output.
      'project-c/src/index.html': html`
        <div
          class="content-['project-c/src/index.html']"
        ></div>
      `,

      // Project C should apply auto source detection, therefore known ignored
      // extensions should not be included in the output.
      'project-c/src/logo.jpg': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-c/src/logo.jpg']"
        ></div>
      `,

      // Project C should apply auto source detection, therefore node_modules
      // should not be included in the output.
      'project-c/node_modules/my-lib-1/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-c/node_modules/my-lib-1/src/index.html']"
        ></div>
      `,

      // Project D should apply auto source detection rules, such as ignoring
      // node_modules.
      'project-d/node_modules/my-lib-1/src/index.html': html`
        <div
          class="content-['SHOULD-NOT-EXIST-IN-OUTPUT'] content-['project-d/node_modules/my-lib-1/src/index.html']"
        ></div>
      `,

      // Project D has an explicit glob containing node_modules, thus should include the html file
      'project-d/node_modules/my-lib-2/src/index.html': html`
        <div
          class="content-['project-d/node_modules/my-lib-2/src/index.html']"
        ></div>
      `,

      'project-d/src/.gitignore': dedent`
        foo.html
        bar.html
      `,

      // Project D, foo.html is ignored by the gitignore file but the source rule is explicit about
      // adding all `.html` files.
      'project-d/src/foo.html': html`
        <div
          class="content-['project-d/src/foo.html']"
        ></div>
      `,

      // Project D, bar.html is ignored by the gitignore file. But explicitly
      // listed as a `@source` glob.
      'project-d/src/bar.html': html`
        <div
          class="content-['project-d/src/bar.html']"
        ></div>
      `,

      // Project D should look for files with the extensions html and js.
      'project-d/src/index.html': html`
        <div
          class="content-['project-d/src/index.html']"
        ></div>
      `,

      // Project D should have a binary file even though we ignore binary files
      // by default, but it's explicitly listed.
      'project-d/my-binary-file.bin': html`
        <div
          class="content-['project-d/my-binary-file.bin']"
        ></div>
      `,
    },
  },
  async ({ fs, exec, spawn, root, expect }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css --verbose', {
      cwd: path.join(root, 'project-a'),
    })

    expect(await fs.dumpFiles('./project-a/dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./project-a/dist/out.css ---
      @layer properties;
      .content-\\[\\'project-a\\/node_modules\\/my-lib-1\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-a/node modules/my-lib-1/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-a\\/node_modules\\/my-lib-2\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-a/node modules/my-lib-2/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-a\\/src\\/logo\\.jpg\\'\\] {
        --tw-content: 'project-a/src/logo.jpg';
        content: var(--tw-content);
      }
      .content-\\[\\'project-b\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-b/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-c\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-c/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/my-binary-file\\.bin\\'\\] {
        --tw-content: 'project-d/my-binary-file.bin';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/node_modules\\/my-lib-2\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-d/node modules/my-lib-2/src/index.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/src\\/bar\\.html\\'\\] {
        --tw-content: 'project-d/src/bar.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/src\\/foo\\.html\\'\\] {
        --tw-content: 'project-d/src/foo.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-d\\/src\\/index\\.html\\'\\] {
        --tw-content: 'project-d/src/index.html';
        content: var(--tw-content);
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      @layer properties {
        @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
          *, ::before, ::after, ::backdrop {
            --tw-content: "";
          }
        }
      }
      "
    `)

    // Watch mode tests
    let process = await spawn(
      'pnpm postcss src/index.css --output dist/out.css --watch --verbose',
      {
        cwd: path.join(root, 'project-a'),
      },
    )
    await process.onStderr((message) => message.includes('Waiting for file changes...'))

    // Changes to project-a should not be included in the output, we changed the
    // base folder to project-b.
    await fs.write(
      'project-a/src/index.html',
      html`<div class="[.changed_&]:content-['project-a/src/index.html']"></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/src/index.html']`,
    ])

    // Changes to this file should be included, because we explicitly listed
    // them using `@source`.
    await fs.write(
      'project-a/src/logo.jpg',
      html`<div class="[.changed_&]:content-['project-a/src/logo.jpg']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/src/logo.jpg']`,
    ])

    // Changes to these files should be included, because we explicitly listed
    // them using `@source`.
    await fs.write(
      'project-a/node_modules/my-lib-1/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-a/node_modules/my-lib-1/src/index.html']"
        ></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/node_modules/my-lib-1/src/index.html']`,
    ])

    await fs.write(
      'project-a/node_modules/my-lib-2/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-a/node_modules/my-lib-2/src/index.html']"
        ></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/node_modules/my-lib-2/src/index.html']`,
    ])

    // Changes to this file should be included, because we changed the base to
    // `project-b`.
    await fs.write(
      'project-b/src/index.html',
      html`<div class="[.changed_&]:content-['project-b/src/index.html']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-b/src/index.html']`,
    ])

    // Changes to this file should not be included. We did change the base to
    // `project-b`, but we still apply the auto source detection rules which
    // ignore `node_modules`.
    await fs.write(
      'project-b/node_modules/my-lib-3/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-b/node_modules/my-lib-3/src/index.html']"
        ></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-b/node_modules/my-lib-3/src/index.html']`,
    ])

    // Project C was added explicitly via `@source`, therefore changes to these
    // files should be included.
    await fs.write(
      'project-c/src/index.html',
      html`<div class="[.changed_&]:content-['project-c/src/index.html']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-c/src/index.html']`,
    ])

    // Except for these files, since they are ignored by the default auto source
    // detection rules.
    await fs.write(
      'project-c/src/logo.jpg',
      html`<div class="[.changed_&]:content-['project-c/src/logo.jpg']"></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-c/src/logo.jpg']`,
    ])
    await fs.write(
      'project-c/node_modules/my-lib-1/src/index.html',
      html`<div
          class="[.changed_&]:content-['project-c/node_modules/my-lib-1/src/index.html']"
        ></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-c/node_modules/my-lib-1/src/index.html']`,
    ])

    // Creating new files in the "root" of auto source detected folders
    // We need to create the files and *then* update them because postcss-cli
    // does not pick up new files — only changes to existing files.
    await fs.create([
      'project-b/new-file.html',
      'project-b/new-folder/new-file.html',
      'project-c/new-file.html',
      'project-c/new-folder/new-file.html',
    ])

    // If we don't wait writes will be coalesced into a "add" event which
    // isn't picked up by postcss-cli.
    await new Promise((resolve) => setTimeout(resolve, 100))

    await fs.write(
      'project-b/new-file.html',
      html`<div class="[.created_&]:content-['project-b/new-file.html']"></div>`,
    )
    await fs.write(
      'project-b/new-folder/new-file.html',
      html`<div class="[.created_&]:content-['project-b/new-folder/new-file.html']"></div>`,
    )
    await fs.write(
      'project-c/new-file.html',
      html`<div class="[.created_&]:content-['project-c/new-file.html']"></div>`,
    )
    await fs.write(
      'project-c/new-folder/new-file.html',
      html`<div class="[.created_&]:content-['project-c/new-folder/new-file.html']"></div>`,
    )

    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.created_&]:content-['project-b/new-file.html']`,
      candidate`[.created_&]:content-['project-b/new-folder/new-file.html']`,
      candidate`[.created_&]:content-['project-c/new-file.html']`,
      candidate`[.created_&]:content-['project-c/new-folder/new-file.html']`,
    ])
  },
)

test(
  'auto source detection disabled',
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
      'index.css': css`
        @reference 'tailwindcss/theme';

        /* (1) */
        /* - Only './src' should be auto-scanned, not the current working directory */
        /* - .gitignore'd paths should be ignored (node_modules) */
        /* - Binary extensions should be ignored (jpg, zip) */
        @import 'tailwindcss/utilities' source(none);

        /* (2) */
        /* - './pages' should be auto-scanned */
        /* - Only '.html' files should be included */
        /* - './page/ignored.html' will not be ignored because of the specific pattern */
        @source "./pages/**/*.html";
      `,

      '.gitignore': dedent`
        /src/ignored
        /pages/ignored.html
      `,

      // (1)
      'index.html': 'content-["index.html"] content-["BAD"]', // "Root" source is in `./src`
      'src/index.html': 'content-["src/index.html"] content-["BAD"]',
      'src/nested/index.html': 'content-["src/nested/index.html"] content-["BAD"]',
      'src/index.jpg': 'content-["src/index.jpg"] content-["BAD"]',
      'src/nested/index.tar': 'content-["src/nested/index.tar"] content-["BAD"]',
      'src/ignored/index.html': 'content-["src/ignored/index.html"] content-["BAD"]',

      // (4)
      'pages/foo.html': 'content-["pages/foo.html"]',
      'pages/nested/foo.html': 'content-["pages/nested/foo.html"]',
      'pages/ignored.html': 'content-["pages/ignored.html"]',
      'pages/foo.jsx': 'content-["pages/foo.jsx"] content-["BAD"]',
      'pages/nested/foo.jsx': 'content-["pages/nested/foo.jsx"] content-["BAD"]',
    },
  },
  async ({ fs, exec, expect }) => {
    await exec('pnpm postcss index.css --output dist/out.css')

    expect(await fs.dumpFiles('./dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./dist/out.css ---
      @layer properties;
      .content-\\[\\"pages\\/foo\\.html\\"\\] {
        --tw-content: "pages/foo.html";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/ignored\\.html\\"\\] {
        --tw-content: "pages/ignored.html";
        content: var(--tw-content);
      }
      .content-\\[\\"pages\\/nested\\/foo\\.html\\"\\] {
        --tw-content: "pages/nested/foo.html";
        content: var(--tw-content);
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      @layer properties {
        @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
          *, ::before, ::after, ::backdrop {
            --tw-content: "";
          }
        }
      }
      "
    `)
  },
)

test(
  '`@source not "…"`',
  {
    fs: {
      'package.json': json`{}`,
      'pnpm-workspace.yaml': yaml`
        #
        packages:
          - project-a
      `,
      'project-a/package.json': json`
        {
          "dependencies": {
            "postcss": "^8",
            "postcss-cli": "^10",
            "tailwindcss": "workspace:^",
            "@tailwindcss/postcss": "workspace:^"
          }
        }
      `,
      'project-a/postcss.config.js': js`
        module.exports = {
          plugins: {
            '@tailwindcss/postcss': {},
          },
        }
      `,
      'project-a/src/index.css': css`
        @reference 'tailwindcss/theme';
        @import 'tailwindcss/utilities';

        /* Ignore a specific file */
        @source not "./ignore-me-file.html";

        /* Ignore a entire folder */
        @source not "./ignore-me-folder";

        /* Ignore an extension */
        @source not "**/*.ts";

        /* Explicit source detection for 'project-b' */
        @source "../../project-b/**/*.html";

        /* Explicitly ignoring a file in 'project-b' */
        @source not "../../project-b/src/ignore-me.html";
      `,
      'project-a/src/ignore-me-file.html': html`
        <div>
          <div class="content-['project-a/src/ignore-me-file.html']"></div>
        </div>
      `,
      'project-a/src/ignore-me-folder/index.html': html`
        <div>
          <div class="content-['project-a/src/ignore-me-folder/index.html']"></div>
        </div>
      `,
      'project-a/src/keep-me.html': html`<div class="content-['keep-me.html']"></div>`,
      'project-a/src/ignore-me-extension.ts': html`
        <div>
          <div class="content-['ignore-me-extension.ts']"></div>
        </div>
      `,
      'project-b/src/ignore-me.html': html`
        <div>
          <div class="content-['project-b/src/ignore-me.html']"></div>
        </div>
      `,
      'project-b/src/keep-me.html': html`
        <div>
          <div class="content-['project-b/src/keep-me.html']"></div>
        </div>
      `,
    },
  },
  async ({ fs, exec, spawn, root, expect }) => {
    await exec('pnpm postcss src/index.css --output dist/out.css --verbose', {
      cwd: path.join(root, 'project-a'),
    })

    expect(await fs.dumpFiles('./project-a/dist/*.css')).toMatchInlineSnapshot(`
      "
      --- ./project-a/dist/out.css ---
      @layer properties;
      .content-\\[\\'keep-me\\.html\\'\\] {
        --tw-content: 'keep-me.html';
        content: var(--tw-content);
      }
      .content-\\[\\'project-b\\/src\\/keep-me\\.html\\'\\] {
        --tw-content: 'project-b/src/keep-me.html';
        content: var(--tw-content);
      }
      @property --tw-content {
        syntax: "*";
        inherits: false;
        initial-value: "";
      }
      @layer properties {
        @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
          *, ::before, ::after, ::backdrop {
            --tw-content: "";
          }
        }
      }
      "
    `)

    // Watch mode tests
    let process = await spawn(
      'pnpm postcss src/index.css --output dist/out.css --watch --verbose',
      {
        cwd: path.join(root, 'project-a'),
      },
    )
    await process.onStderr((message) => message.includes('Waiting for file changes...'))

    fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`content-['project-a/src/ignore-me-file.html']`,
      candidate`content-['project-a/src/ignore-me-folder/index.html']`,
      candidate`content-['project-b/src/ignore-me.html']`,
    ])

    // Changes to the keep-me files should be included
    await fs.write(
      'project-a/src/keep-me.html',
      html`<div class="[.changed_&]:content-['project-a/src/keep-me.html']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/src/keep-me.html']`,
    ])

    await fs.write(
      'project-b/src/keep-me.html',
      html`<div class="[.changed_&]:content-['project-b/src/keep-me.html']"></div>`,
    )
    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-b/src/keep-me.html']`,
    ])

    // Changes to the ignored files should not be included
    await fs.write(
      'project-a/src/ignore-me.html',
      html`<div class="[.changed_&]:content-['project-a/src/ignore-me.html']"></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-a/src/ignore-me.html']`,
    ])

    await fs.write(
      'project-b/src/ignore-me.html',
      html`<div class="[.changed_&]:content-['project-b/src/ignore-me.html']"></div>`,
    )
    await fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`[.changed_&]:content-['project-b/src/ignore-me.html']`,
    ])

    fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`content-['project-a/src/ignore-me-file.html']`,
      candidate`content-['project-a/src/ignore-me-folder/index.html']`,
      candidate`content-['project-b/src/ignore-me.html']`,
    ])

    // Creating new files that match the source patterns should be included.
    await fs.create([
      'project-a/src/new-file.html',
      'project-a/src/new-folder/new-file.html',
      'project-b/src/new-file.html',
      'project-b/src/new-folder/new-file.html',
    ])

    await fs.write(
      'project-a/src/new-file.html',
      html`<div class="[.created_&]:content-['project-a/src/new-file.html']"></div>`,
    )
    await fs.write(
      'project-a/src/new-folder/new-file.html',
      html`<div class="[.created_&]:content-['project-a/src/new-folder/new-file.html']"></div>`,
    )
    await fs.write(
      'project-b/src/new-file.html',
      html`<div class="[.created_&]:content-['project-b/src/new-file.html']"></div>`,
    )
    await fs.write(
      'project-b/src/new-folder/new-file.html',
      html`<div class="[.created_&]:content-['project-b/src/new-folder/new-file.html']"></div>`,
    )

    // If we don't wait writes will be coalesced into a "add" event which
    // isn't picked up by postcss-cli.
    await new Promise((resolve) => setTimeout(resolve, 100))

    await fs.expectFileToContain('./project-a/dist/out.css', [
      candidate`[.created_&]:content-['project-a/src/new-file.html']`,
      candidate`[.created_&]:content-['project-a/src/new-folder/new-file.html']`,
      candidate`[.created_&]:content-['project-b/src/new-file.html']`,
      candidate`[.created_&]:content-['project-b/src/new-folder/new-file.html']`,
    ])

    fs.expectFileNotToContain('./project-a/dist/out.css', [
      candidate`content-['project-a/src/ignore-me-file.html']`,
      candidate`content-['project-a/src/ignore-me-folder/index.html']`,
      candidate`content-['project-b/src/ignore-me.html']`,
    ])
  },
)

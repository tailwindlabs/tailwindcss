// @ts-expect-error This path does exist
import { version } from '../../packages/tailwindcss/package.json'
import { css, html, js, json, test } from '../utils'

test(
  'upgrades half-upgraded v3 project to v4 (pnpm)',
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
        <div class="!flex">Hello World</div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, expect }) => {
    // Ensure we are in a git repo
    await exec('git init')
    await exec('git add --all')
    await exec('git commit -m "before migration"')

    // Fully upgrade to v4
    await exec('npx @tailwindcss/upgrade')

    // Undo all changes to the current repo. This will bring the repo back to a
    // v3 state, but the `node_modules` will now have v4 installed.
    await exec('git reset --hard HEAD')

    // Re-running the upgrade should result in an error
    return expect(() => {
      return exec('npx @tailwindcss/upgrade', {}, { ignoreStdErr: true }).catch((e) => {
        // Replacing the current version with a hardcoded `v4` to make it stable
        // when we release new minor/patch versions.
        return Promise.reject(e.message.replaceAll(version, '4.0.0'))
      })
    }).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Command failed: npx @tailwindcss/upgrade
      ≈ tailwindcss v4.0.0

      │ ↳ Upgrading from Tailwind CSS \`v4.0.0\` 

      │ ↳ Version mismatch 
      │    
      │   \`\`\`diff 
      │   - "tailwindcss": "^3" (expected version in package.json / lockfile) 
      │   + "tailwindcss": "4.0.0" (installed version in \`node_modules\`) 
      │   \`\`\` 
      │    
      │   Make sure to run \`pnpm install\`, and try again. 

      "
    `)
  },
)

test(
  'upgrades half-upgraded v3 project to v4 (bun)',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "tailwindcss": "^3",
            "@tailwindcss/upgrade": "workspace:^"
          },
          "devDependencies": {
            "@tailwindcss/cli": "workspace:^",
            "bun": "^1.0.0"
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
        <div class="!flex">Hello World</div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, expect }) => {
    // Use `bun` to install dependencies
    await exec('rm ./pnpm-lock.yaml')
    await exec('npx bun install')

    // Ensure we are in a git repo
    await exec('git init')
    await exec('git add --all')
    await exec('git commit -m "before migration"')

    // Fully upgrade to v4
    await exec('npx @tailwindcss/upgrade')

    // Undo all changes to the current repo. This will bring the repo back to a
    // v3 state, but the `node_modules` will now have v4 installed.
    await exec('git reset --hard HEAD')

    // Re-running the upgrade should result in an error
    return expect(() => {
      return exec('npx @tailwindcss/upgrade', {}, { ignoreStdErr: true }).catch((e) => {
        // Replacing the current version with a hardcoded `v4` to make it stable
        // when we release new minor/patch versions.
        return Promise.reject(e.message.replaceAll(version, '4.0.0'))
      })
    }).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Command failed: npx @tailwindcss/upgrade
      ≈ tailwindcss v4.0.0

      │ ↳ Upgrading from Tailwind CSS \`v4.0.0\` 

      │ ↳ Version mismatch 
      │    
      │   \`\`\`diff 
      │   - "tailwindcss": "^3" (expected version in package.json / lockfile) 
      │   + "tailwindcss": "4.0.0" (installed version in \`node_modules\`) 
      │   \`\`\` 
      │    
      │   Make sure to run \`bun install\`, and try again. 

      "
    `)
  },
)

test(
  'upgrades half-upgraded v3 project to v4 (npm)',
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
        <div class="!flex">Hello World</div>
      `,
      'src/input.css': css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    },
  },
  async ({ exec, expect }) => {
    // Use `bun` to install dependencies
    await exec('rm ./pnpm-lock.yaml')
    await exec('rm -rf ./node_modules')
    await exec('npm install')

    // Ensure we are in a git repo
    await exec('git init')
    await exec('git add --all')
    await exec('git commit -m "before migration"')

    // Fully upgrade to v4
    await exec('npx @tailwindcss/upgrade')

    // Undo all changes to the current repo. This will bring the repo back to a
    // v3 state, but the `node_modules` will now have v4 installed.
    await exec('git reset --hard HEAD')

    // Re-running the upgrade should result in an error
    return expect(() => {
      return exec('npx @tailwindcss/upgrade', {}, { ignoreStdErr: true }).catch((e) => {
        // Replacing the current version with a hardcoded `v4` to make it stable
        // when we release new minor/patch versions.
        return Promise.reject(e.message.replaceAll(version, '4.0.0'))
      })
    }).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Command failed: npx @tailwindcss/upgrade
      ≈ tailwindcss v4.0.0

      │ ↳ Upgrading from Tailwind CSS \`v4.0.0\` 

      │ ↳ Version mismatch 
      │    
      │   \`\`\`diff 
      │   - "tailwindcss": "^3" (expected version in package.json / lockfile) 
      │   + "tailwindcss": "4.0.0" (installed version in \`node_modules\`) 
      │   \`\`\` 
      │    
      │   Make sure to run \`npm install\`, and try again. 

      "
    `)
  },
)

import fs from 'node:fs/promises'
import path from 'node:path'
import { js, json, test } from '../utils'

test(
  '@tailwindcss/oxide will fail when architecture-specific packages are missing',
  {
    fs: {
      'package.json': json`
        {
          "dependencies": {
            "@tailwindcss/oxide": "workspace:^"
          }
        }
      `,
      'test.js': js`
        try {
          let Scanner = require('@tailwindcss/oxide')
          console.log('SUCCESS: @tailwindcss/oxide loaded successfully', Scanner)
        } catch (error) {
          console.log('FAILURE: Failed to load @tailwindcss/oxide:', error.message)
        }
      `,
    },
  },
  async ({ exec, root, expect, fs }) => {
    await removePlatformSpecificExtensions(path.join(root, 'node_modules'))

    // Get last published version
    let version = (await exec('npm show @tailwindcss/oxide version')).trim()
    // Ensure that we don't depend on a specific version number in the download
    // script in case we bump the version number in the repository and CI is run
    // before a release
    let packageJson = JSON.parse(await fs.read('node_modules/@tailwindcss/oxide/package.json'))
    packageJson.version = version
    await fs.write(
      'node_modules/@tailwindcss/oxide/package.json',
      JSON.stringify(packageJson, null, 2),
    )

    let opts = {
      // Ensure that we don't include any node paths from the test runner
      env: { NODE_PATH: '' },
    }

    expect(await exec('node test.js', opts)).toMatch(/FAILURE/)

    // Now run the post-install script
    await exec('node node_modules/@tailwindcss/oxide/scripts/install.js', opts)

    expect(await exec('node test.js', opts)).toMatch(/SUCCESS/)
  },
)

async function removePlatformSpecificExtensions(directory: string) {
  let entries = await fs.readdir(directory, { withFileTypes: true })

  for (let entry of entries) {
    let fullPath = path.join(directory, entry.name)

    if (entry.name.startsWith('oxide-')) {
      if (entry.isSymbolicLink()) {
        await fs.unlink(fullPath)
      } else if (entry.isFile()) {
        await fs.unlink(fullPath)
      } else if (entry.isDirectory()) {
        await fs.rm(fullPath, { recursive: true, force: true })
      }
    } else if (entry.isDirectory()) {
      await removePlatformSpecificExtensions(fullPath)
    }
  }
}

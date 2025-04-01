import fs from 'node:fs/promises'
import path from 'node:path'
import { pkg } from '../../utils/packages'
import { highlight, success } from '../../utils/renderer'

export async function migratePrettierPlugin(base: string) {
  let packageJsonPath = path.resolve(base, 'package.json')
  try {
    let packageJson = await fs.readFile(packageJsonPath, 'utf-8')
    if (packageJson.includes('prettier-plugin-tailwindcss')) {
      await pkg(base).add(['prettier-plugin-tailwindcss@latest'])
      success(`Updated package: ${highlight('prettier-plugin-tailwindcss')}`, { prefix: '↳ ' })
    }
  } catch {}
}

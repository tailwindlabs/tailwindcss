import { plugin } from 'bun'
import { resolution } from './plugin.ts'

plugin(resolution)

await new Promise((resolve) => setTimeout(resolve))
await import('../../@tailwindcss-cli/src/index.ts')

type TailwindConfig = any

/**
 * Defines the Tailwind CSS configuration.
 * 
 * @example
 * ```ts
 * import { defineConfig } from 'tailwindcss'
 * 
 * export default defineConfig({
 *   content: ['src/*.vue'],
 *   theme: {
 *     // ...
 *   }
 * })
 * ```
 */
export function defineConfig(options?: TailwindConfig): TailwindConfig

/**
 * Tailwind CSS as a PostCSS plugin.
 */
export const tailwindcss: Plugin

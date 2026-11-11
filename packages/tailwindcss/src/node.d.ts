declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'

    /**
     * Build-time switches
     *
     * These are replaced with a constant when Tailwind CSS is bundled (see
     * `tsup.config.ts`), which lets the bundler remove the code for a feature
     * that is turned off. Everything is turned on unless a switch is set to
     * `'false'`. `@tailwindcss/browser` turns these off to ship less code.
     *
     * For the bundler to be able to remove the code:
     *
     * - Use `process.env.TAILWIND_… !== 'false'` directly where it is needed.
     *   Don't store the result in a variable or export it from a module.
     * - Wrap the code in an `if` or a ternary instead of returning early.
     */

    /**
     * Class and variant suggestions, and canonicalization. Without this
     * `getClassList()` and `getVariants()` return nothing, and
     * `canonicalizeCandidates()` returns the candidates as-is.
     */
    TAILWIND_INTELLISENSE?: 'true' | 'false'

    /**
     * `@plugin`, `@config`, and the JS theme they rely on. Without this both
     * at-rules throw, and the legacy `theme(colors.red.500)` syntax can only
     * resolve values that exist as theme variables (`--color-red-500`), not
     * values that only exist in the default JS theme (`theme(spacing.4)`).
     */
    TAILWIND_JS_PLUGINS?: 'true' | 'false'
  }
}

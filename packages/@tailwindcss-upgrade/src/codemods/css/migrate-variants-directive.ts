import { type Plugin, type Root } from 'postcss'

export function migrateVariantsDirective(): Plugin {
  function migrate(root: Root) {
    root.walkAtRules('variants', (node) => {
      // Migrate `@variants` to `@utility` because `@variants` make the classes
      // an actual utility.
      // ```css
      // @variants hover {
      //   .foo {}
      // }
      // ```
      //
      // Means that you can do this in your HTML:
      // ```html
      // <div class="focus:foo"></div>
      // ```
      //
      // Notice the `focus:`, even though we _only_ configured the `hover`
      // variant.
      //
      // This means that we can convert it to an `@layer utilities` rule. Later,
      // this will get converted to an `@utility` rule.
      if (node.name === 'variants') {
        node.name = 'layer'
        node.params = 'utilities'
      }
    })
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-variants-directive',
    OnceExit: migrate,
  }
}

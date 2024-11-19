import dedent from 'dedent'
import postcss, { type Plugin, type Root } from 'postcss'

const css = dedent

const FORMS_RESET_CSS = css`
  /*
    In Tailwind CSS v4, form elements have basic styling applied to them. For
    compatibility with v3, we've applied the following resets:
  */
  @layer base {
    input,
    textarea,
    select,
    button {
      border: 0px solid;
      border-radius: 0;
      padding: 0;
      background-color: transparent;
    }
  }
`

export function migrateFormsReset(): Plugin {
  function migrate(root: Root) {
    let isTailwindRoot = false
    root.walkAtRules('import', (node) => {
      if (
        /['"]tailwindcss['"]/.test(node.params) ||
        /['"]tailwindcss\/preflight['"]/.test(node.params)
      ) {
        isTailwindRoot = true
        return false
      }
    })

    if (!isTailwindRoot) return

    let compatibilityCssString = `\n@tw-bucket compatibility {\n${FORMS_RESET_CSS}\n}\n`
    let compatibilityCss = postcss.parse(compatibilityCssString)

    root.append(compatibilityCss)
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-forms-reset',
    OnceExit: migrate,
  }
}

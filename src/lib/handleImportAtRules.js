import postcss from 'postcss'
import postcssImport from 'postcss-import'

const TAILWIND = Symbol()

export function handleImportAtRules() {
  let RESTORE_ATRULE_COMMENT = '__TAILWIND_RESTORE__'
  let atRulesToRestore = ['tailwind', 'config']

  return [
    (root) => {
      root.walkAtRules((rule) => {
        if (!atRulesToRestore.includes(rule.name)) return rule

        rule.after(
          postcss.comment({
            text: RESTORE_ATRULE_COMMENT,
            raws: { [TAILWIND]: { rule } },
          })
        )
        rule.remove()
      })
    },
    postcssImport(),
    (root) => {
      root.walkComments((rule) => {
        if (rule.text === RESTORE_ATRULE_COMMENT) {
          rule.after(rule.raws[TAILWIND].rule)
          rule.remove()
        }
      })
    },
  ]
}

export default function collapseDuplicateDeclarations() {
  return (root) => {
    root.walkRules((node) => {
      let seen = new Map()
      let droppable = new Set([])

      node.walkDecls((decl) => {
        // This could happen if we have nested selectors. In that case the
        // parent will loop over all its declarations but also the declarations
        // of nested rules. With this we ensure that we are shallowly checking
        // declarations.
        if (decl.parent !== node) {
          return
        }

        if (seen.has(decl.prop)) {
          droppable.add(seen.get(decl.prop))
        }

        seen.set(decl.prop, decl)
      })

      for (let decl of droppable) {
        decl.remove()
      }
    })
  }
}

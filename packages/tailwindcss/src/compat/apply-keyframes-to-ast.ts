import { rule, type AstNode } from '../ast'
import type { ResolvedConfig } from './config/types'
import { objectToAst } from './plugin-api'

export function applyKeyframesToAst(ast: AstNode[], { theme }: ResolvedConfig) {
  if ('keyframes' in theme) {
    for (let [name, keyframe] of Object.entries(theme.keyframes)) {
      ast.push(rule(`@keyframes ${name}`, objectToAst(keyframe as any)))
    }
  }
}

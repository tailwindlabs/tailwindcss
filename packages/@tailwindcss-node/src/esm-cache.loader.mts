import {
  isBuiltin,
  type ResolveFnOutput,
  type ResolveHook,
  type ResolveHookContext,
  type ResolveHookSync,
} from 'node:module'

export let resolve: ResolveHook = async (specifier, context, nextResolve) => {
  let result = await nextResolve(specifier, context)
  return processResolve(context, result)
}

export let resolveSync: ResolveHookSync = (specifier, context, nextResolve) => {
  let result = nextResolve(specifier, context)
  return processResolve(context, result)
}

function processResolve(context: ResolveHookContext, result: ResolveFnOutput) {
  if (result.url === import.meta.url) return result
  if (isBuiltin(result.url)) return result
  if (!context.parentURL) return result

  let parent = new URL(context.parentURL)

  let id = parent.searchParams.get('id')
  if (id === null) return result

  let url = new URL(result.url)
  url.searchParams.set('id', id)

  return {
    ...result,
    url: `${url}`,
  }
}

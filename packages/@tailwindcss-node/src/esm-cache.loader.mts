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

function processResolve(context: ResolveHookContext, resolve: ResolveFnOutput) {
  if (resolve.url === import.meta.url) return resolve
  if (isBuiltin(resolve.url)) return resolve
  if (!context.parentURL) return resolve

  let parent = new URL(context.parentURL)

  let id = parent.searchParams.get('id')
  if (id === null) return resolve

  let url = new URL(resolve.url)
  url.searchParams.set('id', id)

  return {
    ...resolve,
    url: `${url}`,
  }
}

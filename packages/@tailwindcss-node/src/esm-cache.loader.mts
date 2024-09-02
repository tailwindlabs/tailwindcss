import { isBuiltin, type ResolveHook } from 'node:module'

export let resolve: ResolveHook = async (specifier, context, nextResolve) => {
  let result = await nextResolve(specifier, context)

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

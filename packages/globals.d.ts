// Globals that the standalone CLI sets to hook into module resolution and loading
declare var __tw_version: string | undefined
declare var __tw_resolve: undefined | ((id: string, base?: string) => string | false)
declare var __tw_readFile:
  undefined | ((path: string, encoding: BufferEncoding) => Promise<string | undefined>)
declare var __tw_load: undefined | ((path: string) => Promise<object | undefined>)

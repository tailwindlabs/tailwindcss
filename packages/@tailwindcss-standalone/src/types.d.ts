declare module '*.css' {
  const content: string
  export default content
}

declare var __tw_version: string | undefined
declare var __tw_resolve: undefined | ((id: string, baseDir?: string) => string)

import * as binding from './index.js'

export * from './index.js'

/** The memfs `fs` the browser build scans, with a Node.js `fs`-like API. */
export declare const __fs: Record<string, any>

/** The memfs volume backing `__fs`. */
export declare const __volume: Record<string, any>

declare const _default: typeof binding
export default _default

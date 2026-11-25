# `@tailwindcss/oxide-wasm32-wasi`

The WebAssembly build of `@tailwindcss/oxide`.

- **Node.js** loads the threaded `wasm32-wasip1-threads` build.
- **Browsers** load `browser.mjs`, a single-threaded `wasm32-wasip1` build that needs no `SharedArrayBuffer`, workers, or COOP/COEP headers.

## Browser usage

The browser build scans an in-memory filesystem, not the user's disk. Its entry also exports `__fs` and `__volume`, the [memfs](https://github.com/streamich/memfs) filesystem and volume.

```js
import { Scanner, __fs } from '@tailwindcss/oxide-wasm32-wasi/browser.mjs'

// Scan content directly
let scanner = new Scanner({})
scanner.scanFiles([{ content: '<div class="flex">', extension: 'html' }]) // ['class', 'flex']

// Or write files to memfs and scan them
__fs.mkdirSync('/src', { recursive: true })
__fs.writeFileSync('/src/index.html', '<div class="grid">')

let fsScanner = new Scanner({ sources: [{ base: '/src', pattern: '**/*', negated: false }] })
fsScanner.scan() // ['class', 'grid']
```

The bundler must support ESM, top-level `await`, and `new URL('…', import.meta.url)` asset references. With bundlers that don't (such as esbuild), copy `tailwindcss-oxide.browser.wasm` next to the bundled JavaScript.

Scanning is synchronous. For larger inputs, run it in a module worker to keep the UI responsive.

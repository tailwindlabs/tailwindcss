import * as tailwindcss from 'tailwindcss'
import * as assets from './assets'
import { Instrumentation } from './instrumentation'

// Warn users about using the browser build in production as early as possible.
// It can take time for the script to do its work so this must be at the top.
console.warn(
  'The browser build of Tailwind CSS should not be used in production. To use Tailwind CSS in production, use the Tailwind CLI, Vite plugin, or PostCSS plugin: https://tailwindcss.com/docs/installation',
)

/**
 * The type used by `<style>` tags that contain input CSS.
 */
const STYLE_TYPE = 'text/tailwindcss'

/**
 * The current Tailwind CSS compiler.
 *
 * This gets recreated:
 * - When stylesheets change
 */
let compiler: Awaited<ReturnType<typeof tailwindcss.compile>>

/**
 * The list of all seen classes on the page so far. The compiler already has a
 * cache of classes but this lets us only pass new classes to `build(…)`.
 */
let classes = new Set<string>()

/**
 * The last input CSS that was compiled. If stylesheets "change" without
 * actually changing, we can avoid a full rebuild.
 */
let lastCss = ''

/**
 * The stylesheet that we use to inject the compiled CSS into the page.
 */
let sheet = document.createElement('style')

/**
 * The queue of build tasks that need to be run. This is used to ensure that we
 * don't run multiple builds concurrently.
 */
let buildQueue = Promise.resolve()

/**
 * What build this is
 */
let nextBuildId = 1

/**
 * Used for instrumenting the build process. This data shows up in the
 * performance tab of the browser's devtools.
 */
let I = new Instrumentation()

/**
 * Create the Tailwind CSS compiler
 *
 * This handles loading imports, plugins, configs, etc…
 *
 * This does **not** imply that the CSS is actually built. That happens in the
 * `build` function and is a separate scheduled task.
 */
async function createCompiler() {
  I.start(`Create compiler`)
  I.start('Reading Stylesheets')

  // The stylesheets may have changed causing a full rebuild so we'll need to
  // gather the latest list of stylesheets.
  let stylesheets: Iterable<HTMLStyleElement> = document.querySelectorAll(
    `style[type="${STYLE_TYPE}"]`,
  )

  let css = ''
  for (let sheet of stylesheets) {
    observeSheet(sheet)
    css += sheet.textContent + '\n'
  }

  // The user might have no stylesheets, or a some stylesheets without `@import`
  // because they want to customize their theme so we'll inject the main import
  // for them. However, if they start using `@import` we'll let them control
  // the build completely.
  if (!css.includes('@import')) {
    css = `@import "tailwindcss";${css}`
  }

  I.end('Reading Stylesheets', {
    size: css.length,
    changed: lastCss !== css,
  })

  // The input CSS did not change so the compiler does not need to be recreated
  if (lastCss === css) return

  lastCss = css

  I.start('Compile CSS')
  try {
    compiler = await tailwindcss.compile(css, {
      base: '/',
      loadStylesheet,
      loadModule,
    })
  } finally {
    I.end('Compile CSS')
    I.end(`Create compiler`)
  }

  classes.clear()
}

async function loadStylesheet(id: string, base: string) {
  function load() {
    if (id === 'tailwindcss') {
      return {
        base,
        content: assets.css.index,
      }
    } else if (
      id === 'tailwindcss/preflight' ||
      id === 'tailwindcss/preflight.css' ||
      id === './preflight.css'
    ) {
      return {
        base,
        content: assets.css.preflight,
      }
    } else if (
      id === 'tailwindcss/theme' ||
      id === 'tailwindcss/theme.css' ||
      id === './theme.css'
    ) {
      return {
        base,
        content: assets.css.theme,
      }
    } else if (
      id === 'tailwindcss/utilities' ||
      id === 'tailwindcss/utilities.css' ||
      id === './utilities.css'
    ) {
      return {
        base,
        content: assets.css.utilities,
      }
    }

    throw new Error(`The browser build does not support @import for "${id}"`)
  }

  try {
    let sheet = load()

    I.hit(`Loaded stylesheet`, {
      id,
      base,
      size: sheet.content.length,
    })

    return sheet
  } catch (err) {
    I.hit(`Failed to load stylesheet`, {
      id,
      base,
      error: (err as Error).message ?? err,
    })

    throw err
  }
}

async function loadModule(): Promise<never> {
  throw new Error(`The browser build does not support plugins or config files.`)
}

async function build(kind: 'full' | 'incremental') {
  if (!compiler) return

  // 1. Refresh the known list of classes
  let newClasses = new Set<string>()

  I.start(`Collect classes`)

  for (let element of document.querySelectorAll('[class]')) {
    for (let c of element.classList) {
      if (classes.has(c)) continue

      classes.add(c)
      newClasses.add(c)
    }
  }

  I.end(`Collect classes`, {
    count: newClasses.size,
  })

  if (newClasses.size === 0 && kind === 'incremental') return

  // 2. Compile the CSS
  I.start(`Build utilities`)

  sheet.textContent = compiler.build(Array.from(newClasses))

  I.end(`Build utilities`)
}

function rebuild(kind: 'full' | 'incremental') {
  async function run() {
    if (!compiler && kind !== 'full') {
      return
    }

    let buildId = nextBuildId++

    I.start(`Build #${buildId} (${kind})`)

    if (kind === 'full') {
      await createCompiler()
    }

    I.start(`Build`)
    await build(kind)
    I.end(`Build`)

    I.end(`Build #${buildId} (${kind})`)
  }

  buildQueue = buildQueue.then(run).catch((err) => I.error(err))
}

// Handle changes to known stylesheets
let styleObserver = new MutationObserver(() => rebuild('full'))

function observeSheet(sheet: HTMLStyleElement) {
  styleObserver.observe(sheet, {
    attributes: true,
    attributeFilter: ['type'],
    characterData: true,
    subtree: true,
    childList: true,
  })
}

// Handle changes to the document that could affect the styles
// - Changes to any element's class attribute
// - New stylesheets being added to the page
// - New elements (with classes) being added to the page
new MutationObserver((records) => {
  let full = 0
  let incremental = 0

  for (let record of records) {
    // New stylesheets == tracking + full rebuild
    for (let node of record.addedNodes as Iterable<HTMLElement>) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue
      if (node.tagName !== 'STYLE') continue
      if (node.getAttribute('type') !== STYLE_TYPE) continue

      observeSheet(node as HTMLStyleElement)
      full++
    }

    // New nodes require an incremental rebuild
    for (let node of record.addedNodes) {
      if (node.nodeType !== 1) continue

      // Skip the output stylesheet itself to prevent loops
      if (node === sheet) continue

      incremental++
    }

    // Changes to class attributes require an incremental rebuild
    if (record.type === 'attributes') {
      incremental++
    }
  }

  if (full > 0) {
    return rebuild('full')
  } else if (incremental > 0) {
    return rebuild('incremental')
  }
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
  childList: true,
  subtree: true,
})

rebuild('full')

document.head.append(sheet)

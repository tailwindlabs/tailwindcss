import * as tailwindcss from 'tailwindcss'
import * as assets from './assets'
import { Instrumentation } from './instrumentation'

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
 * The CSS that is currently in the stylesheet. Replacing it makes the browser
 * parse all of the CSS and restyle the page again, so we only do that when the
 * CSS actually changed.
 */
let currentCss = ''

/**
 * The parts of the document that changed since the last build. This lets an
 * incremental build look at just these elements instead of the whole document.
 */
type Changes = {
  /**
   * Elements that were added to the document. Everything inside of these
   * elements is new as well.
   */
  added: Set<Element>

  /**
   * Elements with a `class` attribute that changed.
   */
  changed: Set<Element>
}

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
        path: 'virtual:tailwindcss/index.css',
        base,
        content: assets.css.index,
      }
    } else if (
      id === 'tailwindcss/preflight' ||
      id === 'tailwindcss/preflight.css' ||
      id === './preflight.css'
    ) {
      return {
        path: 'virtual:tailwindcss/preflight.css',
        base,
        content: assets.css.preflight,
      }
    } else if (
      id === 'tailwindcss/theme' ||
      id === 'tailwindcss/theme.css' ||
      id === './theme.css'
    ) {
      return {
        path: 'virtual:tailwindcss/theme.css',
        base,
        content: assets.css.theme,
      }
    } else if (
      id === 'tailwindcss/utilities' ||
      id === 'tailwindcss/utilities.css' ||
      id === './utilities.css'
    ) {
      return {
        path: 'virtual:tailwindcss/utilities.css',
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

/**
 * Collect the classes that we haven't seen before.
 *
 * A full build looks at every element in the document. An incremental build
 * only looks at the elements that changed.
 */
function collectNewClasses(changes: Changes | null) {
  let newClasses = new Set<string>()

  function collect(element: Element) {
    for (let c of element.classList) {
      if (classes.has(c)) continue

      classes.add(c)
      newClasses.add(c)
    }
  }

  if (changes === null) {
    for (let element of document.querySelectorAll('[class]')) {
      collect(element)
    }

    return newClasses
  }

  for (let element of changes.changed) {
    if (!element.isConnected) continue

    collect(element)
  }

  for (let element of changes.added) {
    // The element was removed again before we got to it
    if (!element.isConnected) continue

    // The element is inside of another element that was added, so it is
    // handled when we get to that element. Without this check an element is
    // visited once for every ancestor that was added in the same batch, which
    // is what happens to every element while the page is still loading.
    if (isInside(element, changes.added)) continue

    collect(element)

    for (let child of element.querySelectorAll('[class]')) {
      collect(child)
    }
  }

  return newClasses
}

function isInside(element: Element, ancestors: Set<Element>) {
  for (let parent = element.parentElement; parent !== null; parent = parent.parentElement) {
    if (ancestors.has(parent)) return true
  }

  return false
}

async function build(kind: 'full' | 'incremental', changes: Changes | null) {
  if (!compiler) return

  // 1. Refresh the known list of classes
  I.start(`Collect classes`)

  let newClasses = collectNewClasses(kind === 'full' ? null : changes)

  I.end(`Collect classes`, {
    count: newClasses.size,
  })

  if (newClasses.size === 0 && kind === 'incremental') return

  // 2. Compile the CSS
  I.start(`Build utilities`)

  let css = compiler.build(Array.from(newClasses))

  // New classes that are not utilities result in the exact same CSS
  if (css !== currentCss) {
    sheet.textContent = css
    currentCss = css
  }

  I.end(`Build utilities`)
}

function rebuild(kind: 'full'): void
function rebuild(kind: 'incremental', changes: Changes): void
function rebuild(kind: 'full' | 'incremental', changes: Changes | null = null) {
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
    await build(kind, changes)
    I.end(`Build`)

    I.end(`Build #${buildId} (${kind})`)
  }

  let result = buildQueue.then(run)

  // A failed build must not prevent future builds from running. For example
  // when a stylesheet is invalid while it is being edited, it should build
  // again once it is fixed.
  buildQueue = result.catch(() => {})

  result.catch((err) => I.error(err))
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
  let changes: Changes = { added: new Set(), changed: new Set() }

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

      changes.added.add(node as Element)
    }

    // Changes to class attributes require an incremental rebuild
    if (record.type === 'attributes') {
      changes.changed.add(record.target as Element)
    }
  }

  if (full > 0) {
    return rebuild('full')
  } else if (changes.added.size > 0 || changes.changed.size > 0) {
    return rebuild('incremental', changes)
  }
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
  childList: true,
  subtree: true,
})

rebuild('full')

document.head.append(sheet)

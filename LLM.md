# TailwindCSS v4 API Reference

> **Version**: 4.0.0-alpha.x  
> **Repository**: https://github.com/tailwindlabs/tailwindcss  
> **License**: MIT  
> **Description**: A utility-first CSS framework for rapidly building custom user interfaces

## Table of Contents

1. [Core API](#core-api)
2. [Integration Packages](#integration-packages)
3. [Utility Packages](#utility-packages)
4. [Internal APIs](#internal-apis)
5. [Usage Examples](#usage-examples)

---

## Core API

### Main Package: `tailwindcss`

#### Primary Functions

```typescript
// Main compilation function
import { compile } from 'tailwindcss'

const result = await compile(css: string, opts?: CompileOptions)
// Returns: Promise<{ sources, root, features, build(candidates: string[]): string }>

// AST compilation
import { compileAst } from 'tailwindcss'

const result = await compileAst(input: AstNode[], opts?: CompileOptions)
// Returns: Promise<{ sources, root, features, build(candidates: string[]): AstNode[] }>

// Design system loader (unstable)
import { __unstable__loadDesignSystem } from 'tailwindcss'

const designSystem = await __unstable__loadDesignSystem(css: string, opts?: CompileOptions)
// Returns: Promise<DesignSystem>
```

#### Configuration Types

```typescript
import type { Config, CompileOptions } from 'tailwindcss'
import { Features, Polyfills } from 'tailwindcss'

interface CompileOptions {
  base?: string                    // Base directory for imports
  from?: string                   // Source file path
  polyfills?: Polyfills          // Polyfill settings
  loadModule?: (id: string, from: string) => Promise<any>
  loadStylesheet?: (id: string, from: string) => Promise<{ content: string, base: string }>
}

enum Polyfills {
  None = 0,
  AtProperty = 1 << 0
}

enum Features {
  None = 0,
  Apply = 1 << 0,
  ThemeFunction = 1 << 1
}
```

#### Design System

```typescript
import { buildDesignSystem } from 'tailwindcss/src/design-system'
import type { DesignSystem } from 'tailwindcss/src/design-system'

// Core design system methods
interface DesignSystem {
  theme: Theme
  utilities: Utilities
  variants: Variants
  invalidCandidates: Set<string>
  important: boolean
  
  // Key methods
  getClassOrder(classes: string[]): [string, bigint | null][]
  getClassList(): ClassEntry[]
  getVariants(): VariantEntry[]
  parseCandidate(candidate: string): Readonly<Candidate>[]
  parseVariant(variant: string): Readonly<Variant> | null
  compileAstNodes(candidate: Candidate, flags?: CompileAstFlags): AstNode[]
}
```

#### Theme System

```typescript
import { Theme, ThemeOptions } from 'tailwindcss/src/theme'
import type { ThemeKey } from 'tailwindcss/src/theme'

class Theme {
  constructor(values?, keyframes?)
  
  add(key: string, value: string, options?: ThemeOptions, src?: Declaration['src']): void
  get(key: string, options?: ThemeOptions): string | undefined
  resolve(key: string, options?: ThemeOptions): string | undefined
  keysInNamespaces(themeKeys: Iterable<ThemeKey>): string[]
}

enum ThemeOptions {
  NONE = 0,
  INLINE = 1 << 0,
  REFERENCE = 1 << 1,
  DEFAULT = 1 << 2
}

type ThemeKey = `--${string}`
```

#### Plugin System

```typescript
import createPlugin from 'tailwindcss/plugin'
import type { PluginAPI, PluginFn } from 'tailwindcss/plugin'

// Basic plugin
const myPlugin = createPlugin(function({ addUtilities, theme }: PluginAPI) {
  addUtilities({
    '.my-utility': {
      color: theme('colors.blue.500')
    }
  })
})

// Plugin with options
const myPluginWithOptions = createPlugin.withOptions<MyOptions>(
  (options = {}) => ({ addUtilities, theme }) => {
    // Plugin logic
  },
  (options = {}) => ({
    // Config
  })
)

interface PluginAPI {
  addUtilities: (utilities: Record<string, any>) => void
  addComponents: (components: Record<string, any>) => void
  addBase: (base: Record<string, any>) => void
  addVariant: (name: string, definition: string | (() => string)) => void
  theme: (path: string) => any
  config: (path: string) => any
}
```


---

## Integration Packages

### PostCSS Plugin: `@tailwindcss/postcss`

```typescript
import tailwindcss from '@tailwindcss/postcss'

// PostCSS configuration
module.exports = {
  plugins: [
    tailwindcss({
      base?: string,           // Base directory to scan for candidates
      optimize?: boolean | {   // Optimization settings
        minify?: boolean
      }
    })
  ]
}
```

### Vite Plugin: `@tailwindcss/vite`

```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()]  // Returns Plugin[] array
})

// Plugin array structure:
// 1. @tailwindcss/vite:scan (enforce: 'pre')
// 2. @tailwindcss/vite:generate:serve (apply: 'serve', enforce: 'pre')
// 3. @tailwindcss/vite:generate:build (apply: 'build')
```

### Node.js API: `@tailwindcss/node`

```typescript
import { compile, compileAst, optimize, Instrumentation } from '@tailwindcss/node'
import type { CompileOptions, OptimizeOptions, Resolver } from '@tailwindcss/node'

// Compilation
const compiler = await compile(css: string, options: CompileOptions)
const astCompiler = await compileAst(ast: AstNode[], options: CompileOptions)

interface CompileOptions {
  base: string
  from?: string
  onDependency: (path: string) => void
  shouldRewriteUrls?: boolean
  polyfills?: Polyfills
  customCssResolver?: Resolver
  customJsResolver?: Resolver
}

// Optimization
const result = optimize(input: string, options?: OptimizeOptions)

interface OptimizeOptions {
  file?: string
  minify?: boolean
  map?: string
}

// Instrumentation
using instrumentation = new Instrumentation()
instrumentation.start('build')
instrumentation.end('build')
```

### CLI Tool: `@tailwindcss/cli`

```bash
# Basic usage
tailwindcss --input input.css --output output.css

# Watch mode
tailwindcss -i input.css -o output.css --watch

# Minified output
tailwindcss -i input.css -o output.css --minify

# With source maps
tailwindcss -i input.css -o output.css --map

# Using stdin/stdout
cat input.css | tailwindcss > output.css
```

---

## Utility Packages

### Migration Tool: `@tailwindcss/upgrade`

```bash
# CLI usage
npx @tailwindcss/upgrade --config tailwind.config.js --force

# Available options:
# --config (-c): Path to configuration file
# --help (-h): Display usage information
# --force (-f): Force the migration
# --version (-v): Display version number
```

**Migration Functions:**
- CSS: `migrateAtApply()`, `migrateTailwindDirectives()`, `migrateThemeToVar()`
- Templates: `migrateArbitraryUtilities()`, `migrateBgGradient()`, `migrateLegacyClasses()`
- Config: `migrateJsConfig()`, `migratePostCSSConfig()`

### Browser Utilities: `@tailwindcss/browser`

```html
<!-- Include in browser -->
<script src="@tailwindcss/browser"></script>
<style type="text/tailwindcss">
  @import "tailwindcss";
</style>
```

```typescript
// Browser API
interface BrowserAPI {
  createCompiler(): Compiler
  build(kind: 'full' | 'incremental'): void
  rebuild(kind: 'full' | 'incremental'): void
  css: {
    index: string      // Main CSS
    preflight: string  // Preflight styles
    theme: string      // Theme styles
    utilities: string  // Utility styles
  }
}
```

### Standalone Build: `@tailwindcss/standalone`

```bash
# Standalone binary usage (same as CLI)
tailwindcss --input input.css --output output.css
```

**Bundled Dependencies:**
- `@tailwindcss/forms`
- `@tailwindcss/typography`
- `@tailwindcss/aspect-ratio`
- Cross-platform binary support


---

## Internal APIs

### AST (Abstract Syntax Tree)

```typescript
import { styleRule, atRule, decl, comment, walk, toCss } from 'tailwindcss/src/ast'
import type { AstNode, StyleRule, AtRule, Declaration } from 'tailwindcss/src/ast'

// AST Node Types
type StyleRule = {
  kind: 'rule'
  selector: string
  nodes: AstNode[]
  src?: SourceLocation
}

type AtRule = {
  kind: 'at-rule'
  name: string
  params: string
  nodes: AstNode[]
}

type Declaration = {
  kind: 'declaration'
  property: string
  value: string | undefined
  important: boolean
}

// Factory functions
const rule = styleRule('.example', [decl('color', 'red')])
const media = atRule('media', '(min-width: 768px)', [rule])

// Tree walking
walk(ast, (node, { replaceWith, remove }) => {
  if (node.kind === 'declaration' && node.property === 'color') {
    replaceWith(decl('color', 'blue'))
  }
})

// Convert to CSS
const css = toCss(ast)
```

### Candidate Parsing

```typescript
import { parseCandidate, parseVariant } from 'tailwindcss/src/candidate'
import type { Candidate, Variant, ArbitraryUtilityValue } from 'tailwindcss/src/candidate'

// Candidate structure
type Candidate = {
  kind: 'arbitrary' | 'static' | 'functional'
  variants: Variant[]
  root: string
  value?: ArbitraryUtilityValue | NamedUtilityValue
  modifier?: CandidateModifier
  negative: boolean
  important: boolean
}

// Parse candidates
const candidates = [...parseCandidate('hover:bg-red-500/50', designSystem)]
const variant = parseVariant('hover', designSystem)
```

### CSS Parser

```typescript
import { parse } from 'tailwindcss/src/css-parser'

const ast = parse(cssString, { from: 'input.css' })
```

### Value Parser

```typescript
import { parse, walk, toCss } from 'tailwindcss/src/value-parser'
import type { ValueAstNode } from 'tailwindcss/src/value-parser'

const valueAst = parse('calc(100% - 2rem)')
walk(valueAst, (node) => {
  if (node.kind === 'function' && node.value === 'calc') {
    // Process calc function
  }
})
```

### Variants System

```typescript
import { Variants, createVariants } from 'tailwindcss/src/variants'

class Variants {
  static(name: string, applyFn: VariantFn<'static'>): void
  functional(name: string, applyFn: VariantFn<'functional'>): void
  compound(name: string, applyFn: VariantFn<'compound'>): void
}

const variants = createVariants(theme)
```

### Utilities System

```typescript
import { Utilities, createUtilities } from 'tailwindcss/src/utilities'
import { withAlpha, asColor } from 'tailwindcss/src/utilities'

class Utilities {
  static(name: string, compileFn: CompileFn<'static'>): void
  functional(name: string, compileFn: CompileFn<'functional'>): void
  suggest(name: string, suggestions: () => SuggestionGroup[]): void
}

// Color utilities
const colorWithAlpha = withAlpha('rgb(255 0 0)', '0.5')
const processedColor = asColor('red-500', modifier, theme)
```

### Compilation Functions

```typescript
import { compileCandidates, compileAstNodes } from 'tailwindcss/src/compile'

const result = compileCandidates(['bg-red-500', 'text-white'], designSystem)
// Returns: { astNodes: AstNode[], nodeSorting: Map<AstNode, bigint> }

const nodes = compileAstNodes(candidate, designSystem, CompileAstFlags.None)
```


---

## Usage Examples

### Basic Compilation Workflow

```typescript
import { compile } from 'tailwindcss'

// 1. Compile CSS with Tailwind directives
const result = await compile(`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  .custom {
    @apply bg-blue-500 text-white p-4;
  }
`)

// 2. Build final CSS with specific candidates
const finalCSS = result.build([
  'bg-red-500',
  'text-white',
  'p-4',
  'hover:bg-red-600',
  'md:text-lg'
])

console.log(finalCSS)
```

### Plugin Development

```typescript
import plugin from 'tailwindcss/plugin'

// Simple utility plugin
const buttonPlugin = plugin(function({ addUtilities, theme }) {
  addUtilities({
    '.btn': {
      padding: theme('spacing.2') + ' ' + theme('spacing.4'),
      borderRadius: theme('borderRadius.md'),
      fontWeight: theme('fontWeight.medium'),
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    },
    '.btn-primary': {
      backgroundColor: theme('colors.blue.500'),
      color: theme('colors.white'),
      '&:hover': {
        backgroundColor: theme('colors.blue.600')
      }
    }
  })
})

// Plugin with options
const spacingPlugin = plugin.withOptions<{ multiplier?: number }>(
  (options = {}) => ({ addUtilities, theme }) => {
    const { multiplier = 1 } = options
    
    addUtilities({
      '.space-custom': {
        margin: `${multiplier * 16}px`
      }
    })
  },
  (options = {}) => ({
    theme: {
      extend: {
        spacing: {
          custom: `${(options.multiplier || 1) * 16}px`
        }
      }
    }
  })
)
```

### PostCSS Integration

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({
      base: './src',
      optimize: {
        minify: process.env.NODE_ENV === 'production'
      }
    }),
    require('autoprefixer')
  ]
}
```

### Vite Integration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  css: {
    devSourcemap: true
  }
})
```

### Node.js Build Script

```typescript
import { compile } from '@tailwindcss/node'
import { readFile, writeFile } from 'fs/promises'

async function buildCSS() {
  const css = await readFile('src/input.css', 'utf8')
  
  const compiler = await compile(css, {
    base: process.cwd(),
    onDependency: (path) => {
      console.log('Dependency:', path)
    }
  })
  
  // Scan for candidates (in real app, scan your templates)
  const candidates = [
    'bg-blue-500',
    'text-white',
    'p-4',
    'hover:bg-blue-600',
    'md:text-lg',
    'lg:text-xl'
  ]
  
  const result = compiler.build(candidates)
  await writeFile('dist/output.css', result)
}

buildCSS().catch(console.error)
```

### Design System Usage

```typescript
import { __unstable__loadDesignSystem } from 'tailwindcss'

const designSystem = await __unstable__loadDesignSystem(`
  @tailwind base;
  @tailwind utilities;
`)

// Parse and compile individual candidates
const candidates = designSystem.parseCandidate('bg-red-500')
const astNodes = designSystem.compileAstNodes(candidates[0])

// Get class ordering for sorting
const classes = ['p-4', 'bg-red-500', 'text-white']
const ordered = designSystem.getClassOrder(classes)

// Get all available utilities
const classList = designSystem.getClassList()
const variants = designSystem.getVariants()
```

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@tailwindcss/browser"></script>
  <style type="text/tailwindcss">
    @import "tailwindcss";
    
    .custom-component {
      @apply bg-blue-500 text-white p-4 rounded-lg;
    }
  </style>
</head>
<body>
  <div class="bg-red-500 text-white p-4">
    Hello World
  </div>
  <div class="custom-component">
    Custom Component
  </div>
</body>
</html>
```

### Migration from v3 to v4

```bash
# Run the upgrade tool
npx @tailwindcss/upgrade --config tailwind.config.js

# This will:
# - Migrate CSS files (@apply, @layer, etc.)
# - Update template files (class names, arbitrary values)
# - Convert configuration files
# - Update PostCSS configuration
```

---

## Key Differences from v3

1. **New Architecture**: Rust-based core with TypeScript bindings
2. **No Configuration Required**: Works out of the box
3. **CSS-First**: Configuration through CSS custom properties
4. **Improved Performance**: Faster compilation and smaller bundle sizes
5. **Better DX**: Enhanced error messages and debugging
6. **Modern CSS**: Uses CSS custom properties and modern features
7. **Simplified API**: Cleaner, more consistent API surface

---

## Import Paths Summary

```typescript
// Core package
import { compile, compileAst } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

// Integration packages
import postcss from '@tailwindcss/postcss'
import vite from '@tailwindcss/vite'
import { compile, optimize } from '@tailwindcss/node'

// Internal APIs (use with caution)
import { parse } from 'tailwindcss/src/css-parser'
import { parseCandidate } from 'tailwindcss/src/candidate'
import { Theme } from 'tailwindcss/src/theme'
import { buildDesignSystem } from 'tailwindcss/src/design-system'
```

---

*This documentation covers TailwindCSS v4 alpha. APIs may change before stable release.*

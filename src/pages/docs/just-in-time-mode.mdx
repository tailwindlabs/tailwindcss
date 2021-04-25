---
title: Just-in-Time Mode
shortTitle: Just-in-Time Mode
description: A faster, more powerful, on-demand engine for Tailwind CSS v2.1+.
featureVersion: 'v2.1+'
---
import { Heading } from '@/components/Heading'
import { TipGood, TipBad, TipInfo } from '@/components/Tip'
import { ThemeReference } from '@/components/ThemeReference'

## <Heading hidden>Overview</Heading>

<TipInfo>
  <strong className="font-semibold text-blue-900">This feature is currently in preview.</strong> Preview features are not covered by semantic versioning and some details may change as we continue to refine them.
</TipInfo>

Tailwind CSS v2.1 introduces a new just-in-time compiler for Tailwind CSS that generates your styles on-demand as you author your templates instead of generating everything in advance at initial build time.

<div className="relative pb-[calc(9/16*100%)] my-12">
  <iframe
    className="absolute inset-0 h-full w-full"
    src="https://www.youtube.com/embed/3O_3X7InOw8"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
</div>

This comes with a lot of advantages:

- **Lightning fast build times**. Tailwind can take 3–8s to initially compile using our CLI, and upwards of 30–45s in webpack projects because webpack struggles with large CSS files. This library can compile even the biggest projects in about 800ms _(with incremental rebuilds as fast as 3ms)_, no matter what build tool you're using.
- **Every variant is enabled out of the box**. Variants like `focus-visible`, `active`, `disabled`, and others are not normally enabled by default due to file-size considerations. Since this library generates styles on demand, you can use any variant you want, whenever you want. You can even stack them like `sm:hover:active:disabled:opacity-75`. Never configure your variants again.
- **Generate arbitrary styles without writing custom CSS.** Ever needed some ultra-specific value that wasn't part of your design system, like `top: -113px` for a quirky background image? Since styles are generated on demand, you can just generate a utility for this as needed using square bracket notation like `top-[-113px]`. Works with variants too, like `md:top-[-113px]`.
- **Your CSS is identical in development and production**. Since styles are generated as they are needed, you don't need to purge unused styles for production, which means you see the exact same CSS in all environments. Never worry about accidentally purging an important style in production again.
- **Better browser performance in development**. Since development builds are as small as production builds, the browser doesn't have to parse and manage multiple megabytes of pre-generated CSS. In projects with heavily extended configurations this makes dev tools a lot more responsive.

To see it in action, [watch our announcement video](https://www.youtube.com/watch?v=3O_3X7InOw8).

## Enabling JIT mode

To enable just-in-time mode, set the `mode` option to `'jit'` in your `tailwind.config.js` file:

```diff-js
  // tailwind.config.js
  module.exports = {
+   mode: 'jit',
    purge: [
      // ...
    ],
    theme: {
      // ...
    }
    // ...
  }
```

Since JIT mode generates your CSS on-demand by scanning your template files, it's crucial that you configure the `purge` option in your `tailwind.config.js` file with all of your template paths, otherwise your CSS will be empty:

```diff-js
  // tailwind.config.js
  module.exports = {
    mode: 'jit',
+   // These paths are just examples, customize them to match your project structure
+   purge: [
+     './public/**/*.html',
+     './src/**/*.{js,jsx,ts,tsx,vue}',
+   ],
    theme: {
      // ...
    }
    // ...
  }
```

Now when you start your development server or build runner, Tailwind will generate your styles on-demand instead of generating everything in advance.

## Watch mode and one-off builds

Behind the scenes, the JIT engine uses its own file-watching system to watch your templates for changes as efficiently as possible.

By default, Tailwind will start a long-running watch process if `NODE_ENV=development`, and it will run in one-off mode if `NODE_ENV=production`.

```js
// package.json
{
  // ...
  scripts: {
    // Will start a long-running watch process
    "dev": "NODE_ENV=development postcss tailwind.css -o ./dist/tailwind.css -w"
    // Will perform a one-off build
    "build": "NODE_ENV=production postcss tailwind.css -o ./dist/tailwind.css"
  },
  // ...
}
```

If it appears like your one-off build process is hanging, it's almost certainly because `NODE_ENV=development` in your build script. To fix this, you can either set `NODE_ENV=production`, or explicitly tell Tailwind not to start a watcher by setting `TAILWIND_MODE=build` as part of your script.

```js
// package.json
{
  // ...
  scripts: {
    // Will start a long-running watch process
    "dev": "TAILWIND_MODE=watch NODE_ENV=development postcss tailwind.css -o ./dist/tailwind.css -w"
    // Will perform a one-off development build
    "build:dev": "TAILWIND_MODE=build NODE_ENV=development postcss tailwind.css -o ./dist/tailwind.css"
    // Will perform a one-off production build
    "build:prod": "TAILWIND_MODE=build NODE_ENV=production postcss tailwind.css -o ./dist/tailwind.css"
  },
  // ...
}
```

## New features

### All variants are enabled

Since styles are generated on-demand, there's no need to configure which variants are available for each core plugin.

```html
<input class="disabled:opacity-75">
```

You can use variants like `focus-visible`, `active`, `disabled`, `even`, and more in combination with any utility, without making any changes to your `tailwind.config.js` file.

### Stackable variants

All variants can be combined together to easily target very specific situations without writing custom CSS.

```html
<button class="md:dark:disabled:focus:hover:bg-gray-400">
```

### Arbitrary value support

Many utilities support arbitrary values using a new square bracket notation to indicate that you're "breaking out" of your design system.

```html
<!-- Sizes and positioning -->
<img class="absolute w-[762px] h-[918px] top-[-325px] right-[62px] md:top-[-400px] md:right-[80px]" src="/crazy-background-image.png">

<!-- Colors -->
<button class="bg-[#1da1f1]">Share on Twitter</button>

<!-- Complex grids -->
<div class="grid-cols-[1fr,700px,2fr]">
  <!-- ... -->
</div>
```

This is very useful for building pixel-perfect designs where there are a few elements that need hyper-specific styles, like a carefully positioned background image on a marketing site.

We'll likely add some form of "strict mode" in the future for power-hungry team leads who don't trust their colleagues to use this feature responsibly.

Note that you still need to [write purgeable HTML](https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html) when using arbitrary values, and your classes need to exist as complete strings for Tailwind to detect them correctly.

<TipBad>Don't use string concatenation to create class names</TipBad>

```jsx mt-4
<div className={`mt-[${size === 'lg' ? '22px' : '17px' }]`}></div>
```

<TipGood>Do dynamically select a complete class name</TipGood>

```jsx mt-4
<div className={ size === 'lg' ? 'mt-[22px]' : 'mt-[17px]' }></div>
```

Tailwind doesn't include any sort of client-side runtime, so class names need to be statically extractable at build-time, and can't depend on any sort of arbitrary dynamic values that change on the client. Use inline styles for these situations, or combine Tailwind with a CSS-in-JS library like [Emotion](https://emotion.sh/docs/introduction) if it makes sense for your project.

<TipBad>Arbitrary values cannot be computed from dynamic values</TipBad>

```html mt-4
<div class="bg-[{{ userThemeColor }}]"></div>
```

<TipGood>Use inline styles for truly dynamic or user-defined values</TipGood>

```html mt-4
<div style="background-color: {{ userThemeColor }}"></div>
```

### Built-in important modifier

You can make any utility important by adding a `!` character to the beginning:

```html
<p class="font-bold !font-medium">
  This will be medium even though bold comes later in the CSS.
</p>
```

The `!` always goes at the beginning of the utility name, after any variants, but before any prefix:

```html
<div class="sm:hover:!tw-font-bold">
```

This can be useful in rare situations where you need to increase specificity because you're at war with some styles you don't control.

## Known limitations

This new engine is very close to feature parity with `tailwindcss` currently and for most projects I bet you'll find it works exactly as you'd expect.

There are a few items still on our todo list though that we are actively working on:

- Advanced PurgeCSS options like `safelist` aren't supported yet since we aren't actually using PurgeCSS. We'll add a way to safelist classes for sure though. For now, a `safelist.txt` file somewhere in your project with all the classes you want to safelist will work fine.
- You can only `@apply` classes that are part of core, generated by plugins, or defined within a `@layer` rule. You can't `@apply` arbitrary CSS classes that aren't defined within a `@layer` rule.

We are also ironing out some compatibility issues with certain build tools like Parcel and Snowpack, which you can follow in our [issue tracker](https://github.com/tailwindlabs/tailwindcss/issues).

If you run into any other issues or find any bugs, please [open an issue](https://github.com/tailwindlabs/tailwindcss/issues/new/choose) so we can fix it.

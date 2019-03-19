---
extends: _layouts.documentation
title: "Container"
description: "A component for fixing an element's width to the current breakpoint."
---

<h2 style="visibility: hidden; font-size: 0; margin: 0;">Class reference</h2>
<div class="border-t border-b border-grey-light mb-12">
  <table class="w-full text-left table-collapse">
    <colgroup>
      <col class="w-1/4">
      <col class="w-1/4">
      <col class="w-1/2">
    </colgroup>
    <thead>
      <tr>
        <th class="text-sm font-semibold text-gray-700 p-2 bg-gray-100">Class</th>
        <th class="text-sm font-semibold text-gray-700 p-2 bg-gray-100">Breakpoint</th>
        <th class="text-sm font-semibold text-gray-700 p-2 bg-gray-100">Properties</th>
      </tr>
    </thead>
    <tbody class="align-baseline">
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-purple-dark" rowspan="5">.container</td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-grey-dark"><span class="italic">None</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">width: 100%;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-gray-700">sm <span class="text-grey-dark italic">(640px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 640px;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-gray-700">md <span class="text-grey-dark italic">(768px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 768px;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-gray-700">lg <span class="text-grey-dark italic">(1024px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 1024px;</td>
      </tr>
      <tr>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-gray-700">xl <span class="text-grey-dark italic">(1280px)</span></td>
        <td class="p-2 border-t border-grey-light font-mono text-xs text-blue-dark">max-width: 1280px;</td>
      </tr>
    </tbody>
  </table>
</div>

Tailwind's `.container` class sets the `max-width` of an element to match the `min-width` of the current breakpoint. This is useful if you'd prefer to design for a fixed set of sizes instead of trying to accommodate a fully fluid viewport.

Note that unlike containers you might have used in other frameworks, **Tailwind's container does not center itself automatically and does not have any built-in horizontal padding.**

To center a container, use the `.mx-auto` utility:

```html
<div class="container mx-auto">
  <!-- ... -->
</div>
```

To add horizontal padding, use the `.px-{size}` utilities:

```html
<div class="container mx-auto px-4">
  <!-- ... -->
</div>
```

If you'd like to center your containers by default or include default horizontal padding, see the [customization options](#customizing) below.

## Customizing

### Centering by default

To center containers by default, set the `center` option to `true` in the `theme.container` section of your config file:

```js
// ...

module.exports = {
  // ...

  theme: {
    container: {
      center: true,
    },
  },
}
```

### Horizontal padding

To add horizontal padding by default, specify the amount of padding you'd like using the `padding` option in the `theme.container` section of your config file:

```js
// ...

module.exports = {
  // ...

  theme: {
    container: {
      padding: '2rem',
    }
  },
}
```

### Disabling

If you don't plan to use the `.container` class in your project, you can disable it entirely by setting the `container` property to `false` in the `corePlugins` section of your config file:

@component('_partials.customized-config', ['key' => 'corePlugins'])
  // ...
+ container: false,
@endcomponent

---
extends: _layouts.documentation
title: "Font Size"
description: "Utilities for controlling the font size of an element."
features:
  responsive: true
  customizable: true
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.text-xs',
      'font-size: .75rem;',
    ],
    [
      '.text-sm',
      'font-size: .875rem;',
    ],
    [
      '.text-base',
      'font-size: 1rem;',
    ],
    [
      '.text-lg',
      'font-size: 1.125rem;',
    ],
    [
      '.text-xl',
      'font-size: 1.25rem;',
    ],
    [
      '.text-2xl',
      'font-size: 1.5rem;',
    ],
    [
      '.text-3xl',
      'font-size: 1.875rem;',
    ],
    [
      '.text-4xl',
      'font-size: 2.25rem;',
    ],
    [
      '.text-5xl',
      'font-size: 3rem;',
    ],
    [
      '.text-6xl',
      'font-size: 4rem;',
    ],
  ]
])

## Usage

Control the font size of an element using the `.text-{size}` utilities.

@component('_partials.code-sample')
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-xs</p>
  <p class="text-xs truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-sm</p>
  <p class="text-sm truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-base</p>
  <p class="text-base truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-lg</p>
  <p class="text-lg truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-xl</p>
  <p class="text-xl truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-2xl</p>
  <p class="text-2xl truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-3xl</p>
  <p class="text-3xl truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div class="mb-6">
  <p class="text-sm text-gray-600">.text-4xl</p>
  <p class="text-4xl truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div>
  <p class="text-sm text-gray-600">.text-5xl</p>
  <p class="text-5xl truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
<div>
  <p class="text-sm text-gray-600">.text-6xl</p>
  <p class="text-6xl truncate text-gray-800">The quick brown fox jumped over the lazy dog.</p>
</div>
@slot('code')
<p class="text-xs ...">The quick brown fox ...</p>
<p class="text-sm ...">The quick brown fox ...</p>
<p class="text-base ...">The quick brown fox ...</p>
<p class="text-lg ...">The quick brown fox ...</p>
<p class="text-xl ...">The quick brown fox ...</p>
<p class="text-2xl ...">The quick brown fox ...</p>
<p class="text-3xl ...">The quick brown fox ...</p>
<p class="text-4xl ...">The quick brown fox ...</p>
<p class="text-5xl ...">The quick brown fox ...</p>
<p class="text-6xl ...">The quick brown fox ...</p>
@endslot
@endcomponent

## Responsive

To control the font size of an element at a specific breakpoint, add a `{screen}:` prefix to any existing font size utility. For example, use `md:text-lg` to apply the `text-lg` utility at only medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample', ['class' => 'font-sans'])
@slot('none')
<p class="text-base text-gray-800 truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('sm')
<p class="text-lg text-gray-800 truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('md')
<p class="text-xl text-gray-800 truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('lg')
<p class="text-2xl text-gray-800 truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('xl')
<p class="text-3xl text-gray-800 truncate">The quick brown fox jumped over the lazy dog.</p>
@endslot
@slot('code')
<p class="none:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl ...">The quick brown fox jumped over the lazy dog.</p>
@endslot
@endcomponent

## Customizing

### Font Sizes

By default Tailwind provides 10 `font-size` utilities. You change, add, or remove these by editing the `theme.fontSize` section of your Tailwind config.

@component('_partials.customized-config', ['key' => 'theme.fontSize'])
- 'xs': '.75rem',
- 'sm': '.875rem',
+ 'tiny': '.875rem',
  'base': '1rem',
  'lg': '1.125rem',
  'xl': '1.25rem',
  '2xl': '1.5rem',
- '3xl': '1.875rem',
- '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '4rem',
+ '7xl': '5rem',
@endcomponent

### Providing a default line-height

You can provide a default line-height for each of your font-sizes using a tuple of the form `[fontSize, lineHeight]` in your `tailwind.config.js` file.

```js
// tailwind.config.js
module.exports = {
  theme: {
    fontSize: {
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
    }
  }
}
```

We don't do this out-of-the-box for backwards compatibility reasons, but it can be a very convenient customization to make in your own projects

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'text sizing',
        'property' => 'fontSize',
    ],
    'variants' => [
        'responsive',
    ],
])

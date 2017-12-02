---
extends: _layouts.documentation
title: "Forms"
description: "Utilities for styling form controls."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.work-in-progress')

@include('_partials.class-table', [
  'rows' => [
    [
      '.appearance-none',
      'appearance: none;',
      "Remove any special styling applied to an element by the browser.",
    ],
  ]
])

### Custom Select

Form controls are great candidates for component classes, but just for fun, here's how you can build a fully custom select menu with just utility classes:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="inline-block relative w-64">
  <select class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow">
    <option>Really long option that will likely overlap the chevron</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
  <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-slate">
    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
  </div>
</div>
@endcomponent

## Customizing

### Responsive, Hover, and Focus Variants

By default, only responsive variants are generated for form control appearance utilities.

You can control which variants are generated for form control appearance utilities by modifying the `appearance` property in the `modules` section of your Tailwind config file.

For example, this config will _also_ generate hover and focus variants:

```js
{
    // ...
    modules: {
        // ...
        appearance: ['responsive', 'hover', 'focus'],
    }
}
```

### Disabling

If you aren't using the form control appearance utilities in your project, you can disable them entirely by setting the `appearance` property to `false` in the `modules` section of your config file:

```js
{
    // ...
    modules: {
        // ...
        appearance: false,
    }
}
```

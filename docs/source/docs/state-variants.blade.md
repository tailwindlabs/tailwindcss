---
extends: _layouts.documentation
title: "State Variants"
description: "Using utilities to style elements on hover, focus, and more."
---

Similar to our [responsive prefixes](/docs/responsive-design), Tailwind makes it easy to style elements on hover, focus, and more using *state* prefixes.

## Hover

*By default, **hover variants are only generated for background color, border color, and text color utilities.** You can customize this in the [modules section](/docs/configuration#modules) of your configuration file.*

Add the `hover:` prefix to only apply a utility on hover.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded">
  Hover me
</button>


@slot('code')
<button class="bg-transparent hover:bg-blue text-blue-dark hover:text-white...">
  Hover me
</button>
@endslot
@endcomponent

## Focus

*By default, **focus variants are not generated for any utilities.** You can customize this in the [modules section](/docs/configuration#modules) of your configuration file.*

Add the `focus:` prefix to only apply a utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="bg-white focus:bg-grey-dark text-black focus:text-white appearance-none inline-block w-full text-black border rounded py-3 px-4" placeholder="Focus me">
</div>

@slot('code')
<input class="bg-white focus:bg-grey-dark text-black focus:text-white ..." placeholder="Focus me">
@endslot
@endcomponent


## Group Hover

*By default, **group hover variants are not generated for any utilities.** You can customize this in the [modules section](/docs/configuration#modules) of your configuration file.*

If you need to style a child element when hovering over a specific parent element, add the `.group` class to the parent element and add the `group-hover:` prefix to the utility on the child element.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'bg-grey-lighter p-8'])
<div class="group hover:bg-blue p-4 cursor-pointer bg-white rounded max-w-xs w-full shadow-lg select-none overflow-hidden mx-auto">
  <p class="font-semibold text-lg mb-1 text-black group-hover:text-white">New Project</p>
  <p class="text-grey-darker group-hover:text-white mb-2">Create a new project from a variety of starting templates.</p>
</div>


@slot('code')
<div class="group bg-white hover:bg-blue ...">
  <p class="text-black group-hover:text-white ...">New Project</p>
  <p class="text-grey-darker group-hover:text-white ...">Create a new project from a variety of starting templates.</p>
</div>
@endslot
@endcomponent

## Combining with Responsive Prefixes

State variants are also responsive, meaning you can change an element's hover style for example at different breakpoints.

To apply a state variant responsively, **add the responsive prefix first, before the state prefix.**

```html
<button class="... md:bg-orange md:hover:bg-red ...">Button</button>
```

## State Variants for Custom Utilities

You can generate state variants for your own custom utilities using the `@@variants` directive:

```less
// Input:
@@variants hover, focus {
  .banana {
    color: yellow;
  }
}

// Output:
.banana {
  color: yellow;
}
.focus\:banana:focus {
  color: yellow;
}
.hover\:banana:hover {
  color: yellow;
}

```

For more information, see the [@@variants directive documentation](/docs/functions-and-directives#variants).

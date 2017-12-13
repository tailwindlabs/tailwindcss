---
extends: _layouts.documentation
title: "State Variants"
description: "Using utilities to style elements on hover, focus, and more."
---

Similar to our [responsive prefixes](/docs/responsive-design), Tailwind makes it easy to style elements on hover, focus, and more using *state* prefixes.

## Hover

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

<div class="bg-blue-light text-white font-semibold px-4 py-3 mb-4 -mt-2">
  <div class="flex">
    <div class="py-1">
      <svg class="fill-current h-6 w-6 text-white opacity-75 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
    </div>
    <div>
      <p class="mb-2"><strong>By default, hover variants are only generated for background color, border color, font weight, text color, and text style utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>


## Focus

Add the `focus:` prefix to only apply a utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="bg-white focus:bg-grey-dark text-black focus:text-white appearance-none inline-block w-full text-black border rounded py-3 px-4" placeholder="Focus me">
</div>

@slot('code')
<input class="bg-white focus:bg-grey-dark text-black focus:text-white ..." placeholder="Focus me">
@endslot
@endcomponent

<div class="bg-blue-light text-white font-semibold px-4 py-3 mb-4 -mt-2">
  <div class="flex">
    <div class="py-1">
      <svg class="fill-current h-6 w-6 text-white opacity-75 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
    </div>
    <div>
      <p class="mb-2"><strong>By default, focus variants are not generated for any utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>


## Group Hover

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

<div class="bg-blue-light text-white font-semibold px-4 py-3 mb-4 -mt-2">
  <div class="flex">
    <div class="py-1">
      <svg class="fill-current h-6 w-6 text-white opacity-75 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
    </div>
    <div>
      <p class="mb-2"><strong>By default, group hover variants are not generated for any utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>

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

---
extends: _layouts.documentation
title: "State Variants"
description: "Using utilities to style elements on hover, focus, and more."
---

Similar to our [responsive prefixes](/docs/responsive-design), Tailwind makes it easy to style elements on hover, focus, and more using *state* prefixes.

## Hover

Add the `hover:` prefix to only apply a utility on hover.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button type="button" class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded focus:outline-none focus:shadow-outline">
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
      <p class="leading-tight mb-2"><strong class="font-bold">By default, hover variants are only generated for background color, border color, font weight, shadow, text color, and text style utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>


## Focus

Add the `focus:` prefix to only apply a utility on focus.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="max-w-xs w-full mx-auto">
  <input class="bg-gray-200 focus:bg-white border-transparent focus:border-blue-light text-gray-900 appearance-none inline-block w-full text-gray-900 border rounded py-3 px-4 focus:outline-none" placeholder="Focus me">
</div>

@slot('code')
<input class="bg-gray-200 focus:bg-white border-transparent focus:border-blue-light ..." placeholder="Focus me">
@endslot
@endcomponent

<div class="bg-blue-light text-white font-semibold px-4 py-3 mb-4 -mt-2">
  <div class="flex">
    <div class="py-1">
      <svg class="fill-current h-6 w-6 text-white opacity-75 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
    </div>
    <div>
      <p class="leading-tight mb-2"><strong class="font-bold">By default, focus variants are only generated for background color, border color, font weight, outline, shadow, text color, and text style utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>


## Active

Add the `active:` prefix to only apply a utility when an element is active.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button type="button" class="bg-blue active:bg-blue-dark text-white font-semibold hover:text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
  Click me
</button>

@slot('code')
<button class="bg-blue active:bg-blue-dark text-white...">
  Click me
</button>
@endslot
@endcomponent

<div class="bg-blue-light text-white font-semibold px-4 py-3 mb-4 -mt-2">
  <div class="flex">
    <div class="py-1">
      <svg class="fill-current h-6 w-6 text-white opacity-75 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
    </div>
    <div>
      <p class="leading-tight mb-2"><strong class="font-bold">By default, active variants are not generated for any utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>


## Group Hover

If you need to style a child element when hovering over a specific parent element, add the `.group` class to the parent element and add the `group-hover:` prefix to the utility on the child element.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'bg-gray-200 p-8'])
<div class="group hover:bg-blue p-4 cursor-pointer bg-white rounded max-w-xs w-full shadow-lg select-none overflow-hidden mx-auto">
  <p class="font-semibold text-lg mb-1 text-gray-900 group-hover:text-white">New Project</p>
  <p class="text-gray-700 group-hover:text-white mb-2">Create a new project from a variety of starting templates.</p>
</div>


@slot('code')
<div class="group bg-white hover:bg-blue ...">
  <p class="text-gray-900 group-hover:text-white ...">New Project</p>
  <p class="text-gray-700 group-hover:text-white ...">Create a new project from a variety of starting templates.</p>
</div>
@endslot
@endcomponent

<div class="bg-blue-light text-white font-semibold px-4 py-3 mb-4 -mt-2">
  <div class="flex">
    <div class="py-1">
      <svg class="fill-current h-6 w-6 text-white opacity-75 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
    </div>
    <div>
      <p class="leading-tight mb-2"><strong class="font-bold">By default, group hover variants are not generated for any utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>


## Focus-Within

<div class="text-sm bg-blue-lightest text-blue-dark font-semi-bold px-4 py-2 mb-4 rounded">
  <div class="flex items-center">
    <div class="mr-2">
      <svg class="block text-blue-light h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.432 15C14.387 9.893 12 8.547 12 6V3h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H8v3c0 2.547-2.387 3.893-4.432 9-.651 1.625-2.323 4 6.432 4s7.083-2.375 6.432-4zm-1.617 1.751c-.702.21-2.099.449-4.815.449s-4.113-.239-4.815-.449c-.249-.074-.346-.363-.258-.628.22-.67.635-1.828 1.411-3.121 1.896-3.159 3.863.497 5.5.497s1.188-1.561 1.824-.497a15.353 15.353 0 0 1 1.411 3.121c.088.265-.009.553-.258.628z"/></svg>
    </div>
    <div>
      <p class="font-semibold">Note that focus-within is not supported in IE or Edge.</p>
    </div>
  </div>
</div>

Add the `focus-within:` prefix to only apply a utility when a child element has focus.

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'bg-white p-8'])
<form class="w-full max-w-sm mx-auto">
  <div class="flex items-center border-b-2 border-grey-light focus-within:border-teal py-2">
    <input class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Jane Doe" aria-label="Full name">
    <button class="focus:shadow-outline focus:outline-none flex-shrink-0 bg-teal hover:bg-teal-dark border-teal hover:border-teal-dark text-sm border-4 text-white py-1 px-2 rounded" type="button">
      Sign Up
    </button>
  </div>
</form>


@slot('code')
<form class="border-b-2 border-grey-light focus-within:border-teal ...">
  <input class="..." placeholder="Jane Doe" ...>
  <button class="...">
    Sign Up
  </button>
</form>
@endslot
@endcomponent

<div class="bg-blue-light text-white font-semibold px-4 py-3 mb-4 -mt-2">
  <div class="flex">
    <div class="py-1">
      <svg class="fill-current h-6 w-6 text-white opacity-75 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
    </div>
    <div>
      <p class="leading-tight mb-2"><strong class="font-bold">By default, focus-within variants are not generated for any utilities.</strong></p>
      <p>You can customize this in the <a href="/docs/configuration#modules" class="underline">modules section</a> of your configuration file.</p>
    </div>
  </div>
</div>

## Responsive Prefixes

State variants are also responsive, meaning you can change an element's hover style for example at different breakpoints.

To apply a state variant responsively, **add the responsive prefix first, before the state prefix.**

```html
<button class="... md:bg-orange md:hover:bg-red ...">Button</button>
```

## Custom Utilities

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

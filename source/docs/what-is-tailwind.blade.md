---
extends: _layouts.documentation
title: ""
description: null
---

<div class="flex items-center justify-center">
  <svg class="h-20 w-20 sm:w-24 sm:h-24 block mr-4 -ml-4" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="0%" y1="0%" y2="100%" id="a"><stop stop-color="#2383AE" offset="0%"/><stop stop-color="#6DD7B9" offset="100%"/></linearGradient></defs><path d="M10 8c1.333-5.333 4.667-8 10-8 8 0 9 6 13 7 2.667.667 5-.333 7-3-1.333 5.333-4.667 8-10 8-8 0-9-6-13-7-2.667-.667-5 .333-7 3zM0 20c1.333-5.333 4.667-8 10-8 8 0 9 6 13 7 2.667.667 5-.333 7-3-1.333 5.333-4.667 8-10 8-8 0-9-6-13-7-2.667-.667-5 .333-7 3z" transform="translate(4 12)" fill="url(#a)" fill-rule="nonzero"/></svg>
  <h1 class="text-center font-semibold text-4xl sm:text-5xl tracking-tight mb-1">Tailwind CSS</h1>
</div>

<div class="max-w-sm mx-auto text-center text-xl sm:text-2xl text-grey-dark mb-16">
  <p class="leading-tight">
   A utility-first CSS framework for rapidly building custom user interfaces.
  </p>
</div>

Tailwind is different from frameworks like Bootstrap, Foundation, or Bulma in that **it's not a UI kit.**

It doesn't have a default theme, and there are no built-in UI components.

On the flip side, it also has no opinion about how your site should look and doesn't impose design decisions that you have to fight to undo.

If you're looking for a framework that comes with a menu of predesigned widgets to build your site with, Tailwind might not be the right framework for you.

But if you want a huge head start implementing a custom design with its own identity, Tailwind might be just what you're looking for.

## Utility-first

Creating a framework for building custom UIs means you can't provide abstractions at the usual level of buttons, forms, cards, navbars, etc.

Instead, Tailwind provides highly composable, low-level *utility classes* that make it easy to build complex user interfaces **without encouraging any two sites to look the same.**

Here's an example of a responsive contact card component built with Tailwind without writing a single line of CSS:

@component('_partials.code-sample', ['class' => 'bg-grey-lighter py-8'])
<div class="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden">
  <div class="sm:flex sm:items-center px-6 py-4">
    <img class="block h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0" src="https://avatars2.githubusercontent.com/u/4323180?s=400&u=4962a4441fae9fba5f0f86456c6c506a21ffca4f&v=4" alt="">
    <div class="text-center sm:text-left sm:flex-grow">
      <div class="mb-4">
        <p class="text-xl leading-tight">Adam Wathan</p>
        <p class="text-sm leading-tight text-grey-dark">Developer at NothingWorks Inc.</p>
      </div>
      <div>
        <button class="text-xs font-semibold rounded-full px-4 py-1 leading-normal bg-white border border-purple text-purple hover:bg-purple hover:text-white">Message</button>
      </div>
    </div>
  </div>
</div>
@slot('code')
<div class="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden">
  <div class="sm:flex sm:items-center px-6 py-4">
    <img class="block h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0" src="https://avatars2.githubusercontent.com/u/4323180?s=400&u=4962a4441fae9fba5f0f86456c6c506a21ffca4f&v=4" alt="">
    <div class="text-center sm:text-left sm:flex-grow">
      <div class="mb-4">
        <p class="text-xl leading-tight">Adam Wathan</p>
        <p class="text-sm leading-tight text-grey-dark">Developer at NothingWorks Inc.</p>
      </div>
      <div>
        <button class="text-xs font-semibold rounded-full px-4 py-1 leading-normal bg-white border border-purple text-purple hover:bg-purple hover:text-white">Message</button>
      </div>
    </div>
  </div>
</div>
@endslot
@endcomponent

## Component-friendly

While you can do a *lot* with just utility classes, sometimes a component class is the right decision.

Tailwind provides tools for [extracting component classes](/docs/extracting-components) from repeated utility patterns, making it easy to update multiple instances of a component from one place:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<!-- Using utilities: -->
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

<!-- Extracting component classes: -->
<button class="btn btn-blue">
  Button
</button>

<style>
  .btn {
    @apply&nbsp;font-bold py-2 px-4 rounded;
  }
  .btn-blue {
    @apply&nbsp;bg-blue text-white;
  }
  .btn-blue:hover {
    @apply&nbsp;bg-blue-dark;
  }
</style>
@endslot
@endcomponent

## Responsive to the core

Every Tailwind utility also comes in responsive flavors, making it extremely easy to build responsive interfaces without ever leaving your HTML.

Tailwind uses an intuitive `{screen}:` prefix that makes it easy to notice responsive classes in your markup while keeping the original class name recognizable and intact.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-start bg-grey-lighter">
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center bg-grey-lighter">
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="flex justify-end bg-grey-lighter">
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="flex justify-between bg-grey-lighter">
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex justify-around bg-grey-lighter">
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">1</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">2</div>
  <div class="text-grey-darker text-center bg-grey-light px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:justify-start sm:justify-center md:justify-end lg:justify-between xl:justify-around ...">
  <!-- ... -->
</div>
@endslot
@endcomponent

## Designed to be customized

If it makes sense to be customizable, Tailwind lets you customize it.

This includes colors, border sizes, font weights, spacing utilities, breakpoints, shadows, and tons more.

Tailwind is written in [PostCSS](http://postcss.org/) and configured in JavaScript, which means you have the full power of a real programming language at your fingertips.

Tailwind is more than a CSS framework, *it's an engine for creating design systems.*

```js
const colorPalette = {
  // ...
  'grey-lighter': '#f3f7f9',
  // ...
}

module.exports = {
  // ...
  backgroundColors: colorPalette,
  borderColors: {
    default: colorPalette['grey-lighter'],
    ...colorPalette,
  },
  // ...
}
```

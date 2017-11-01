---
extends: _layouts.documentation
title: "What is Tailwind?"
---

# What is Tailwind?

<div class="mt-8 text-2xl text-grey-dark mb-8">
    <p class="leading-tight">
        Tailwind is a utility-first CSS framework for rapidly building custom user interfaces.
    </p>
</div>

Tailwind is different from frameworks like Bootstrap, Foundation, or Bulma in that **it's not a UI kit.**

It doesn't have a default theme and there's no built-in UI components.

On the flip side, it also has no opinion about how your site should look and doesn't impose design decisions that you have to fight to undo.

If you're looking for a framework that comes with a menu of predesigned widgets to build your site with, Tailwind might not be the right framework for you.

But if you a want a huge head start implementing a custom design with its own identity, Tailwind might be just what you're looking for.

### Utility-first

Creating a framework for building custom UIs means you can't provide abstractions at the usual level of buttons, forms, cards, navbars, etc.

Instead, Tailwind provides highly composable, low-level *utility classes* that make it easy to build complex user interfaces **without encouraging any two sites to look the same.**

Here's an example of a contact card component built with Tailwind without writing a single line of CSS:

@component('_partials.code-sample', ['class' => 'bg-grey-lighter py-8'])
<div class="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden">
    <div class="flex items-center px-6 py-4">
        <div class="mr-4">
            <img class="h-24 rounded-full" src="https://avatars2.githubusercontent.com/u/4323180?s=400&u=4962a4441fae9fba5f0f86456c6c506a21ffca4f&v=4" alt="">
        </div>
        <div class="flex-grow">
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
    <div class="flex items-center px-6 py-4">
        <div class="mr-4">
            <img class="h-24 rounded-full" src="https://avatars2.githubusercontent.com/u/4323180?s=400&u=4962a4441fae9fba5f0f86456c6c506a21ffca4f&v=4" alt="">
        </div>
        <div>
            <div class="mb-4">
                <p class="text-xl leading-tight text-black">Adam Wathan</p>
                <p class="text-sm leading-tight text-grey-dark">Developer at NothingWorks Inc.</p>
            </div>
            <button class="text-xs font-semibold rounded-full px-4 py-1 leading-normal bg-white border border-purple text-purple hover:bg-purple hover:text-white">Message</button>
        </div>
    </div>
</div>
@endslot
@endcomponent

### Component-friendly

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
    @apply&nbsp;.font-bold .py-2 .px-4 .rounded;
  }
  .btn-blue {
    @apply&nbsp;.bg-blue .text-white;
  }
  .btn-blue:hover {
    @apply&nbsp;.bg-blue-dark;
  }
</style>
@endslot
@endcomponent

### Responsive to the core

Every Tailwind utility also comes in responsive flavors, making it extremely easy to build responsive interfaces without ever leaving your HTML.

Tailwind uses an intuitive `{breakpoint}:` prefix that makes it easy to notice responsive classes in your markup while keeping the original class name recognizable and in tact.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-start bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="flex justify-end bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="flex justify-between bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex justify-around bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:justify-start sm:justify-center md:justify-end lg:justify-between xl:justify-around ...">
    <!-- ... -->
</div>
@endslot
@endcomponent


### Designed to be customized

If it makes sense to be customizable, Tailwind lets you customize it.

This includes colors, border sizes, font weights, spacing utilities, breakpoints, shadows, and tons more.

Tailwind is written in [PostCSS](http://postcss.org/) and configured in JavaScript, which means you have the full power of a real programming language at your finger tips.

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

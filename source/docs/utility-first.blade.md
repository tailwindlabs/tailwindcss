---
extends: _layouts.documentation
title: "Utility-First"
description: null
---

- Benefits of not naming things (not everything deserves a name)
- Designing with constraints
- Designing in the browser workflow

Creating a framework for building custom UIs means you can't provide abstractions at the usual level of buttons, forms, cards, navbars, etc.

Instead, Tailwind provides highly composable, low-level *utility classes* that make it easy to build complex user interfaces **without encouraging any two sites to look the same.**

Here's an example of a responsive contact card component built with Tailwind without writing a single line of CSS:

@component('_partials.code-sample', ['class' => 'bg-gray-200 py-8'])
<div class="bg-white mx-auto max-w-sm shadow-xl rounded-lg overflow-hidden">
  <div class="sm:flex sm:items-center px-6 py-4">
    <img class="block h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0" src="https://avatars2.githubusercontent.com/u/4323180?s=400&u=4962a4441fae9fba5f0f86456c6c506a21ffca4f&v=4" alt="">
    <div class="text-center sm:text-left sm:flex-grow">
      <div class="mb-4">
        <p class="text-xl leading-tight">Adam Wathan</p>
        <p class="text-sm leading-tight text-gray-600">Developer at NothingWorks Inc.</p>
      </div>
      <div>
        <button class="text-xs font-semibold rounded-full px-4 py-1 leading-normal bg-white border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">Message</button>
      </div>
    </div>
  </div>
</div>
@slot('code')
<div class="bg-white mx-auto max-w-sm shadow-xl rounded-lg overflow-hidden">
  <div class="sm:flex sm:items-center px-6 py-4">
    <img class="block h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0" src="https://avatars2.githubusercontent.com/u/4323180?s=400&u=4962a4441fae9fba5f0f86456c6c506a21ffca4f&v=4" alt="">
    <div class="text-center sm:text-left sm:flex-grow">
      <div class="mb-4">
        <p class="text-xl leading-tight">Adam Wathan</p>
        <p class="text-sm leading-tight text-gray-600">Developer at NothingWorks Inc.</p>
      </div>
      <div>
        <button class="text-xs font-semibold rounded-full px-4 py-1 leading-normal bg-white border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">Message</button>
      </div>
    </div>
  </div>
</div>
@endslot
@endcomponent

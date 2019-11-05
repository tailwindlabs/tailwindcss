---
extends: _layouts.documentation
title: "Component Examples"
description: "Learn how to build common UI components using utility classes."
titleBorder: true
---

<h2 style="font-size: 0" class="invisible m-0 -mb-6">Overview</h2>

Unlike many other CSS frameworks, **Tailwind doesn't include any component classes like `form-input`, `btn`, `card`, or `navbar`**.

Tailwind is a CSS framework for implementing custom designs, and even a component as simple as a button can look completely different from one site to another, so providing opinionated component styles that you'd end up wanting to override anyways would only make the development experience more frustrating.

Instead, you're encouraged to work [utility-first](/docs/utility-first) and [extract your own components](/docs/extracting-components) when you start to notice common patterns in your UI.

@component('_partials.code-sample', ['class' => 'p-8 bg-white'])
<div class="max-w-sm mx-auto">
  <p class="text-sm mb-2 text-gray-600">Simple form input component</p>
  <input class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal" type="email" placeholder="jane@example.com">
</div>
@slot('code')
<input class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal" type="email" placeholder="jane@example.com">
@endslot
@endcomponent

## Examples

To help you get started, we've included a bunch of component examples built with utility classes that might be helpful for inspiration or to understand how to implement common UI elements.

- [Alerts](/components/alerts)
- [Buttons](/components/buttons)
- [Cards](/components/cards)
- [Forms](/components/forms)
- [Grids](/components/grids)
- [Navigation](/components/navigation)


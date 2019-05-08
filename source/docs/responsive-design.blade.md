---
extends: _layouts.documentation
title: "Responsive Design"
description: "Using responsive utility variants to build adaptive user interfaces."
titleBorder: true
---

<h2 style="font-size: 0" class="invisible m-0 -mb-6">Overview</h2>

Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML.

There are four breakpoints by default, inspired by common device resolutions:

```css
/* Small (sm) */
@media (min-width: 640px) { /* ... */ }

/* Medium (md) */
@media (min-width: 768px) { /* ... */ }

/* Large (lg) */
@media (min-width: 1024px) { /* ... */ }

/* Extra Large (xl) */
@media (min-width: 1280px) { /* ... */ }
```

To add a utility but only have it take effect at a certain breakpoint, all you need to do is prefix the utility with the breakpoint name, followed by the `:` character:

```html
<!-- Width of 16 by default, 32 on medium screens, and 48 on large screens -->
<img class="w-16 md:w-32 lg:w-48" src="...">
```

This works for **every utility class in the framework**, which means you can change literally anything at a given breakpoint — even things like letter spacing or cursor styles.

Here's a simple example of a marketing page component that uses a stacked layout on small screens, and a side-by-side layout on larger screens *(resize your browser to see it in action)*:

@component('_partials.code-sample', ['class' => 'p-8'])
<div class="md:flex">
  <div class="md:flex-shrink-0">
    <img class="rounded-lg md:w-56" src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80" alt="Woman paying for a purchase">
  </div>
  <div class="mt-4 md:mt-0 md:ml-6">
    <div class="uppercase tracking-wide text-sm text-indigo-600 font-bold">Marketing</div>
    <a href="#" class="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline">Finding customers for your new business</a>
    <p class="mt-2 text-gray-600">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
  </div>
</div>
@endcomponent

## Mobile First

By default, Tailwind uses a mobile first breakpoint system, similar to what you might be used to in Bootstrap or Foundation.

What this means is that unprefixed utilities (like `uppercase`) take effect on all screen sizes, while prefixed utilities (like `md:uppercase`) only take effect at the specified breakpoint *and above*.

Here's a simple example that cycles through several background colors at different breakpoints *(resize your browser to see the background color change)*:

@component('_partials.code-sample', ['class' => 'p-0'])
<div class="h-20 w-20 mx-auto rounded-lg bg-red-500 sm:bg-green-500 md:bg-blue-500 lg:bg-pink-500 xl:bg-teal-500"></div>
@slot('code')
<div class="bg-red-500 sm:bg-green-500 md:bg-blue-500 lg:bg-pink-500 xl:bg-teal-500"></div>
@endslot
@endcomponent

Throughout the documentation, you'll often see this interactive widget which we use to quickly demonstrate how some code would look on different screen sizes without forcing you to resize the browser — simply click the device icons at the top to see how the code below would render at that breakpoint:

@component('_partials.responsive-code-sample')
@slot('none')
<div class="h-20 w-20 mx-auto rounded-lg bg-red-500"></div>
@endslot

@slot('sm')
<div class="h-20 w-20 mx-auto rounded-lg bg-green-500"></div>
@endslot

@slot('md')
<div class="h-20 w-20 mx-auto rounded-lg bg-blue-500"></div>
@endslot

@slot('lg')
<div class="h-20 w-20 mx-auto rounded-lg bg-pink-500"></div>
@endslot

@slot('xl')
<div class="h-20 w-20 mx-auto rounded-lg bg-teal-500"></div>
@endslot

@slot('code')
<div class="none:bg-red-500 sm:bg-green-500 md:bg-blue-500 lg:bg-pink-500 xl:bg-teal-500"></div>
@endslot
@endcomponent

Examples like this intentionally **do not react to changing your browser size**. This is by design — it allows even people reading the documentation on smaller screens to preview how some code would look on a desktop display.

### Targeting mobile screens

Where this approach surprises people most often is that to style something for mobile, you need to use the unprefixed version of a utility, not the `sm:` prefixed version. Don't think of `sm:` as meaning "on small screens", think of it as "at the small *breakpoint*".

@component('_partials.tip-bad')
Don't use <code class="text-sm font-bold text-gray-800">sm:</code> to target mobile devices
@endcomponent

```html
<!-- This will only center text on screens 640px and wider, not on small screens -->
<div class="sm:text-center"></div>
```

@component('_partials.tip-good')
Use unprefixed utilities to target mobile, and override them at larger breakpoints
@endcomponent

```html
<!-- This will center text on mobile, and left align it on screens 640px and wider -->
<div class="text-center sm:text-left"></div>
```

For this reason, it's often a good idea to implement the mobile layout for a design first, then layer on any changes that make sense for `sm` screens, followed by `md` screens, etc.

### Targeting a single breakpoint

Tailwind's breakpoints only include a `min-width` and don't include a `max-width`, which means any utilities you add at a smaller breakpoint will also be applied at larger breakpoints.

If you'd like to apply a utility at one breakpoint only, the solution is to *undo* that utility at larger sizes by adding another utility that counteracts it.

Here is an example where the background color is red at the `md` breakpoint, but teal at every other breakpoint:

@component('_partials.responsive-code-sample')
@slot('none')
<div class="h-20 w-20 mx-auto rounded-lg bg-teal-500"></div>
@endslot

@slot('sm')
<div class="h-20 w-20 mx-auto rounded-lg bg-teal-500"></div>
@endslot

@slot('md')
<div class="h-20 w-20 mx-auto rounded-lg bg-red-500"></div>
@endslot

@slot('lg')
<div class="h-20 w-20 mx-auto rounded-lg bg-teal-500"></div>
@endslot

@slot('xl')
<div class="h-20 w-20 mx-auto rounded-lg bg-teal-500"></div>
@endslot

@slot('code')
<div class="bg-teal-500 md:bg-red-500 lg:bg-teal-500"></div>
@endslot
@endcomponent

Notice that **we did not** have to specify a background color for the `sm` breakpoint or the `xl` breakpoint — you only need to specify when a utility should *start* taking effect, not when it should stop.

## Customizing breakpoints

You can completely customize your breakpoints in your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  }
}
```

Learn more in the [customizing breakpoints documentation](/docs/breakpoints).

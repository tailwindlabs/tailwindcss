---
extends: _layouts.documentation
title: "Responsive Design"
---

# Responsive Design

Tailwind allows you to build responsive designs in the same way you build the rest of your design&mdash;using utility classes. Every utility in Tailwind is also available in screen-size specific variations. For example, the `.font-bold` utility can be used on small screen sizes using the `.sm:font-bold` class, on medium screen sizes using the `.md:font-bold` class, on large screen sizes using the `.lg:font-bold` class and on extra large screen sizes using the `.xl:font-bold` class.

This is done using predefined screen sizes (media query breakpoints), each of which are given a unique name like `sm`, `md`, `lg` and `xl`. By default Tailwind takes a "mobile first" approach, where each screen size represents a minimum viewport width. Any classes you apply at smaller screen sizes are also applied to larger sizes, unless of course you override them, which is the whole point! This approach, while simple, is actually very powerful and can be used to build complex, beautiful, responsive designs.

## Responsive example

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex justify-center">
    <div class="bg-purple w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('sm')
<div class="flex justify-center">
    <div class="bg-green w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('md')
<div class="flex justify-center">
    <div class="bg-blue w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('lg')
<div class="flex justify-center">
    <div class="bg-red w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('xl')
<div class="flex justify-center">
    <div class="bg-orange w-24 h-24 rounded-full"></div>
</div>
@endslot
@slot('code')
<div class="none:bg-purple sm:bg-green md:bg-blue lg:bg-red xl:bg-orange ...">
    ...
</div>
@endslot
@endcomponent

## Customizing screens

You define your project's screen sizes in your Tailwind config under the `screens` key. Screens in Tailwind are essentially CSS media queries. If you provide a single value for a screen, Tailwind will treat this as the minimum screen size value for that screen breakpoint. Here are the default screen sizes:

```js
screens: {
  'sm': '576px',
  'md': '768px',
  'lg': '992px',
  'xl': '1200px',
},
```

Feel free to have as few or as many screens as you want, naming them in whatever way you'd prefer for your project.

## Advanced screens

Tailwind also allows for more complex screen definitions, which can be useful in certain situations. For example, if you wanted to define both the minimum and maximum size for your screens, you could do that like this:

```js
screens: {
  'sm': {'min': '576px', 'max': '767px'},
  'md': {'min': '768px', 'max': '991px'},
  'lg': {'min': '992px', 'max': '1999px'},
  'xl': {'min': '1200px'},
},
```

You can also provide multiple ranges per screen. This is useful in situations where you have a sidebar navigation and want to maintain consistent content breakpoints, regardless of the navigation being visible or not. Here's an example:

```js
// Sidebar is shown at 768px
screens: {
  'sm': '500px',
  'md': [
    {'min': '668px', 'max': '767px'},
    {'min': '868px'}
  ],
  'lg': '1100px',
  'xl': '1400px',
},
```

## Print screens

As mentioned earlier, screens in Tailwind are essentially just CSS media queries. So while you normally define your screensizes in pixels, it's possible to also define non-regular screens using the `raw` key. Here is an example of how you could use this to create a print-only screen size.

```js
screens: {
  'sm': '576px',
  'md': '768px',
  'lg': '992px',
  'xl': '1200px',
  'print': {'raw': 'print'}
},
```

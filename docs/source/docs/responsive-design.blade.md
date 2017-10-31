---
extends: _layouts.documentation
title: "Responsive Design"
---

# Responsive Design

Tailwind allows you to build responsive designs in the same way you build the rest of your design&mdash;using utility classes. Every utility in Tailwind is also available in screen-size specific variations. For example, the `.font-bold` utility can be used on small screen sizes using the `.sm:font-bold` class, on medium screen sizes using the `.md:font-bold` class, on large screen sizes using the `.lg:font-bold` class and on extra large screen sizes using the `.xl:font-bold` class.

This is done using predfined screen sizes, each of which are given a unique name like `sm`, `md`, `lg` and `xl`. Tailwind takes a "mobile first" approach to responsive design, where each screen size represents a minimum viewport width. Any classes you apply at smaller screen sizes will also apply to larger sizes, unless of course you override them. This approach, while simple, is actually very powerful and can be used to build complex, beautiful, responsive designs.

## Screens

You define your project's screen sizes in your Tailwind config under the `screens` key. Screens in Tailwind are essentially CSS media queries. If you provide a single value for a screen, Tailwind will treat this as a minimum screen size value for that breakpoint. Here are the default screen sizes:

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

Tailwind also allows for more complex screen definitions, which can be useful in certain situations.

```js
// add
```

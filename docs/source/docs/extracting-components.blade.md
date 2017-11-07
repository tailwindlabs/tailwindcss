---
extends: _layouts.documentation
title: "Extracting Components"
description: null
---

Tailwind encourages a "utility-first" workflow, where new designs are initially implemented using only utility classes to avoid premature abstraction.

While we strongly believe you can get a lot further with just utilities than you might initially expect, **we don't believe that a dogmatic utility*-only* approach is the best way to write CSS.**

For example, using a utility-first approach, implementing a button style early in a project might look something like this:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>
@endslot
@endcomponent

If this is the only button in your project, creating a custom component class for it would be premature abstraction; you'd be writing new CSS for no measurable benefit.

If on the other hand you were reusing this button style in several places, keeping that long list of utility classes in sync across every button instance could become a real maintenance burden.


## Extracting utility patterns with `@apply`

When you start to notice repeating patterns of utilities in your markup, it might be worth extracting a component class.

To make this as easy as possible, Tailwind provides the `@apply` directive for applying the styles of existing utilities to new component classes.

Here's what a `.btn-blue` class might look like using `@apply` to compose it from existing utilities:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="btn-blue">
  Button
</button>

<style>
.btn-blue {
  @@apply .bg-blue .text-white .font-bold .py-2 .px-4 .rounded;
}
.btn-blue:hover {
  @@apply .bg-blue-dark;
}
</style>
@endslot
@endcomponent

Note that `hover:`, `focus:`, and `{screen}:` utility variants can't be mixed in directly. Instead, apply the plain version of the utility you need to the appropriate pseudo-selector or in a new media query.


## Keeping things composable

Say you have these two buttons:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded mr-4">
  Button
</button>

<button class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded">
  Button
</button>

<button class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded">
  Button
</button>
@endslot
@endcomponent

It might be tempting to implement component classes for these buttons like this:

```less
.btn-blue {
  @@apply .bg-blue .text-white .font-bold .py-2 .px-4 .rounded;
}
.btn-blue:hover {
  @@apply .bg-blue-dark;
}

.btn-grey {
  @@apply .bg-grey-light .text-grey-darkest .font-bold .py-2 .px-4 .rounded;
}
.btn-grey:hover {
  @@apply .bg-grey;
}
```

The issue with this approach is that **you still have potentially painful duplication.**

If you wanted to change the padding, font weight, or border radius of all the buttons on your site, you'd need to update every button class.

A better approach is to extract the parts that are the same into a separate class:

```less
.btn {
  @@apply .font-bold .py-2 .px-4 .rounded;
}

.btn-blue {
  @@apply .bg-blue .text-white;
}
.btn-blue:hover {
  @@apply .bg-blue-dark;
}

.btn-grey {
  @@apply .bg-grey-light .text-grey-darkest;
}
.btn-grey:hover {
  @@apply .bg-grey;
}
```

Now you'd apply two classes any time you needed to style a button:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded mr-4">
  Button
</button>

<button class="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="btn btn-blue">
  Button
</button>

<button class="btn btn-grey">
  Button
</button>
@endslot
@endcomponent

This makes it easy to change the shared styles in one place by just editing the `.btn` class.

It also allows you to add new one-off button styles without being forced to create a new component class or duplicated the shared styles:

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<button class="bg-green hover:bg-green-light text-white font-bold py-2 px-4 rounded">
  Button
</button>

@slot('code')
<button class="btn bg-green hover:bg-green-light text-white">
  Button
</button>
@endslot
@endcomponent


## CSS Structure

Since Tailwind's utility classes don't rely on `!important` to defeat other styles, it's important that you add your component classes *before* any utility classes in your CSS.

Here's an example:

```less
@@tailwind preflight;

.btn {
  @@apply .font-bold .py-2 .px-4 .rounded;
}
.btn-blue {
  @@apply .bg-blue .text-white;
}
.btn-blue:hover {
  @@apply .bg-blue-dark;
}

@@tailwind utilities;
```

If you're using a preprocessor like Less or Sass, consider keeping your components in separate files and importing them:

```less
@@tailwind preflight;

@@import "components/buttons";
@@import "components/forms";
/* Etc. */

@@tailwind utilities;
```


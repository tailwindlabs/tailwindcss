---
extends: _layouts.documentation
title: "Animation"
description: "Utilities for animating elements with CSS animations."
featureVersion: "v1.6.0+"
---

@include('_partials.class-table', [
  'forceScroll' => true,
  'rows' => $page->config['theme']['animation']->map(function ($value, $name) use ($page) {
    $class = ".animate-{$name}";
    $code = "animation: {$value};";

    if (!isset($page->config['theme']['keyframes'][$name])) {
      return [$class, $code];
    }

    $keyframes = collect($page->config['theme']['keyframes'][$name])->map(function ($properties, $key) {
      $code = collect($properties)->map(function ($value, $property) {
        return "    {$property}: {$value}";
      })->implode("\n");

      return implode([
        "  {$key} {",
        $code,
        "  }",
      ], "\n");
    })->implode("\n");

    return [$class, implode([
      $code,
      "\n",
      "@keyframes {$name} {",
      $keyframes,
      "}",
    ], "\n")];
  })
])

## Spin

Add the `animate-spin` utility to add a linear spin animation to elements like loading indicators.

@component('_partials.code-sample', ['class' => 'bg-white text-center py-12'])
<span class="inline-flex rounded-md shadow-sm">
  <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 cursor-not-allowed" disabled>
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Processing
  </button>
</span>
@slot('code')
<button type="button" class="bg-indigo-600 ..." disabled>
  <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
    <!-- ... -->
  </svg>
  Processing
</button>
@endslot
@endcomponent

## Ping

Add the `animate-ping` utility to make an element scale and fade like a radar ping or ripple of water — useful for things like notification badges.

@component('_partials.code-sample', ['class' => 'bg-white text-center py-12'])
<span class="relative inline-flex rounded-md shadow-sm">
  <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-400 text-base leading-6 font-medium rounded-md text-gray-800 bg-white hover:text-gray-700 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150">
    Transactions
  </button>
  <span class="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
  </span>
</span>
@slot('code')
<span class="flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
</span>
@endslot
@endcomponent

## Pulse

Add the `animate-pulse` utility to make an element gently fade in and out — useful for things like skeleton loaders.

@component('_partials.code-sample', ['class' => 'bg-white text-center py-12'])
<div class="border border-gray-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
  <div class="flex space-x-4 animate-pulse">
    <div class="rounded-full bg-gray-400 h-12 w-12"></div>
    <div class="flex-1 space-y-4 py-1">
      <div class="h-4 bg-gray-400 rounded w-3/4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-400 rounded"></div>
        <div class="h-4 bg-gray-400 rounded w-5/6"></div>
      </div>
    </div>
  </div>
</div>
@slot('code')
<div class="border border-gray-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
  <div class="animate-pulse flex space-x-4">
    <div class="rounded-full bg-gray-400 h-12 w-12"></div>
    <div class="flex-1 space-y-4 py-1">
      <div class="h-4 bg-gray-400 rounded w-3/4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-400 rounded"></div>
        <div class="h-4 bg-gray-400 rounded w-5/6"></div>
      </div>
    </div>
  </div>
</div>
@endslot
@endcomponent

## Bounce

Add the `animate-bounce` utility to make an element bounce up and down — useful for things like "scroll down" indicators.

@component('_partials.code-sample', ['class' => 'bg-white text-center py-8'])
<div class="flex justify-center">
  <svg class="animate-bounce w-6 h-6 text-gray-900" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
  </svg>
</div>
@slot('code')
<svg class="animate-bounce w-6 h-6 text-gray-900" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
</svg>
@endslot
@endcomponent

## Responsive

To change or disable an animation at a specific breakpoint, add a `{screen}:` prefix to any existing animation utility. For example, use `md:animate-none` to apply the `animate-none` utility at only medium screen sizes and above.

```html
<div class="animate-spin md:animate-none ...">
  <!-- ... -->
</div>
```

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

## Customizing

Animations by their very nature tend to be highly project-specific. **The animations we include by default are best thought of as helpful examples**, and you're encouraged to customize your animations to better suit your needs.

By default Tailwind provides utilities for four different example animations, as well as the `animate-none` utility. You change, add, or remove these by customizing the `animation` section of your theme configuration.

@component('_partials.customized-config', ['key' => 'theme.extend.animation'])
+ 'spin-slow': 'spin 3s linear infinite',
@endcomponent

To add new animation `@keyframes`, use the `keyframes` section of your theme configuration:

@component('_partials.customized-config', ['key' => 'theme.extend.keyframes'])
+ 'wiggle': {
+   '0%, 100%': { transform: 'rotate(-3deg)' },
+   '50%': { transform: 'rotate(3deg)' },
+ }
@endcomponent

You can then reference these keyframes by name in the `animation` section of your theme configuration:

@component('_partials.customized-config', ['key' => 'theme.extend.animation'])
+ 'wiggle': 'wiggle 1s ease-in-out infinite',
@endcomponent

Learn more about customizing the default theme in the [theme customization documentation](/docs/theme#customizing-the-default-theme).

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'animation',
        'property' => 'animation',
    ],
    'variants' => [
        'responsive',
    ],
])

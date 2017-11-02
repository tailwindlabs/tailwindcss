---
extends: _layouts.documentation
title: "Navigation"
---

# Navigation

<div class="mt-8">
  <div class="bg-blue-lightest border-l-4 border-blue-light rounded-b text-blue-darkest px-4 py-3">
    <div class="flex">
      <div class="py-1">
        <svg class="h-6 w-6 text-blue-light mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
      </div>
      <div>
        <p class="font-semibold">Work in progress!</p>
        <p class="text-sm">More detailed examples are coming soon.</p>
      </div>
    </div>
  </div>
</div>

## Simple Navigation Example

@component('_partials.code-sample')
<ul class="flex">
    <li class="mr-6">
        <a class="text-blue hover:text-blue-darker" href="#">Active</a>
    </li>
    <li class="mr-6">
        <a class="text-blue hover:text-blue-darker" href="#">Link</a>
    </li>
    <li class="mr-6">
        <a class="text-blue hover:text-blue-darker" href="#">Link</a>
    </li>
    <li class="mr-6">
        <a class="text-grey-light" href="#">Disabled</a>
    </li>
</ul>
@endcomponent

## Tabs

@component('_partials.code-sample')
<ul class="flex border-b">
    <li class="-mb-px mr-1">
        <a class="bg-white inline-block border-l border-t border-r rounded rounded-t py-2 px-4 text-blue-dark font-semibold" href="#">Active</a>
    </li>
    <li class="mr-1">
        <a class="bg-white inline-block py-2 px-4 text-blue hover:text-blue-dark font-semibold" href="#">Tab</a>
    </li>
    <li class="mr-1">
        <a class="bg-white inline-block py-2 px-4 text-blue hover:text-blue-dark font-semibold" href="#">Tab</a>
    </li>
    <li class="mr-1">
        <a class="bg-white inline-block py-2 px-4 text-grey-light font-semibold" href="#">Tab</a>
    </li>
</ul>
@endcomponent

## Pills

@component('_partials.code-sample')
<ul class="flex">
    <li class="mr-3">
        <a class="inline-block border border-blue rounded py-1 px-3 bg-blue text-white" href="#">Active Pill</a>
    </li>
    <li class="mr-3">
        <a class="inline-block border border-white rounded hover:border-grey-lighter text-blue hover:bg-grey-lighter py-1 px-3" href="#">Pill</a>
    </li>
    <li class="mr-3">
        <a class="inline-block py-1 px-3 text-grey-light" href="#">Disabled Pill</a>
    </li>
</ul>
@endcomponent

## Flex-Filled Navigation

@component('_partials.code-sample')
<ul class="flex">
    <li class="flex-1 mr-2">
        <a class="text-center block border border-blue rounded py-2 px-4 bg-blue hover:bg-blue-dark text-white" href="#">Active Item</a>
    </li>
    <li class="flex-1 mr-2">
        <a class="text-center block border border-white rounded hover:border-grey-lighter text-blue hover:bg-grey-lighter py-2 px-4" href="#">Nav Item</a>
    </li>
    <li class="text-center flex-1">
        <a class="block py-2 px-4 text-grey-light" href="#">Disabled Item</a>
    </li>
</ul>
@endcomponent

## Justified Navigation

@component('_partials.code-sample')
<ul class="flex justify-between">
    <li class="mr-3">
        <a class="inline-block border border-blue rounded py-2 px-4 bg-blue hover:bg-blue-dark text-white" href="#">Active Pill</a>
    </li>
    <li class="mr-3">
        <a class="inline-block border border-white rounded hover:border-grey-lighter text-blue hover:bg-grey-lighter py-2 px-4" href="#">Pill</a>
    </li>
    <li class="mr-3">
        <a class="inline-block py-2 px-4 text-grey-light" href="#">Disabled Pill</a>
    </li>
</ul>
@endcomponent

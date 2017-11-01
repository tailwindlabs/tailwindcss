---
extends: _layouts.documentation
title: "Cards"
---

# Cards

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

## Classic card example

@component('_partials.code-sample', ['class' => 'p-10 flex justify-center'])
<div class="max-w-sm rounded overflow-hidden shadow-lg">
    <img class="w-full" src="/img/card-top.jpg">
    <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
        <p class="text-slate text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
        </p>
    </div>
    <div class="px-6 py-4">
        <span class="inline-block bg-smoke-light rounded-full px-3 py-1 text-sm font-semibold text-slate mr-2">#photography</span>
        <span class="inline-block bg-smoke-light rounded-full px-3 py-1 text-sm font-semibold text-slate mr-2">#travel</span>
        <span class="inline-block bg-smoke-light rounded-full px-3 py-1 text-sm font-semibold text-slate">#winter</span>
    </div>
</div>
@endcomponent

## Advanced card example

@component('_partials.code-sample', ['class' => 'p-10 flex justify-center'])
<div class="max-w-md flex">
    <div class="rounded rounded-l w-128 text-center overflow-hidden">
        <img class="block h-64" src="/img/card-left.jpg">
    </div>
    <div class="border-t border-r border-b border-smoke rounded rounded-r p-4 flex flex-col justify-between">
        <div>
            <p class="text-sm text-slate-light flex items-center">
                <svg class="text-slate-lighter w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"/></svg>
                Members only
            </p>
            <div class="font-bold text-xl mb-2">Can coffee make you a better developer?</div>
            <p class="text-slate text-base">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.</p>
        </div>
        <div class="flex items-center">
            <img class="w-10 h-10 rounded-full mr-4" src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg">
            <div class="text-sm">
                <p class="text-slate-darker leading-none">Jonathan Reinink</p>
                <p class="text-slate-light">Aug 18</p>
            </div>
        </div>
    </div>
</div>
@endcomponent

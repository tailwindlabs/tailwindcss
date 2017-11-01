---
extends: _layouts.documentation
title: "Grid"
---

# Grid

<div class="mt-8">
  <div class="bg-blue-lightest border-l-4 border-blue-light rounded-b text-blue-darkest px-4 py-3">
    <div class="flex">
      <div class="py-1">
        <svg class="h-6 w-6 text-blue-light mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
      </div>
      <div>
        <p class="font-semibold">Work in progress!</p>
        <p class="text-sm">More detailed documentation is coming soon, but in the mean time here are some quick and dirty examples.</p>
      </div>
    </div>
  </div>
</div>

Basic grid example:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap</div>
    <div class="flex flex-wrap">
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/3
            </div>
        </div>
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate-dark text-white">
                .md:w-1/3
            </div>
        </div>
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/3
            </div>
        </div>
    </div>
</div>

Columns don't need to fill a row:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap</div>
    <div class="flex flex-wrap">
        <div class="w-full md:w-1/4">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/4
            </div>
        </div>
        <div class="w-full md:w-1/4">
            <div class="text-center py-4 bg-slate-dark text-white">
                .md:w-1/4
            </div>
        </div>
        <div class="w-full md:w-1/4">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/4
            </div>
        </div>
    </div>
</div>


Columns can be different widths:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap</div>
    <div class="flex flex-wrap">
        <div class="w-full md:w-1/4">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/4
            </div>
        </div>
        <div class="w-full md:w-1/2">
            <div class="text-center py-4 bg-slate-dark text-white">
                .md:w-1/2
            </div>
        </div>
        <div class="w-full md:w-1/4">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/4
            </div>
        </div>
    </div>
</div>


Rows can overflow and wrap:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap</div>
    <div class="flex flex-wrap">
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/3
            </div>
        </div>
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate-dark text-white">
                .md:w-1/3
            </div>
        </div>
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/3
            </div>
        </div>
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate-dark text-white">
                .md:w-1/3
            </div>
        </div>
        <div class="w-full md:w-1/3">
            <div class="text-center py-4 bg-slate text-white">
                .md:w-1/3
            </div>
        </div>
    </div>
</div>

Columns can have gutters:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap.-mx-4</div>
    <div class="flex flex-wrap -mx-4">
        <div class="w-full md:w-1/3 px-4">
            <div class="text-center py-4 bg-slate text-white">
                <div>.w-full</div>
                <div>.md:w-1/3</div>
                <div>.px-4</div>
            </div>
        </div>
        <div class="w-full md:w-1/3 px-4">
            <div class="text-center py-4 bg-slate-dark text-white">
                <div>.w-full</div>
                <div>.md:w-1/3</div>
                <div>.px-4</div>
            </div>
        </div>
        <div class="w-full md:w-1/3 px-4">
            <div class="text-center py-4 bg-slate text-white">
                <div>.w-full</div>
                <div>.md:w-1/3</div>
                <div>.px-4</div>
            </div>
        </div>
    </div>
</div>


Column widths can be automatic:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap</div>
    <div class="flex flex-wrap">
        <div class="w-1/4 md:flex-1 md:w-auto">
            <div class="text-center py-4 bg-slate text-white">
                <div>.w-1/4</div>
                <div>.md:flex-1</div>
                <div>.md:w-auto</div>
            </div>
        </div>
        <div class="w-1/4 md:flex-1 md:w-auto">
            <div class="text-center py-4 bg-slate-dark text-white">
                <div>.w-1/4</div>
                <div>.md:flex-1</div>
                <div>.md:w-auto</div>
            </div>
        </div>
        <div class="w-1/4 md:flex-1 md:w-auto">
            <div class="text-center py-4 bg-slate text-white">
                <div>.w-1/4</div>
                <div>.md:flex-1</div>
                <div>.md:w-auto</div>
            </div>
        </div>
        <div class="w-1/4 md:flex-1 md:w-auto">
            <div class="text-center py-4 bg-slate-dark text-white">
                <div>.w-1/4</div>
                <div>.md:flex-1</div>
                <div>.md:w-auto</div>
            </div>
        </div>
        <div class="w-1/4 md:flex-1 md:w-auto">
            <div class="text-center py-4 bg-slate text-white">
                <div>.w-1/4</div>
                <div>.md:flex-1</div>
                <div>.md:w-auto</div>
            </div>
        </div>
    </div>
</div>

Fixed width columns are still respected even if a smaller screen has auto column widths:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap</div>
    <div class="flex flex-wrap">
        <div class="flex-grow md:w-1/6 md:flex-none">
            <div class="text-center py-4 bg-slate text-white">
                <div>.flex-grow</div>
                <div>.md:w-1/6</div>
                <div>.md:flex-none</div>
            </div>
        </div>
        <div class="flex-grow md:w-1/6 md:flex-none">
            <div class="text-center py-4 bg-slate-dark text-white">
                <div>.flex-grow</div>
                <div>.md:w-1/6</div>
                <div>.md:flex-none</div>
            </div>
        </div>
        <div class="flex-grow md:w-1/6 md:flex-none">
            <div class="text-center py-4 bg-slate text-white">
                <div>.flex-grow</div>
                <div>.md:w-1/6</div>
                <div>.md:flex-none</div>
            </div>
        </div>
        <div class="flex-grow md:w-1/6 md:flex-none">
            <div class="text-center py-4 bg-slate-dark text-white">
                <div>.flex-grow</div>
                <div>.md:w-1/6</div>
                <div>.md:flex-none</div>
            </div>
        </div>
        <div class="flex-grow md:w-1/6 md:flex-none">
            <div class="text-center py-4 bg-slate text-white">
                <div>.flex-grow</div>
                <div>.md:w-1/6</div>
                <div>.md:flex-none</div>
            </div>
        </div>
    </div>
</div>


Use margin auto utilities to accomplish offsets:

<div class="bg-smoke-light font-semibold text-sm mb-6">
    <div class="text-slate p-4 leading-none">.flex.flex-wrap</div>
    <div class="flex flex-wrap">
        <div class="w-full md:w-1/3 md:ml-auto">
            <div class="text-center py-4 bg-slate-dark text-white">
                <div>.md:w-1/3</div>
                <div>.md:ml-auto</div>
            </div>
        </div>
        <div class="w-full md:w-1/3 md:mr-auto">
            <div class="text-center py-4 bg-slate text-white">
                <div>.md:w-1/6</div>
                <div>.md:mr-auto</div>
            </div>
        </div>
    </div>
</div>

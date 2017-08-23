---
extends: _layouts.markdown
title: "Grid"
---

# Grid

Basic grid example:

<div class="flex mb-6">
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/3
        </div>
    </div>
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:w-1/3
        </div>
    </div>
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/3
        </div>
    </div>
</div>

Columns don't need to fill a row:

<div class="flex mb-6">
    <div class="w-full md:w-1/4">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/4
        </div>
    </div>
    <div class="w-full md:w-1/4">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:w-1/4
        </div>
    </div>
    <div class="w-full md:w-1/4">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/4
        </div>
    </div>
</div>


Columns can be different widths:

<div class="flex mb-6">
    <div class="w-full md:w-1/4">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/4
        </div>
    </div>
    <div class="w-full md:w-1/2">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:w-1/2
        </div>
    </div>
    <div class="w-full md:w-1/4">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/4
        </div>
    </div>
</div>


Rows can overflow and wrap:

<div class="flex mb-6">
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/3
        </div>
    </div>
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:w-1/3
        </div>
    </div>
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/3
        </div>
    </div>
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:w-1/3
        </div>
    </div>
    <div class="w-full md:w-1/3">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/3
        </div>
    </div>
</div>


Column widths can be automatic:

<div class="flex mb-6">
    <div class="w-1/6 md:flex-fill">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:flex-fill
        </div>
    </div>
    <div class="w-1/6 md:flex-fill">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:flex-fill
        </div>
    </div>
    <div class="w-1/6 md:flex-fill">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:flex-fill
        </div>
    </div>
    <div class="w-1/6 md:flex-fill">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:flex-fill
        </div>
    </div>
    <div class="w-1/6 md:flex-fill">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:flex-fill
        </div>
    </div>
</div>


Fixed width columns are still respected even if a smaller screen has auto column widths:

<div class="flex mb-6">
    <div class="flex-fill md:w-1/6">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .flex-fill.md:w-1/6
        </div>
    </div>
    <div class="flex-fill md:w-1/6">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .flex-fill.md:w-1/6
        </div>
    </div>
    <div class="flex-fill md:w-1/6">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .flex-fill.md:w-1/6
        </div>
    </div>
    <div class="flex-fill md:w-1/6">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .flex-fill.md:w-1/6
        </div>
    </div>
    <div class="flex-fill md:w-1/6">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .flex-fill.md:w-1/6
        </div>
    </div>
</div>


Use margin auto utilities to accomplish offsets:

<div class="flex mb-6">
    <div class="w-full md:w-1/3 md:ml-auto">
        <div class="flex-center h-16 bg-dark-soft text-light">
            .md:w-1/3.md:ml-auto
        </div>
    </div>
    <div class="w-full md:w-1/3 md:mr-auto">
        <div class="flex-center h-16 bg-dark-softer text-light">
            .md:w-1/6.md:mr-auto
        </div>
    </div>
</div>

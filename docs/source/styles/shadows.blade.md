---
extends: _layouts.markdown
title: "Shadows"
---

# Shadows

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

## Usage

Box shadows can be applied using the shadow utilities. By default these are a linear scale, where the lower values represent smaller (shallow) shadows, and higher values represent bigger (deeper) shadows.

@component('_partials.code-sample', ['lang' => 'html'])
<div class="flex justify-around text-sm my-6">
    <div class="mr-3 p-4 bg-smoke-lighter shadow-inner">.shadow-inner</div>
    <div class="mr-3 p-4 shadow">.shadow</div>
    <div class="mr-3 p-4 shadow-md">.shadow-md</div>
    <div class="mr-3 p-4 shadow-lg">.shadow-lg</div>
</div>

@slot('code')
<div class="shadow-inner"></div>
<div class="shadow"></div>
<div class="shadow-2"></div>
<div class="shadow-3"></div>
<div class="shadow-4"></div>
<div class="shadow-5"></div>
@endslot
@endcomponent

## Responsive

## Customizing

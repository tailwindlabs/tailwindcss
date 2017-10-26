@extends('_layouts.markdown', ['title' => 'Flex Direction'])

@section('content')

<div class="font-semibold text-slate-light text-base uppercase tracking-wide mb-2">Flexbox</div>

<h1>Flex Direction</h1>

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

<p>Tailwind provides a comprehensive set of Flexbox utilities out of the box to make it easy for you to implement complex layouts without having to write any new CSS.</p>

<h2>Responsive</h2>

@component('_partials.responsive-code-sample')
@slot('none')
<div class="flex flex-row bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('sm')
<div class="flex flex-col bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('md')
<div class="flex flex-row-reverse bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('lg')
<div class="flex flex-col-reverse bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('xl')
<div class="flex flex-row bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endslot
@slot('code')
<div class="none:flex-row sm:flex-col md:flex-row-reverse lg:flex-col-reverse xl:flex-row ...">
    <!-- ... -->
</div>
@endslot
@endcomponent

<h2>Row <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span></h2>

<p>Use <code>.flex-row</code> to position flex items horizontally in the same direction as text:</p>

@component('_partials.code-sample')
<div class="flex flex-row bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

<h2>Row reversed</h2>

<p>Use <code>.flex-row-reverse</code> to position flex items horizontally in the opposite direction:</p>

@component('_partials.code-sample')
<div class="flex flex-row-reverse bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

<h2>Column</h2>

<p>Use <code>.flex-col</code> to position flex items vertically:</p>

@component('_partials.code-sample')
<div class="flex flex-col bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

<h2>Column reversed</h2>

<p>Use <code>.flex-col-reverse</code> to position flex items vertically in the opposite direction:</p>

@component('_partials.code-sample')
<div class="flex flex-col-reverse bg-smoke-light">
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">1</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">2</div>
    <div class="text-slate text-center bg-smoke px-4 py-2 m-2">3</div>
</div>
@endcomponent

@endsection

@extends('_layouts.master', ['title' => 'Position'])

@section('body')

<h1 class="title">Position</h1>

<p class="mt-6 mb-3 text-dark-soft">The position utilities are primarily <code>position</code> property helpers.</p>

<p class="mt-6 mb-3">Using the utilities in HTML:</p>

<pre class="language-html"><code>{{ '<div class="fixed"></div>
<div class="absolute"></div>
<div class="relative"></div>' }}</code></pre>

<p class="mt-6 mb-3">Using the utilities in Less:</p>

<pre class="language-less"><code>div {
  .fixed;
  .absolute;
  .relative;
}</code></pre>

<h2 class="subtitle">Pinning absolute content</h2>

<p class="mt-6 mb-3">Tailwind also provides pin utilties, useful for "pinning" absolutely positioned elements using the <code>top</code>, <code>right</code>, <code>bottom</code> and <code>left</code> properties.</p>

<p class="mt-6 mb-3">Using the utilities in HTML:</p>

<pre class="language-html"><code>{{ '<div class="relative">
    <div class="absolute pin-t"></div>
</div>' }}</code></pre>

<p class="mt-6 mb-3">Using the utilities in Less:</p>

<pre class="language-less"><code>div {
  .pin-t
  .pin-r
  .pin-b
  .pin-l
  .pin-y
  .pin-x
  .pin
}</code></pre>

@endsection

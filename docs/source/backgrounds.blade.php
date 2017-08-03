@extends('_layouts.master', ['title' => 'Backgrounds'])

@section('body')

<h1 class="title">Backgrounds</h1>

<p class="mt-6 mb-3">Using the utilities in HTML:</p>

<pre class="language-html"><code>{{ '<div class="bg-light"></div>
<div class="bg-light-soft"></div>
<div class="bg-light-softer"></div>
<div class="bg-light-softest"></div>

<div class="bg-dark"></div>
<div class="bg-dark-soft"></div>
<div class="bg-dark-softer"></div>
<div class="bg-dark-softest"></div>

<!-- Responsive example -->
<div class="bg-dark sm:bg-dark-soft md:bg-dark-softer"></div>' }}</code></pre>

<p class="mt-6 mb-3">Using the utilities in Less:</p>

<pre class="language-less"><code>div {
  .bg-light;
  .bg-light-soft;
  .bg-light-softer;
  .bg-light-softest;

  .bg-dark;
  .bg-dark-soft;
  .bg-dark-softer;
  .bg-dark-softest;

  // Responsive example
  .screen(lg, {
      .bg-light;
  });
}</code></pre>

<h2 class="subtitle">Custom backgrounds</h2>

<p class="mt-6 mb-3">Generate custom background utilities:</p>

<pre class="language-less"><code>.define-text-color('primary';
  default #3498db,
  'light' #a0cfee,
  'dark'  #2980b9
;);</code></pre>

<p class="mt-6 mb-3">Using custom background utilities in HTML:</p>

<pre class="language-html"><code>{{ '<div class="bg-primary"></div>
<div class="bg-primary-light"></div>
<div class="bg-primary-dark"></div>

<!-- Responsive example -->
<div class="bg-primary sm:bg-primary-dark"></div>' }}</code></pre>

<p class="mt-6 mb-3">Using custom background utilities in Less:</p>

<pre class="language-less"><code>div {
  .bg-primary;
  .bg-primary-light;
  .bg-primary-dark;

  // Responsive example
  .screen(lg, {
      .bg-primary;
  });
}</code></pre>

@endsection

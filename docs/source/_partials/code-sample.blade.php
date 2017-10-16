<div class="border border-dark-softer rounded mask mb-4">
  <div class="p-6 border-b border-dark-softer">
    {{ $slot }}
  </div>
  <div>
    <pre class="markdown language-{{ $lang }}" style="margin: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

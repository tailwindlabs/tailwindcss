<div class="border border-smoke rounded mask mb-4">
  <div class="p-6 border-b border-smoke text-center">
    {{ $slot }}
  </div>
  <div>
    <pre class="markdown language-{{ $lang }}" style="margin: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

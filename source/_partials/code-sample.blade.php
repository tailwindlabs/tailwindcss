<div class="relative rounded overflow-hidden mb-8 bg-white">
  <div class="border border-gray-400 p-4 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div class="p-4 bg-gray-800">
    <pre class="language-{{ $lang ?? 'html' }}" style="margin: 0; padding: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

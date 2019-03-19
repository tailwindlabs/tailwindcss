<div class="relative rounded overflow-hidden border border-grey-light mb-8 bg-white">
  <div class="border-b border-grey-light p-4 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div class="p-4 bg-gray-100">
    <pre class="language-{{ $lang ?? 'html' }}" style="margin: 0; padding: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

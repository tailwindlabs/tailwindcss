<div class="relative mb-8">
  <div class="bg-white rounded-t-lg border border-gray-400 p-4 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div class="rounded-b-lg p-4 bg-gray-800">
    <pre class="language-{{ $lang ?? 'html' }}" style="margin: 0; padding: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

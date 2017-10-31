<div class="rounded mask border-2 border-smoke mb-8 bg-white">
  <div class="border-b-2 border-smoke p-4 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div class="p-4 bg-smoke-lighter">
    <pre class="language-{{ $lang ?? 'html' }}" style="margin: 0; padding: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

<div class="rounded mask shadow mb-4">
  <div class="bg-white border-b-2 border-smoke p-6 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div>
    <pre class="markdown language-{{ $lang }}" style="margin: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

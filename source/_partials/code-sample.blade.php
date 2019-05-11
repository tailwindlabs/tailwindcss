<div class="relative overflow-hidden mb-8">
  <div v-pre class="bg-white rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 p-4 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div v-pre class="rounded-b-lg bg-gray-800">
    <pre class="scrollbar-none m-0 p-0 language-{{ $lang ?? 'html' }}"><code class="inline-block p-4 scrolling-touch">{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

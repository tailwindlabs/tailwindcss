<div class="relative overflow-hidden mb-8">
  <div v-pre class="bg-white rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 p-4 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div v-pre class="scollbar-none rounded-b-lg p-4 bg-gray-800">
    <pre class="scrollbar-none language-{{ $lang ?? 'html' }}" style="margin: 0; padding: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>

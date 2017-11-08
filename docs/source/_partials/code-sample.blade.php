@if($interactive ?? false)
<code-sample-editor :options="{ tabSize: 2 }" className="{{ $class ?? '' }}" code="{{ e($code ?? $slot) }}"></code-sample-editor>
@else
<div class="rounded overflow-hidden border-2 border-grey-light mb-8 bg-white">
  <div class="border-b-2 border-grey-light p-4 {{ $class ?? '' }}">
    {{ $slot }}
  </div>
  <div class="p-4 bg-grey-lightest">
    <pre class="language-{{ $lang ?? 'html' }}" style="margin: 0; padding: 0;"><code>{{ e($code ?? $slot) }}</code></pre>
  </div>
</div>
@endif

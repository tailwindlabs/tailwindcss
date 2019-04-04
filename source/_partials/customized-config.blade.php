@php
$keyDepth = substr_count($key, '.');
$usesTheme = $usesTheme ?? false;
@endphp
<div class="rounded-lg mb-8 overflow-hidden">
  <div class="bg-gray-800 p-4 font-mono text-sm overflow-x-scroll whitespace-no-wrap">
    <div class="whitespace-pre text-gray-400">// tailwind.config.js</div>
    <div class="whitespace-pre text-gray-200">module.exports = {</div>
    {!! collect(explode('.', $key))->map(function ($configKey, $index) use ($keyDepth, $usesTheme) {
      $configKey = str_repeat('  ', $index + 1) . $configKey;
      $suffix = ': {';
      if ($index === $keyDepth) {
        $configKey = '<span style="color: #f9ee98;">' . $configKey . '</span>';
        $suffix = $usesTheme ? ': theme => ({' : $suffix;
      }
      return '<div class="whitespace-pre text-gray-200">' . $configKey . $suffix . '</div>';
    })->implode("\n") !!}
    <div>{!! collect(explode("\n", $slot))->map(function ($line) use ($keyDepth) {
      $indentation = str_repeat('&nbsp;&nbsp;', $keyDepth + 1);
      if (starts_with($line, '+')) {
        return '<div style="color: #a8ff60;"><span>+</span>&nbsp;' . $indentation . e(trim(substr($line, 1))) . '</div>';
      }
      if (starts_with($line, '-')) {
        return '<div class="text-gray-500"><span>-</span>&nbsp;' . $indentation . e(trim(substr($line, 1))) . '</div>';
      }
      if (starts_with($line, '//')) {
        return '<div class="text-gray-400">&nbsp;&nbsp;' . $indentation . e(trim($line)) . '</div>';
      }
      return '<div class="text-gray-300">&nbsp;&nbsp;' . $indentation . e(trim($line)) . '</div>';
    })->implode("\n") !!}</div>
    {!! collect(range($keyDepth, 0))->map(function ($depth) use ($keyDepth, $usesTheme) {
      $closingBrace = $usesTheme && $depth === $keyDepth ? '})' : '}';
      return '<div class="whitespace-pre text-gray-200">' . str_repeat('  ', $depth + 1) . $closingBrace . '</div>';
    })->implode("\n") !!}
    <div class="whitespace-pre text-gray-200">}</div>
  </div>
</div>

@php
  $scroll = isset($scroll) ? $scroll : true;
  $scroll = (count($rows) > 12 && ($scroll !== false));
@endphp

<h2 style="visibility: hidden; font-size: 0; margin: 0;">Class reference</h2>
<div class="border-t border-b border-grey-light overflow-hidden relative">
  <div class="{{ $scroll ? 'lg:max-h-sm' : '' }} overflow-y-auto scrollbar-w-2 scrollbar-track-grey-lighter scrollbar-thumb-rounded scrollbar-thumb-grey scrolling-touch">
    <table class="w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="text-sm font-semibold text-gray-700 p-2 bg-gray-100">Class</th>
          <th class="text-sm font-semibold text-gray-700 p-2 bg-gray-100">Properties</th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        @foreach ($rows as $row)
        <tr>
          <td class="p-2 border-t {{ $loop->first ? 'border-grey-light' : 'border-grey-lighter' }} font-mono text-xs text-purple-dark whitespace-no-wrap">{!! $row[0] !!}</td>
          <td class="p-2 border-t {{ $loop->first ? 'border-grey-light' : 'border-grey-lighter' }} font-mono text-xs text-blue-dark whitespace-pre">{!! $row[1] !!}</td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>

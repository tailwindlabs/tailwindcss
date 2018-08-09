@php
  $scroll = isset($scroll) ? $scroll : true;
  $scroll = (count($rows) > 12 && ($scroll !== false));
@endphp

<h2 style="visibility: hidden; font-size: 0; margin: 0;">Class reference</h2>
<div class="border-t border-b border-grey-light overflow-hidden relative">
  <div class="{{ $scroll ? 'lg:max-h-xs' : '' }} overflow-y-auto scrollbar-w-2 scrollbar-track-grey-lighter scrollbar-thumb-rounded scrollbar-thumb-grey scrolling-touch">
    <table class="relative w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="z-20 sticky pin-t text-sm font-semibold text-grey-darker bg-grey-lightest p-0">
            <div class="p-2 border-b border-grey-light">Class</div>
          </th>
          <th class="relative z-20 sticky pin-t text-sm font-semibold text-grey-darker bg-grey-lightest p-0" colspan="2">
            <div class="sm:hidden absolute pin p-2 border-b border-grey-light"></div>
            <div class="hidden sm:block p-2 border-b border-grey-light">Properties</div>
          </th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        @foreach ($rows as $row)
        <tr>
          <td class="p-2 {{ $loop->first ? '' : 'border-t border-grey-lighter' }} font-mono text-xs text-purple-dark whitespace-no-wrap">{!! $row[0] !!}</td>
          <td class="hidden sm:table-cell p-2 {{ $loop->first ? '' : 'border-t border-grey-lighter' }} font-mono text-xs text-blue-dark whitespace-pre">{!! $row[1] !!}</td>
          <td class="w-16 p-2 font-mono text-xs text-blue-dark whitespace-pre {!! substr($row[0], 1) !!}" {!! $row[0] === '.bg-transparent' ? 'style="background-image: url(\'/img/transparent-bg.svg\')"' : '' !!}></td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>

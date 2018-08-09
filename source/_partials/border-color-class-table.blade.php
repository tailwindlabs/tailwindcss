<h2 style="visibility: hidden; font-size: 0; margin: 0;">Class reference</h2>
<div class="border-t border-b border-grey-light overflow-hidden relative">
  <div class="overflow-y-auto">
    <table class="relative w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="sticky pin-t text-sm font-semibold text-grey-darker bg-grey-lightest p-0">
            <div class="p-2 border-b border-grey-light">Class</div>
          </th>
          <th class="sticky pin-t text-sm font-semibold text-grey-darker bg-grey-lightest p-0" colspan="2">
            <div class="p-2 border-b border-grey-light">Properties</div>
          </th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        @foreach ($rows as $row)
        <tr>
          <td class="p-2 {{ $loop->first ? '' : 'border-t border-grey-lighter' }} font-mono text-xs text-purple-dark whitespace-no-wrap">{!! $row[0] !!}</td>
          <td class="p-2 {{ $loop->first ? '' : 'border-t border-grey-lighter' }} font-mono text-xs text-blue-dark whitespace-pre">{!! $row[1] !!}</td>
          <td class="relative w-16 p-2 {{ $loop->first ? '' : 'border-t border-grey-lighter' }} font-mono text-xs text-blue-dark whitespace-pre">
            <div class="absolute pin m-2 border {{ substr($row[0], 1) }}"></div>
          </td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>

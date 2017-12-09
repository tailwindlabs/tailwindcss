---
extends: _layouts.documentation
title: "Overflow"
description: "Utilities for controlling how an element handles content that is too large for the container."
features:
  responsive: true
  customizable: false
  hover: false
  focus: false
---

@include('_partials.class-table', [
  'rows' => [
    [
      '.overflow-visible',
      'overflow: visible;',
      "Don't clip content that overflows the element.",
    ],
    [
      '.overflow-auto',
      'overflow: auto;',
      "Add scrollbars to an element if needed.",
    ],
    [
      '.overflow-hidden',
      'overflow: hidden;',
      "Clip any content that overflows the element.",
    ],
    [
      '.overflow-x-scroll',
      'overflow-x: auto;',
      "Allow horizontal scrolling if needed.",
    ],
    [
      '.overflow-y-scroll',
      'overflow-y: auto;',
      "Allow vertical scrolling if needed.",
    ],
    [
      '.overflow-scroll',
      'overflow: scroll;',
      "Add scrollbars to an element.",
    ],
    [
      '.scrolling-touch',
      '-webkit-overflow-scrolling: touch;',
      "Use momentum-based scrolling on touch devices.",
    ],
    [
      '.scrolling-auto',
      '-webkit-overflow-scrolling: auto;',
      "Use \"regular\" scrolling on touch devices.",
    ],
  ]
])

### Visible <span class="ml-2 font-semibold text-grey-dark text-sm uppercase tracking-wide">Default</span>

Use `.overflow-visible` to prevent content within an element from being clipped. Note that any content that overflows the bounds of the element will then be visible.

@component('_partials.code-sample')
<div class="overflow-hidden h-24">
  <div class="overflow-visible h-32 bg-grey-light text-grey-darker p-2">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
  </div>
</div>
@slot('code')
<div class="overflow-visible h-32 ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

### Auto

Use `.overflow-auto` to add scrollbars to an element in the event that its content overflows the bounds of that element. Unlike `.overflow-scroll`, which always show scrollbars, this utility will only show them if scrolling is necessary.

@component('_partials.code-sample')
<div class="overflow-scroll h-32 bg-grey-light text-grey-darker p-2">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
</div>
@slot('code')
<div class="overflow-scroll h-32 ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

### Hidden

Use `.overflow-hidden` to clip any content within an element that overflows the bounds of that element.

@component('_partials.code-sample')
<div class="overflow-hidden h-32 bg-grey-light text-grey-darker p-2">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
</div>
@slot('code')
<div class="overflow-hidden h-32 ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

### Scroll horizontally

Use `.overflow-x-scroll` to allow horizontal scrolling if needed.

@component('_partials.code-sample')
<div class="overflow-scroll bg-grey-light text-grey-darker p-2">
  QrLmmW69vMQDtCOg48jidqvvWD2FzDt7I7bBoDc98SRP5OwvOScVYbRzFdfp540eF5v1pjogYkyI8NXqu4wY8chgsXIV0LU7XQKWJ98wLaBSHWiBhvkEU1T3sd6KEFo53CLjVjIz8UvZajb8sbsu62xTsF9cRtFdwEvusq6zJHvedymDCUkY6qXHsuL6fOmHo4KKMurZuJZrK3plRPUaI8XVciz8dVq5CEUXjMrTcB76H1w90CnkRER3nYjs3suTa3223xs8aL97m0peQfjlvKbF8HcmQG5mHEitCn1QZnbMZUK3zE9AIjwcVXP7R9V4fw2A93cZD7wj333X6aaiHZdkkTPtst0u05KSob5c0ZuKQi4D3V395NfFKKr8cR27jmpB7dqK2GiWXeOQUFcjmFVwlHWSlH8ZdUoVJpXf1xL6CRUxwZP4EhBbqQZaJm26ijWII6LRxJ5eVU9Y7KKvQsUeX5BawtgeMWRmjeCwQadTLTQG8gLpi2DvGpMtPWCdqHgEglVSB1ZlDrjEEsXYrNx1IOY0053K3pWNaR1ezyz8kahRfNs3byaHcIQu9tWTrcMpBWhZ45DzLjVV1N8Zt96uLnNWK5DvbKW8GgMuwY7fHkZFz85MN4d2gL0j85HmXGx9oPTFRkPWsmMOHUvm5IhB7QqGSAwT1uL7HgBrNX9a1BAWrp9zV1IWAd1q65sKOOCxTZrXJDpxBxYE4rJAGU6pcri9mUf4g49ZiIAwfu9njtZyYimmImCa6TFhk2jQcSmFDHacExxqC2BfYATHFrKSy94dbw6uWT52nM7MSM9JDu4cs9cbfnaf6amt4hTUotCTONg604b8JKPI1sfd4CG36fBNcnErhpllfRlXkY1xFwmwZT7IJV8okPGNQdTKpdPJOBGw3LHMKojPJl1nPiQB5C9bdePFMNLejSXY5DDvO70ehOCJpBtKZY2quoFJJjGfXe8T4DuGYGmM6JYd5DNinWZuUWXGvfIlJRHgf8BQNQvtmEzqGXIeQZitiq9F
</div>

@slot('code')
<div class="overflow-x-scroll ...">QrLmmW69vMQD...</div>
@endslot
@endcomponent

### Scroll vertically

Use `.overflow-y-scroll` to allow horizontal scrolling if needed.

@component('_partials.code-sample')
<div class="overflow-scroll h-32 bg-grey-light text-grey-darker p-2">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
</div>

@slot('code')
<div class="overflow-scroll h-32 ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

### Scroll in all directions

Use `.overflow-scroll` to add scrollbars to an element. Unlike `.overflow-auto`, which only shows scrollbars if they are necessary, this utility always shows them. Note that some operating systems, like MacOS, hide unnecessary scrollbars regardless of this setting.

@component('_partials.code-sample')
<p class="text-sm text-grey-dark mb-1">Scroll horizontally when content can't wrap</p>
<div class="overflow-scroll bg-grey-light text-grey-darker p-2 mb-6">
  QrLmmW69vMQDtCOg48jidqvvWD2FzDt7I7bBoDc98SRP5OwvOScVYbRzFdfp540eF5v1pjogYkyI8NXqu4wY8chgsXIV0LU7XQKWJ98wLaBSHWiBhvkEU1T3sd6KEFo53CLjVjIz8UvZajb8sbsu62xTsF9cRtFdwEvusq6zJHvedymDCUkY6qXHsuL6fOmHo4KKMurZuJZrK3plRPUaI8XVciz8dVq5CEUXjMrTcB76H1w90CnkRER3nYjs3suTa3223xs8aL97m0peQfjlvKbF8HcmQG5mHEitCn1QZnbMZUK3zE9AIjwcVXP7R9V4fw2A93cZD7wj333X6aaiHZdkkTPtst0u05KSob5c0ZuKQi4D3V395NfFKKr8cR27jmpB7dqK2GiWXeOQUFcjmFVwlHWSlH8ZdUoVJpXf1xL6CRUxwZP4EhBbqQZaJm26ijWII6LRxJ5eVU9Y7KKvQsUeX5BawtgeMWRmjeCwQadTLTQG8gLpi2DvGpMtPWCdqHgEglVSB1ZlDrjEEsXYrNx1IOY0053K3pWNaR1ezyz8kahRfNs3byaHcIQu9tWTrcMpBWhZ45DzLjVV1N8Zt96uLnNWK5DvbKW8GgMuwY7fHkZFz85MN4d2gL0j85HmXGx9oPTFRkPWsmMOHUvm5IhB7QqGSAwT1uL7HgBrNX9a1BAWrp9zV1IWAd1q65sKOOCxTZrXJDpxBxYE4rJAGU6pcri9mUf4g49ZiIAwfu9njtZyYimmImCa6TFhk2jQcSmFDHacExxqC2BfYATHFrKSy94dbw6uWT52nM7MSM9JDu4cs9cbfnaf6amt4hTUotCTONg604b8JKPI1sfd4CG36fBNcnErhpllfRlXkY1xFwmwZT7IJV8okPGNQdTKpdPJOBGw3LHMKojPJl1nPiQB5C9bdePFMNLejSXY5DDvO70ehOCJpBtKZY2quoFJJjGfXe8T4DuGYGmM6JYd5DNinWZuUWXGvfIlJRHgf8BQNQvtmEzqGXIeQZitiq9F
</div>

<p class="text-sm text-grey-dark mb-1">Scroll vertically when content can wrap</p>
<div class="overflow-scroll h-32 bg-grey-light text-grey-darker p-2 mb-6">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
</div>

<p class="text-sm text-grey-dark mb-1">Scroll both horizontally and vertically when some content can't wrap</p>
<div class="overflow-scroll h-32 bg-grey-light text-grey-darker p-2">
  Loremipsumdolorsitamet,consecteturadipiscingelit.Mauriseleifendrutrumauctor.Phasellusconvallissagittisaugueutornare.Donecexlorem,auctoreurutrumin,blanditiddolor.Nullamolestiearcuturpis.Inidfelisvulputate,tempormassaeget,malesuadamauris.Quisquefringillaconsequatmetus,luctusscelerisqueleofringillavel. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel. Ullam repudiandae omnis tempora soluta non, sed corporis vel reiciendis reprehenderit vitae nobis dolorum maiores eaque eos nemo mollitia animi, adipisci, molestias? Nam quo odio, similique iure, molestias ullam! Temporibus vel ab, fuga, ut nihil fugiat quaerat tenetur veniam, excepturi natus hic dolorum fugit. Ab sint molestiae nihil ex, minima facere sit adipisci. Totam quos eveniet, quibusdam qui quis aperiam aut nihil perferendis earum in error. Autem porro deleniti molestiae odio delectus alias dolorem nihil voluptates a, quam corrupti sapiente, nulla ea omnis quas ipsam rerum atque excepturi! Corporis culpa asperiores sint voluptatum, quos, cupiditate iste similique illum quas libero, temporibus laborum quisquam esse veritatis eligendi qui odit quo repellat!
</div>
@slot('code')
<div class="overflow-scroll ...">QrLmmW69vMQD...</div>
<div class="overflow-scroll h-32 ...">Lorem ipsum dolor sit amet...</div>
<div class="overflow-scroll h-32 ...">Loremipsumdolorsitamet...</div>
@endslot
@endcomponent

### Momentum-based scrolling on touch devices

Use `.scrolling-touch` to use momentum-based scrolling (where supported) on touch devices.

@component('_partials.code-sample')
<div class="scrolling-touch overflow-auto h-32 bg-grey-light text-grey-darker p-2">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
</div>
@slot('code')
<div class="scrolling-touch overflow-auto h-32 ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

Use `.scrolling-auto` to use normal non-momentum-based scrolling on touch devices.

This is mostly useful for undoing `.scrolling-touch` at larger screen sizes.

@component('_partials.code-sample')
<div class="scrolling-auto overflow-auto h-32 bg-grey-light text-grey-darker p-2">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
</div>
@slot('code')
<div class="scrolling-auto overflow-auto h-32 ...">Lorem ipsum dolor sit amet...</div>
@endslot
@endcomponent

## Responsive

To apply an overflow utility only at a specific breakpoint, add a `{screen}:` prefix to the existing class name. For example, adding the class `md:overflow-scroll` to an element would apply the `overflow-scroll` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/docs/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
<div class="overflow-auto h-32 bg-grey-light text-grey-darker p-2">
  QrLmmW69vMQDtCOg48jidqvvWD2FzDt7I7bBoDc98SRP5OwvOScVYbRzFdfp540eF5v1pjogYkyI8NXqu4wY8chgsXIV0LU7XQKWJ98wLaBSHWiBhvkEU1T3sd6KEFo53CLjVjIz8UvZajb8sbsu62xTsF9cRtFdwEvusq6zJHvedymDCUkY6qXHsuL6fOmHo4KKMurZuJZrK3plRPUaI8XVciz8dVq5CEUXjMrTcB76H1w90CnkRER3nYjs3suTa3223xs8aL97m0peQfjlvKbF8HcmQG5mHEitCn1QZnbMZUK3zE9AIjwcVXP7R9V4fw2A93cZD7wj333X6aaiHZdkkTPtst0u05KSob5c0ZuKQi4D3V395NfFKKr8cR27jmpB7dqK2GiWXeOQUFcjmFVwlHWSlH8ZdUoVJpXf1xL6CRUxwZP4EhBbqQZaJm26ijWII6LRxJ5eVU9Y7KKvQsUeX5BawtgeMWRmjeCwQadTLTQG8gLpi2DvGpMtPWCdqHgEglVSB1ZlDrjEEsXYrNx1IOY0053K3pWNaR1ezyz8kahRfNs3byaHcIQu9tWTrcMpBWhZ45DzLjVV1N8Zt96uLnNWK5DvbKW8GgMuwY7fHkZFz85MN4d2gL0j85HmXGx9oPTFRkPWsmMOHUvm5IhB7QqGSAwT1uL7HgBrNX9a1BAWrp9zV1IWAd1q65sKOOCxTZrXJDpxBxYE4rJAGU6pcri9mUf4g49ZiIAwfu9njtZyYimmImCa6TFhk2jQcSmFDHacExxqC2BfYATHFrKSy94dbw6uWT52nM7MSM9JDu4cs9cbfnaf6amt4hTUotCTONg604b8JKPI1sfd4CG36fBNcnErhpllfRlXkY1xFwmwZT7IJV8okPGNQdTKpdPJOBGw3LHMKojPJl1nPiQB5C9bdePFMNLejSXY5DDvO70ehOCJpBtKZY2quoFJJjGfXe8T4DuGYGmM6JYd5DNinWZuUWXGvfIlJRHgf8BQNQvtmEzqGXIeQZitiq9F

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.
</div>
@endslot
@slot('sm')
<div class="overflow-visible h-32 bg-grey-light text-grey-darker p-2">
  QrLmmW69vMQDtCOg48jidqvvWD2FzDt7I7bBoDc98SRP5OwvOScVYbRzFdfp540eF5v1pjogYkyI8NXqu4wY8chgsXIV0LU7XQKWJ98wLaBSHWiBhvkEU1T3sd6KEFo53CLjVjIz8UvZajb8sbsu62xTsF9cRtFdwEvusq6zJHvedymDCUkY6qXHsuL6fOmHo4KKMurZuJZrK3plRPUaI8XVciz8dVq5CEUXjMrTcB76H1w90CnkRER3nYjs3suTa3223xs8aL97m0peQfjlvKbF8HcmQG5mHEitCn1QZnbMZUK3zE9AIjwcVXP7R9V4fw2A93cZD7wj333X6aaiHZdkkTPtst0u05KSob5c0ZuKQi4D3V395NfFKKr8cR27jmpB7dqK2GiWXeOQUFcjmFVwlHWSlH8ZdUoVJpXf1xL6CRUxwZP4EhBbqQZaJm26ijWII6LRxJ5eVU9Y7KKvQsUeX5BawtgeMWRmjeCwQadTLTQG8gLpi2DvGpMtPWCdqHgEglVSB1ZlDrjEEsXYrNx1IOY0053K3pWNaR1ezyz8kahRfNs3byaHcIQu9tWTrcMpBWhZ45DzLjVV1N8Zt96uLnNWK5DvbKW8GgMuwY7fHkZFz85MN4d2gL0j85HmXGx9oPTFRkPWsmMOHUvm5IhB7QqGSAwT1uL7HgBrNX9a1BAWrp9zV1IWAd1q65sKOOCxTZrXJDpxBxYE4rJAGU6pcri9mUf4g49ZiIAwfu9njtZyYimmImCa6TFhk2jQcSmFDHacExxqC2BfYATHFrKSy94dbw6uWT52nM7MSM9JDu4cs9cbfnaf6amt4hTUotCTONg604b8JKPI1sfd4CG36fBNcnErhpllfRlXkY1xFwmwZT7IJV8okPGNQdTKpdPJOBGw3LHMKojPJl1nPiQB5C9bdePFMNLejSXY5DDvO70ehOCJpBtKZY2quoFJJjGfXe8T4DuGYGmM6JYd5DNinWZuUWXGvfIlJRHgf8BQNQvtmEzqGXIeQZitiq9F

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.</div>
@endslot
@slot('md')
<div class="overflow-hidden h-32 bg-grey-light text-grey-darker p-2">
  QrLmmW69vMQDtCOg48jidqvvWD2FzDt7I7bBoDc98SRP5OwvOScVYbRzFdfp540eF5v1pjogYkyI8NXqu4wY8chgsXIV0LU7XQKWJ98wLaBSHWiBhvkEU1T3sd6KEFo53CLjVjIz8UvZajb8sbsu62xTsF9cRtFdwEvusq6zJHvedymDCUkY6qXHsuL6fOmHo4KKMurZuJZrK3plRPUaI8XVciz8dVq5CEUXjMrTcB76H1w90CnkRER3nYjs3suTa3223xs8aL97m0peQfjlvKbF8HcmQG5mHEitCn1QZnbMZUK3zE9AIjwcVXP7R9V4fw2A93cZD7wj333X6aaiHZdkkTPtst0u05KSob5c0ZuKQi4D3V395NfFKKr8cR27jmpB7dqK2GiWXeOQUFcjmFVwlHWSlH8ZdUoVJpXf1xL6CRUxwZP4EhBbqQZaJm26ijWII6LRxJ5eVU9Y7KKvQsUeX5BawtgeMWRmjeCwQadTLTQG8gLpi2DvGpMtPWCdqHgEglVSB1ZlDrjEEsXYrNx1IOY0053K3pWNaR1ezyz8kahRfNs3byaHcIQu9tWTrcMpBWhZ45DzLjVV1N8Zt96uLnNWK5DvbKW8GgMuwY7fHkZFz85MN4d2gL0j85HmXGx9oPTFRkPWsmMOHUvm5IhB7QqGSAwT1uL7HgBrNX9a1BAWrp9zV1IWAd1q65sKOOCxTZrXJDpxBxYE4rJAGU6pcri9mUf4g49ZiIAwfu9njtZyYimmImCa6TFhk2jQcSmFDHacExxqC2BfYATHFrKSy94dbw6uWT52nM7MSM9JDu4cs9cbfnaf6amt4hTUotCTONg604b8JKPI1sfd4CG36fBNcnErhpllfRlXkY1xFwmwZT7IJV8okPGNQdTKpdPJOBGw3LHMKojPJl1nPiQB5C9bdePFMNLejSXY5DDvO70ehOCJpBtKZY2quoFJJjGfXe8T4DuGYGmM6JYd5DNinWZuUWXGvfIlJRHgf8BQNQvtmEzqGXIeQZitiq9F

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.</div>
@endslot
@slot('lg')
<div class="overflow-x-scroll h-32 bg-grey-light text-grey-darker p-2">
  QrLmmW69vMQDtCOg48jidqvvWD2FzDt7I7bBoDc98SRP5OwvOScVYbRzFdfp540eF5v1pjogYkyI8NXqu4wY8chgsXIV0LU7XQKWJ98wLaBSHWiBhvkEU1T3sd6KEFo53CLjVjIz8UvZajb8sbsu62xTsF9cRtFdwEvusq6zJHvedymDCUkY6qXHsuL6fOmHo4KKMurZuJZrK3plRPUaI8XVciz8dVq5CEUXjMrTcB76H1w90CnkRER3nYjs3suTa3223xs8aL97m0peQfjlvKbF8HcmQG5mHEitCn1QZnbMZUK3zE9AIjwcVXP7R9V4fw2A93cZD7wj333X6aaiHZdkkTPtst0u05KSob5c0ZuKQi4D3V395NfFKKr8cR27jmpB7dqK2GiWXeOQUFcjmFVwlHWSlH8ZdUoVJpXf1xL6CRUxwZP4EhBbqQZaJm26ijWII6LRxJ5eVU9Y7KKvQsUeX5BawtgeMWRmjeCwQadTLTQG8gLpi2DvGpMtPWCdqHgEglVSB1ZlDrjEEsXYrNx1IOY0053K3pWNaR1ezyz8kahRfNs3byaHcIQu9tWTrcMpBWhZ45DzLjVV1N8Zt96uLnNWK5DvbKW8GgMuwY7fHkZFz85MN4d2gL0j85HmXGx9oPTFRkPWsmMOHUvm5IhB7QqGSAwT1uL7HgBrNX9a1BAWrp9zV1IWAd1q65sKOOCxTZrXJDpxBxYE4rJAGU6pcri9mUf4g49ZiIAwfu9njtZyYimmImCa6TFhk2jQcSmFDHacExxqC2BfYATHFrKSy94dbw6uWT52nM7MSM9JDu4cs9cbfnaf6amt4hTUotCTONg604b8JKPI1sfd4CG36fBNcnErhpllfRlXkY1xFwmwZT7IJV8okPGNQdTKpdPJOBGw3LHMKojPJl1nPiQB5C9bdePFMNLejSXY5DDvO70ehOCJpBtKZY2quoFJJjGfXe8T4DuGYGmM6JYd5DNinWZuUWXGvfIlJRHgf8BQNQvtmEzqGXIeQZitiq9F

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.</div>
@endslot
@slot('xl')
<div class="overflow-y-scroll h-32 bg-grey-light text-grey-darker p-2">
  QrLmmW69vMQDtCOg48jidqvvWD2FzDt7I7bBoDc98SRP5OwvOScVYbRzFdfp540eF5v1pjogYkyI8NXqu4wY8chgsXIV0LU7XQKWJ98wLaBSHWiBhvkEU1T3sd6KEFo53CLjVjIz8UvZajb8sbsu62xTsF9cRtFdwEvusq6zJHvedymDCUkY6qXHsuL6fOmHo4KKMurZuJZrK3plRPUaI8XVciz8dVq5CEUXjMrTcB76H1w90CnkRER3nYjs3suTa3223xs8aL97m0peQfjlvKbF8HcmQG5mHEitCn1QZnbMZUK3zE9AIjwcVXP7R9V4fw2A93cZD7wj333X6aaiHZdkkTPtst0u05KSob5c0ZuKQi4D3V395NfFKKr8cR27jmpB7dqK2GiWXeOQUFcjmFVwlHWSlH8ZdUoVJpXf1xL6CRUxwZP4EhBbqQZaJm26ijWII6LRxJ5eVU9Y7KKvQsUeX5BawtgeMWRmjeCwQadTLTQG8gLpi2DvGpMtPWCdqHgEglVSB1ZlDrjEEsXYrNx1IOY0053K3pWNaR1ezyz8kahRfNs3byaHcIQu9tWTrcMpBWhZ45DzLjVV1N8Zt96uLnNWK5DvbKW8GgMuwY7fHkZFz85MN4d2gL0j85HmXGx9oPTFRkPWsmMOHUvm5IhB7QqGSAwT1uL7HgBrNX9a1BAWrp9zV1IWAd1q65sKOOCxTZrXJDpxBxYE4rJAGU6pcri9mUf4g49ZiIAwfu9njtZyYimmImCa6TFhk2jQcSmFDHacExxqC2BfYATHFrKSy94dbw6uWT52nM7MSM9JDu4cs9cbfnaf6amt4hTUotCTONg604b8JKPI1sfd4CG36fBNcnErhpllfRlXkY1xFwmwZT7IJV8okPGNQdTKpdPJOBGw3LHMKojPJl1nPiQB5C9bdePFMNLejSXY5DDvO70ehOCJpBtKZY2quoFJJjGfXe8T4DuGYGmM6JYd5DNinWZuUWXGvfIlJRHgf8BQNQvtmEzqGXIeQZitiq9F

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend rutrum auctor. Phasellus convallis sagittis augue ut ornare. Vestibulum et gravida lectus, sed ultrices sapien. Nullam aliquet elit dui, vitae hendrerit lectus volutpat eget. In porttitor tincidunt egestas. Pellentesque laoreet ligula at est vulputate facilisis. Etiam tristique justo ut odio placerat ornare. Cras bibendum, orci at ornare tincidunt, lacus nunc gravida enim, sit amet euismod nunc lectus in lectus. Ut dictum nulla et arcu aliquet ornare. Aliquam et dapibus lectus. Aenean mattis elit mi, sed ultricies augue consectetur id. Sed id magna malesuada, luctus urna a, bibendum tortor. Cras cursus cursus ex. Nulla fringilla elit vitae imperdiet scelerisque. Donec ac sem eu diam convallis mollis a sed leo. Proin congue augue turpis, eget rutrum dolor ultricies non. Nulla blandit venenatis dapibus. Sed tincidunt mollis elit, quis suscipit nibh eleifend quis. Donec ex lorem, auctor eu rutrum in, blandit id dolor. Nulla molestie arcu turpis. In id felis vulputate, tempor massa eget, malesuada mauris. Quisque fringilla consequat metus, luctus scelerisque leo fringilla vel.</div>
@endslot
@slot('code')
<div class="none:overflow-auto sm:overflow-visible md:overflow-hidden lg:overflow-x-scroll xl:overflow-y-scroll ...">
  Lorem ipsum dolor sit amet...
</div>
@endslot
@endcomponent

## Customizing

@include('_partials.variants-and-disabling', [
    'utility' => [
        'name' => 'overflow',
        'property' => 'overflow',
    ],
    'variants' => [
        'responsive',
    ],
])

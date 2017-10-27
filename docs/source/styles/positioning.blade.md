---
extends: _layouts.markdown
title: "Positioning"
---

# Positioning

<div class="text-xl text-slate-light">
    Utilities for controlling how an element is positioned in the DOM.
</div>

<div class="subnav">
    <a class="subnav-link" href="#responsive">Responsive</a>
</div>

### Static <span class="ml-2 font-semibold text-slate-light text-sm uppercase tracking-wide">Default</span>

Use `.static` to position an element according to the normal flow of the document.

Any offsets will be ignored and the element will not act as a position reference for absolutely positioned children.

@component('_partials.code-sample')
<div class="relative bg-smoke p-4">
  <div class="static h-32 bg-smoke-darker p-4 text-slate-darker">
    <p>Static parent</p>
    <div class="absolute pin-b pin-l bg-slate-dark p-4 text-smoke">
      <p>Absolute child</p>
    </div>
  </div>
</div>

@slot('code')
<div class="static bg-smoke-darker">
  Static parent
  <div class="absolute pin-b pin-l bg-slate-dark">
    Absolute child
  </div>
</div>
@endslot
@endcomponent

### Relative

Use `.relative` to position an element according to the normal flow of the document.

Offsets are calculated relative to the element's normal position and the element *will* act as a position reference for absolutely positioned children.

@component('_partials.code-sample')
<div class="relative bg-smoke p-4">
  <div class="relative h-32 bg-smoke-darker p-4 text-slate-darker">
    <p>Relative parent</p>
    <div class="absolute pin-b pin-l bg-slate-dark p-4 text-smoke">
      <p>Absolute child</p>
    </div>
  </div>
</div>

@slot('code')
<div class="relative bg-smoke-darker">
  Relative parent
  <div class="absolute pin-b pin-l bg-slate-dark">
    Absolute child
  </div>
</div>
@endslot
@endcomponent

### Absolute

Use `.absolute` to position an element *outside* of the normal flow of the document, causing neighboring elements to act as if the element doesn't exist.

Offsets are calculated relative to the nearest parent that has a position other than `static`, and the element *will* act as a position reference for other absolutely positioned children.

@component('_partials.code-sample')
<div class="relative bg-smoke px-4 pt-2 pb-4">
  <p class="mb-2">Relative parent</p>
  <div class="static bg-smoke-darker p-4 text-slate-darker">
    <p class="mb-2">Static parent</p>
    <div class="absolute pin-b pin-l bg-slate-dark p-4 text-smoke">
      <p>Absolute child</p>
    </div>
    <div class="bg-smoke pt-4 px-8 pb-8 text-slate-darker inline-block">
      <p>Static sibling</p>
    </div>
  </div>
</div>

@slot('code')
<div class="relative bg-smoke">
  Relative parent
  <div class="static bg-smoke-darker">
    Static parent
    <div class="absolute pin-b pin-l bg-slate-dark">
      Absolute child
    </div>
    <div class="bg-smoke inline-block">
      Static sibling
    </div>
  </div>
</div>
@endslot
@endcomponent

### Fixed

Use `.fixed` to position an element relative to the browser window.

Offsets are calculated relative to the viewport and the element *will* act as a position reference for absolutely positioned children.

@component('_partials.code-sample')
<div class="relative bg-smoke h-48">
  <div class="absolute pin-l pin-r pin-t bg-slate-dark text-smoke z-10 px-4 py-3">
    Fixed child
    <div class="absolute pin-t pin-b pin-r px-4 py-3 bg-smoke-dark text-slate-dark">
      Absolute child
    </div>
  </div>
  <div class="absolute pin overflow-auto pt-16 px-4 pb-4">
    <p class="mb-4">Scroll me!</p>

    <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. </p>

    <p class="mb-4">Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. </p>

    <p class="mb-4">Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. </p>

    <p class="mb-4">Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. </p>

    <p class="mb-4">Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo. Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, sagittis at, neque. </p>

    <p class="mb-4">Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula. Nulla ut felis in purus aliquam imperdiet. Maecenas aliquet mollis lectus. Vivamus consectetuer risus et tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. </p>

    <p class="mb-4">Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. </p>

    <p>Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. </p>
  </div>
</div>

@slot('code')
<div class="bg-smoke">
  <div class="fixed bg-smoke-darker">
    Fixed child
    <div class="absolute pin-t pin-r bg-slate-dark">
      Absolute child
    </div>
  </div>
  Scroll me!

  Lorem ipsum...
</div>
@endslot
@endcomponent


## Responsive

To apply an overflow utility only at a specific breakpoint, add a `{breakpoint}:` prefix to the existing class name. For example, adding the class `md:overflow-scroll` to an element would apply the `overflow-scroll` utility at medium screen sizes and above.

For more information about Tailwind's responsive design features, check out the [Responsive Design](/workflow/responsive-design) documentation.

@component('_partials.responsive-code-sample')
@slot('none')
@endslot

@slot('sm')
@endslot

@slot('md')
@endslot

@slot('xl')
@endslot

@slot('code')
@endslot
@endcomponent

---
extends: _layouts.markdown
title: "Alerts"
---

# Alerts

We don't ship alert components because every app has it's own visual style, and they are so easy to build out of utilities.

Here's a bunch of examples:

### Bootstrap Style

<div class="border border-dark-softer rounded mask">
  <div class="p-6 border-b border-dark-softer">
    <div class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded">
      <strong>Holy smokes!</strong> Something seriously bad happened.
    </div>
  </div>
  <div>
    <pre class="markdown language-html" style="margin: 0;"><code>{{
'<div class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded">
  <strong>Holy smokes!</strong> Something seriously bad happened.
</div>'
    }}</code></pre>
  </div>
</div>

### HelpScout Style

<div class="border border-dark-softer rounded mask">
  <div class="p-6 border-b border-dark-softer">
    <div class="bg-orange-lightest border-l-4 border-orange text-orange-dark p-4">
      Something not ideal might be happening.
    </div>
  </div>
  <div>
    <pre class="markdown language-html" style="margin: 0;"><code>{{
'<div class="bg-orange-lightest border-l-4 border-orange text-orange-dark p-4">
  Something not ideal might be happening.
</div>'
    }}</code></pre>
  </div>
</div>

### Heroku Style

<div class="border border-dark-softer rounded mask">
  <div class="p-6 border-b border-dark-softer">
    <div class="bg-blue text-light text-sm text-bold px-4 py-3">
      Something happened that you should know about but is probably good or at least not bad.
    </div>
  </div>
  <div>
    <pre class="markdown language-html" style="margin: 0;"><code>{{
'<div class="bg-blue text-light text-sm text-bold px-4 py-3">
  Something happened that you should know about but is probably good or at least not bad.
</div>'
    }}</code></pre>
  </div>
</div>

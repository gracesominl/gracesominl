---
layout: default
title: Beings
permalink: /beings/
---

<section class="beings-intro">
  <p>
    A small floating network of animals, humans, objects, robots, and other beings.
    Each being carries features, fragments, and a story.
  </p>
</section>

<section class="beings-network" aria-label="Interactive beings network">
  <div class="beings-stage" data-beings-stage></div>
  <aside class="beings-panel" data-beings-panel aria-live="polite">
    <p>Select a being.</p>
  </aside>
</section>

<script type="application/json" id="beings-data">
  {{ site.data.beings | jsonify }}
</script>
<script src="{{ '/assets/js/beings-network.js' | relative_url }}"></script>

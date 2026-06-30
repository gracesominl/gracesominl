---
layout: default
title: Beings
permalink: /beings/
hide_nav: true
hide_banner: true
---

<nav class="top-nav">  
  <div class="nav-container">
    <a href="https://gracesominlee.github.io" class="nav-logo-link">
      <img src="{{ '/assets/img/butterfly1.PNG' | relative_url }}" alt="Home" class="nav-logo-img">
      <span class="nav-logo-name">Grace Somin Lee</span>
    </a>

    <div class="nav-links">
      <a href="{{ '/about/' | relative_url }}">About Me</a>
      <a href="{{ '/projects/' | relative_url }}">Projects</a>
      <a href="{{ '/beings/' | relative_url }}">Beings</a>
    </div>
  </div>
</nav>

<div style="text-align: center; margin-top: 10px;">
  <a href="https://gracesominlee.github.io">
    <img
      src="https://capsule-render.vercel.app/api?type=blur&color=timeGradient&height=180&section=header&text=Beings&fontSize=35&fontColor=474747"
      alt="Beings Banner"
      style="max-width: 100%;"
    />
  </a>
</div>

<section class="beings-intro">
  <p>
    A small floating network of animals, humans, objects, robots, and other beings.
    Each being carries features, fragments, and a story.
  </p>
</section>

<section class="beings-network" aria-label="Interactive beings network">
  <div class="beings-stage" data-beings-stage></div>
</section>

<script type="application/json" id="beings-data">
  {{ site.data.beings | jsonify }}
</script>
<script src="{{ '/assets/js/beings-network.js' | relative_url }}"></script>

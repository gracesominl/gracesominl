(function () {
  const stage = document.querySelector("[data-beings-stage]");
  const panel = document.querySelector("[data-beings-panel]");
  const dataEl = document.getElementById("beings-data");

  if (!stage || !panel || !dataEl) return;

  let beings = [];

  try {
    beings = JSON.parse(dataEl.textContent.trim() || "[]");
  } catch (error) {
    panel.innerHTML = "<p>The beings data could not be loaded.</p>";
    return;
  }

  if (!beings.length) {
    stage.innerHTML = '<p class="beings-empty">No beings have been added yet.</p>';
    return;
  }

  const nodes = beings.map((being, index) => {
    const button = document.createElement("button");
    const img = document.createElement("img");
    const label = document.createElement("span");
    const size = 72 + (index % 3) * 10;

    button.type = "button";
    button.className = "being-node";
    button.style.setProperty("--being-size", `${size}px`);
    button.setAttribute("aria-label", `View ${being.name}`);

    img.src = being.image;
    img.alt = being.name;
    img.loading = "lazy";

    label.textContent = being.name;

    button.append(img, label);
    stage.appendChild(button);

    button.addEventListener("click", () => {
      stage.querySelectorAll(".being-node").forEach((node) => {
        node.classList.remove("is-selected");
      });
      button.classList.add("is-selected");
      renderPanel(being);
    });

    return {
      el: button,
      being,
      x: 40 + Math.random() * 320,
      y: 40 + Math.random() * 220,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size
    };
  });

  renderPanel(beings[0]);
  nodes[0].el.classList.add("is-selected");

  function renderPanel(being) {
    const features = Array.isArray(being.features) ? being.features : [];
    const featureList = features.length
      ? `<ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>`
      : "<p>No features added yet.</p>";

    panel.innerHTML = `
      <p class="beings-panel-label">${escapeHtml(being.kind || "being")}</p>
      <h2>${escapeHtml(being.name)}</h2>
      <div class="beings-panel-image-wrap">
        <img src="${escapeAttribute(being.image)}" alt="${escapeAttribute(being.name)}">
      </div>
      <h3>Features</h3>
      ${featureList}
      <h3>Story</h3>
      <p>${escapeHtml(being.story || "No story added yet.")}</p>
    `;
  }

  function animate() {
    const rect = stage.getBoundingClientRect();
    const maxX = Math.max(rect.width - 120, 1);
    const maxY = Math.max(rect.height - 120, 1);

    nodes.forEach((node, index) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 8 || node.x >= maxX) node.vx *= -1;
      if (node.y <= 8 || node.y >= maxY) node.vy *= -1;

      node.x = clamp(node.x, 8, maxX);
      node.y = clamp(node.y, 8, maxY);

      const drift = Math.sin(Date.now() / 1100 + index) * 4;
      node.el.style.transform = `translate(${node.x}px, ${node.y + drift}px)`;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
  }
})();

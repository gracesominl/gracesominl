(function () {
  const stage = document.querySelector("[data-beings-stage]");
  const dataEl = document.getElementById("beings-data");

  if (!stage || !dataEl) return;

  let beings = [];
  let activeCard = null;

  try {
    beings = JSON.parse(dataEl.textContent.trim() || "[]");
  } catch (error) {
    stage.innerHTML = '<p class="beings-empty">The beings data could not be loaded.</p>';
    return;
  }

  if (!beings.length) {
    stage.innerHTML = '<p class="beings-empty">No beings have been added yet.</p>';
    return;
  }

  const nodes = beings.map((being, index) => {
    const button = document.createElement("button");
    const img = document.createElement("img");
    const size = 42 + (index % 3) * 6;

    button.type = "button";
    button.className = "being-node";
    button.style.setProperty("--being-size", `${size}px`);
    button.setAttribute("aria-label", `View ${being.name}`);

    img.src = being.image;
    img.alt = being.name;
    img.loading = "lazy";

    button.append(img);
    stage.appendChild(button);

    button.addEventListener("click", () => {
      closeCard();
      button.classList.add("is-selected");
      renderCard(being, button);
    });

    return {
      el: button,
      being,
      x: 24 + Math.random() * 520,
      y: 24 + Math.random() * 420,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size
    };
  });

  stage.addEventListener("click", (event) => {
    if (!event.target.closest(".being-node") && !event.target.closest(".being-card")) {
      closeCard();
    }
  });

  function renderCard(being, nodeEl) {
    const features = Array.isArray(being.features) ? being.features : [];
    const featureList = features.length
      ? `<ul>${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>`
      : "<p>No features added yet.</p>";

    activeCard = document.createElement("article");
    activeCard.className = "being-card";
    activeCard.setAttribute("aria-live", "polite");
    activeCard.innerHTML = `
      <button type="button" class="being-card-close" aria-label="Close ${escapeAttribute(being.name)} details">x</button>
      <p class="being-card-label">${escapeHtml(being.kind || "being")}</p>
      <h2>${escapeHtml(being.name)}</h2>
      <div class="being-card-image-wrap">
        <img src="${escapeAttribute(being.image)}" alt="${escapeAttribute(being.name)}">
      </div>
      <h3>Features</h3>
      ${featureList}
      <h3>Story</h3>
      <p>${escapeHtml(being.story || "No story added yet.")}</p>
    `;

    stage.appendChild(activeCard);
    activeCard.querySelector(".being-card-close").addEventListener("click", closeCard);
    positionCard(activeCard, nodeEl);
  }

  function closeCard() {
    if (activeCard) {
      activeCard.remove();
      activeCard = null;
    }
    stage.querySelectorAll(".being-node").forEach((node) => {
      node.classList.remove("is-selected");
    });
  }

  function positionCard(card, nodeEl) {
    const stageRect = stage.getBoundingClientRect();
    const nodeRect = nodeEl.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const margin = 14;
    const nodeX = nodeRect.left - stageRect.left;
    const nodeY = nodeRect.top - stageRect.top;
    let x = nodeX + nodeRect.width + margin;
    let y = nodeY;

    if (x + cardRect.width > stageRect.width - margin) {
      x = nodeX - cardRect.width - margin;
    }

    x = clamp(x, margin, Math.max(stageRect.width - cardRect.width - margin, margin));
    y = clamp(y, margin, Math.max(stageRect.height - cardRect.height - margin, margin));

    card.style.transform = `translate(${x}px, ${y}px)`;
  }

  function animate() {
    const rect = stage.getBoundingClientRect();
    const maxX = Math.max(rect.width - 88, 1);
    const maxY = Math.max(rect.height - 88, 1);

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

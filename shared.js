// ShopNasGfx Tracker — Shared Feedback Backend
// Replace Formspree + ntfy calls with Neo API

const SHOPNASGFX_API = "https://innergneo.tail549d84.ts.net";

// Submit feedback to Neo API (replaces Formspree + ntfy)
async function submitFeedbackToApi(data) {
  const resp = await fetch(`${SHOPNASGFX_API}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return resp.json();
}

// Load persisted timeline entries from Neo API
async function loadTimelineEntries(project) {
  try {
    const resp = await fetch(`${SHOPNASGFX_API}/timeline/${project}`);
    return await resp.json();
  } catch (e) {
    console.log("Timeline load error:", e);
    return [];
  }
}

// Render API timeline entries into the page
function renderApiTimeline(entries) {
  const timeline = document.querySelector(".timeline");
  if (!timeline || entries.length === 0) return;

  const sectionTitle = timeline.querySelector(".section-title");
  if (!sectionTitle) return;

  const dotColors = {
    feedback: "dot-yellow",
    approval: "dot-green",
    update: "dot-blue",
  };

  const typeLabels = {
    feedback: "Client Feedback",
    approval: "Client Approved",
    update: "Update",
  };

  entries.forEach((entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
      <div class="timeline-dot ${
        dotColors[entry.type] || "dot-blue"
      }"></div>
      <div>
        <div class="timeline-text"><strong>${typeLabels[entry.type] || "Update"} — ${
      entry.name
    }</strong> ${entry.message}</div>
        <div class="timeline-time">${date}</div>
      </div>
    `;

    // Insert after section title
    if (sectionTitle.nextSibling) {
      timeline.insertBefore(div, sectionTitle.nextSibling);
    } else {
      timeline.appendChild(div);
    }
  });
}

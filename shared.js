// ShopNasGfx Tracker — Shared Feedback Backend
const SHOPNASGFX_API = "https://innergneo.tail549d84.ts.net";

async function submitFeedbackToApi(data) {
  const resp = await fetch(SHOPNASGFX_API + "/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return resp.json();
}

async function loadTimelineEntries(projectKey) {
  try {
    const resp = await fetch(SHOPNASGFX_API + "/timeline/" + projectKey);
    return await resp.json();
  } catch (e) {
    console.log("Timeline load error:", e);
    return [];
  }
}

function renderApiTimeline(entries) {
  const timeline = document.querySelector(".timeline");
  if (!timeline || entries.length === 0) return;

  const sectionTitle = timeline.querySelector(".section-title");
  if (!sectionTitle) return;

  const dotColors = { feedback: "dot-yellow", approval: "dot-green", update: "dot-blue" };
  const typeIcons = { feedback: "💬", approval: "✅", update: "📢" };
  const typeLabels = { feedback: "Client Feedback", approval: "Client Approved", update: "Update" };

  entries.forEach(function(entry) {
    var date = new Date(entry.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    var div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = '<div class="timeline-dot ' + (dotColors[entry.type] || "dot-blue") + '"></div>' +
      '<div><div class="timeline-text"><strong>' + (typeLabels[entry.type] || "Update") + ' — ' + entry.name + '</strong> ' + entry.message + '</div>' +
      '<div class="timeline-time">' + date + '</div></div>';
    if (sectionTitle.nextSibling) {
      timeline.insertBefore(div, sectionTitle.nextSibling);
    } else {
      timeline.appendChild(div);
    }
  });
}

// Auto-load on page load
(function() {
  // Extract project key from page URL (e.g. /amber/ → "amber")
  var pathParts = window.location.pathname.replace(/\/$/, "").split("/");
  var projectKey = pathParts[pathParts.length - 1];
  if (projectKey && projectKey !== "shopnasgfx-tracker") {
    loadTimelineEntries(projectKey).then(function(entries) {
      if (entries.length > 0) renderApiTimeline(entries);
    });
  }
})();

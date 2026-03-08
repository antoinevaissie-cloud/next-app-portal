import { widgetStyles } from "./styles";

interface WidgetApp {
  id: string;
  appName: string;
  productionUrl: string;
  iconUrl: string;
  iconColor: string;
}

(function () {
  const script = document.currentScript as HTMLScriptElement | null;
  if (!script) return;

  const portalUrl = script.dataset.portalUrl || "";
  const currentApp = script.dataset.currentApp || "";
  const position = script.dataset.position || "top-right";

  if (!portalUrl) {
    console.warn("[App Switcher] data-portal-url is required");
    return;
  }

  const host = document.createElement("div");
  host.id = "app-switcher-widget";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "closed" });

  // Inject styles
  const style = document.createElement("style");
  style.textContent = widgetStyles;
  shadow.appendChild(style);

  // Waffle button
  const trigger = document.createElement("button");
  trigger.className = `app-switcher-trigger ${position}`;
  trigger.setAttribute("aria-label", "Open app switcher");
  trigger.innerHTML = `
    <div class="waffle-icon">
      ${Array(9).fill('<div class="waffle-dot"></div>').join("")}
    </div>
  `;
  shadow.appendChild(trigger);

  // Panel
  const panel = document.createElement("div");
  panel.className = `app-switcher-panel ${position}`;
  panel.innerHTML = `
    <div class="panel-header">Apps</div>
    <div class="app-grid">
      <div class="loading">Loading apps...</div>
    </div>
    <div class="panel-footer">
      <a href="${portalUrl}" target="_blank" rel="noopener noreferrer">More from App Portal</a>
    </div>
  `;
  shadow.appendChild(panel);

  let isOpen = false;
  let appsLoaded = false;

  function toggle() {
    isOpen = !isOpen;
    panel.classList.toggle("open", isOpen);
    if (isOpen && !appsLoaded) {
      loadApps();
    }
  }

  function close() {
    isOpen = false;
    panel.classList.remove("open");
  }

  async function loadApps() {
    const grid = panel.querySelector(".app-grid")!;
    try {
      const apiUrl = portalUrl.replace(/\/$/, "") + "/api/widget/apps";
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch");
      const apps: WidgetApp[] = await res.json();
      appsLoaded = true;

      grid.innerHTML = apps
        .map((app) => {
          const isCurrent = currentApp && app.appName.toLowerCase() === currentApp.toLowerCase();
          return `
            <a class="app-tile${isCurrent ? " current" : ""}" href="${escapeHtml(app.productionUrl)}" target="_blank" rel="noopener noreferrer">
              <div class="app-icon" style="background:${escapeHtml(app.iconColor)}">
                <img src="${escapeHtml(app.iconUrl)}" alt="${escapeHtml(app.appName)}" />
              </div>
              <span class="app-name">${escapeHtml(app.appName)}</span>
            </a>
          `;
        })
        .join("");
    } catch {
      grid.innerHTML = '<div class="loading">Failed to load apps</div>';
    }
  }

  function escapeHtml(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener("click", () => close());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  panel.addEventListener("click", (e) => e.stopPropagation());
})();
